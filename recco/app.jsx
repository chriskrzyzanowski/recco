// Recco — main app router + state store

const STORAGE_KEY = 'recco-state-v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function defaultState() {
  return {
    onboarded: false,
    profile: { diet: 'balanced', dietTag: null, allergens: [], name: 'You', email: null, tastes: null },
    saved: [],            // dish ids
    historyExtra: [],     // additional past scans (besides seeded)
    layoutVariant: 'stack',
    mood: null,           // session: null | 'healthy' | 'comfort' | 'adventurous' | 'familiar'
    hunger: null,         // session: null | 'light' | 'moderate' | 'hungry' | 'very-hungry'
    meals: [],            // [{ dishId, rating: 'up'|'down'|'wrong', at: timestamp }]
    activeRestaurantId: DEFAULT_RESTAURANT_ID, // which restaurant the user is currently 'at'
  };
}

function ReccoApp({ initialRoute = 'landing' }) {
  const [state, setState] = React.useState(() => loadState() || defaultState());
  const [route, setRoute] = React.useState(() => {
    // If user already onboarded on a previous session, go straight to home
    const s = loadState();
    if (s?.onboarded) return 'home';
    return initialRoute;
  });
  const [activeDishId, setActiveDishId] = React.useState(null);
  const [activeScan, setActiveScan] = React.useState(null); // { restaurant, ranked }
  const [chatDishId, setChatDishId] = React.useState(null);

  // Persist
  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  // Update profile helper
  const setProfile = (patch) => setState(s => ({ ...s, profile: { ...s.profile, ...patch } }));
  const toggleSave = (id) => setState(s => ({
    ...s, saved: s.saved.includes(id) ? s.saved.filter(x => x !== id) : [...s.saved, id]
  }));
  const setLayout = (v) => setState(s => ({ ...s, layoutVariant: v }));
  const setMood = (m) => setState(s => ({ ...s, mood: s.mood === m ? null : m }));
  // Record a meal feedback. rating ∈ 'up' | 'down' | 'wrong'.
  // Replaces any previous feedback for the same dish.
  const logMeal = (dishId, rating) => setState(s => ({
    ...s,
    meals: [...s.meals.filter(m => m.dishId !== dishId), { dishId, rating, at: Date.now() }],
  }));
  const clearMeal = (dishId) => setState(s => ({
    ...s, meals: s.meals.filter(m => m.dishId !== dishId),
  }));

  // Profile (with mood) used for ranking
  const rankingProfile = React.useMemo(
    () => ({ ...state.profile, mood: state.mood }),
    [state.profile, state.mood]
  );

  // Active restaurant — what the user is 'at'. Falls back to default if missing.
  const activeRestaurantId = state.activeRestaurantId || DEFAULT_RESTAURANT_ID;
  const activeRestaurant = RESTAURANTS[activeRestaurantId] || RESTAURANTS[DEFAULT_RESTAURANT_ID];
  const setActiveRestaurant = (id) => setState(s => ({ ...s, activeRestaurantId: id }));

  // Build a ranked dictionary across ALL restaurants so dish lookups work
  // regardless of which restaurant the dish belongs to (for History/Saved).
  const allDishesRanked = React.useMemo(() => {
    const out = [];
    for (const r of Object.values(RESTAURANTS)) {
      out.push(...rankDishes(r.dishes, rankingProfile).map(d => ({ ...d, restaurantId: r.id })));
    }
    return out;
  }, [rankingProfile]);

  // Ranked dishes for the active restaurant (used by Results)
  const ranked = React.useMemo(
    () => rankDishes(activeRestaurant.dishes, rankingProfile),
    [rankingProfile, activeRestaurant]
  );
  const dishesById = React.useMemo(
    () => Object.fromEntries(allDishesRanked.map(d => [d.id, d])),
    [allDishesRanked]
  );
  const savedSet = React.useMemo(() => new Set(state.saved), [state.saved]);
  const history = HISTORY_SCANS;

  // Navigation helpers
  const go = (r) => setRoute(r);
  const goBack = () => {
    // simple back map
    const map = {
      'setup': 'landing',
      'history': 'home', 'saved': 'home', 'profile': 'home',
      'edit-diet': 'profile', 'edit-allergens': 'profile',
      'paywall': 'profile',
      'results': 'home', 'dish': 'results', 'chat': 'dish',
      'scan': 'home',
    };
    setRoute(map[route] || 'home');
  };

  // Action: start a scan flow
  const startScan = () => setRoute('scan');
  // Scan animation finishes -> jump straight to results (skip the
  // analysis screen — simpler MVP flow).
  const onScanDone = () => {
    setActiveScan({ restaurant: activeRestaurant, ranked });
    setState(s => ({ ...s, hasScanned: true, onboarded: true }));
    setRoute('results');
  };

  const openDish = (id) => { setActiveDishId(id); setRoute('dish'); };
  const askAI = (id) => {
    // No-op in demo mode — the chat backend (window.claude.complete) only
    // exists inside Claude's design canvas. Flip RECCO_ENABLE_LIVE_AI in
    // Recco.html once a real chat backend is wired.
    if (!window.RECCO_ENABLE_LIVE_AI) return;
    setChatDishId(id); setRoute('chat');
  };

  // Map route → screen
  let screen;
  switch (route) {
    case 'landing':
      screen = <LandingScreen onGetStarted={() => go('setup')} />;
      break;
    case 'setup':
      screen = <ProfileSetupScreen
        profile={state.profile}
        mood={state.mood}
        hunger={state.hunger}
        onUpdateProfile={setProfile}
        onSetMood={(m) => setState(s => ({ ...s, mood: m }))}
        onSetHunger={(h) => setState(s => ({ ...s, hunger: h }))}
        onBack={() => go('landing')}
        onContinue={() => {
          setState(s => ({ ...s, onboarded: true }));
          startScan();
        }}
      />;
      break;
    case 'home':
      // "New user" = just onboarded, never scanned, no saves, no rated meals.
      // Hides the seeded history/saved demos until they earn it.
      const isNewUser = state.saved.length === 0
        && state.meals.length === 0
        && (state.historyExtra?.length || 0) === 0
        && !state.hasScanned;
      screen = (
        <>
          <HomeScreen
            profile={state.profile}
            mood={state.mood}
            onSetMood={setMood}
            history={isNewUser ? [] : history}
            saved={state.saved}
            dishesById={dishesById}
            isNewUser={isNewUser}
            onNav={go}
            onScan={startScan}
            activeRestaurantId={activeRestaurantId}
            onSelectRestaurant={setActiveRestaurant}
            onOpenScan={() => { setActiveScan({ restaurant: activeRestaurant, ranked }); go('results'); }}
            onOpenDish={openDish}
          />
          <TabBar active="home" onNav={go} />
        </>
      );
      break;
    case 'history':
      screen = <HistoryScreen history={history} onBack={() => go('home')} onOpen={(scan) => {
        // Switch active restaurant to the scanned one, then open results
        const rid = scan && scan.restaurantId;
        if (rid && RESTAURANTS[rid]) {
          setActiveRestaurant(rid);
          const r = RESTAURANTS[rid];
          const rankedR = rankDishes(r.dishes, rankingProfile);
          // Preserve original scan date so reopened history doesn't say "Just now"
          setActiveScan({ restaurant: { ...r, scannedAt: scan.scannedAt }, ranked: rankedR });
        } else {
          setActiveScan({ restaurant: activeRestaurant, ranked });
        }
        go('results');
      }} onNav={go} />;
      break;
    case 'saved':
      screen = <SavedScreen saved={state.saved} dishesById={dishesById} onBack={() => go('home')} onOpen={openDish} onToggleSave={toggleSave} onNav={go} />;
      break;
    case 'profile':
      screen = <ProfileScreen
        profile={state.profile}
        savedCount={state.saved.length}
        scanCount={history.length + 1}
        mealCount={state.meals.length}
        onNav={go}
        onOpen={(r) => go(r)}
        onSignOut={() => { localStorage.removeItem(STORAGE_KEY); setState(defaultState()); go('landing'); }}
      />;
      break;
    case 'edit-diet':
      screen = <EditDietScreen value={state.profile.diet} onChange={(v) => setProfile({ diet: v })} onBack={goBack} />;
      break;
    case 'edit-allergens':
      screen = <EditAllergensScreen value={state.profile.allergens} onToggle={(id) => setProfile({ allergens: state.profile.allergens.includes(id) ? state.profile.allergens.filter(a => a !== id) : [...state.profile.allergens, id] })} onBack={goBack} />;
      break;
    case 'paywall':
      screen = <PaywallScreen
        isPro={!!state.profile.isPro}
        source={state.paywallSource || 'profile'}
        onBack={() => go('profile')}
        onStartTrial={(plan) => {
          setProfile({ isPro: true, plan });
          setState(s => ({ ...s, paywallSource: null }));
          go('profile');
        }}
      />;
      break;
    case 'scan':
      screen = <CameraScanScreen restaurant={activeRestaurant} onBack={() => go('home')} onComplete={onScanDone} />;
      break;
    case 'results':
      screen = <ResultsScreen
        restaurant={(activeScan && activeScan.restaurant) || activeRestaurant}
        dishes={(activeScan && activeScan.ranked) || ranked}
        profile={state.profile}
        savedSet={savedSet}
        layout={state.layoutVariant}
        onBack={() => go('home')}
        onOpenDish={openDish}
        onToggleSave={toggleSave}
        onAskAI={askAI}
      />;
      break;
    case 'dish':
      screen = <DishDetailScreen
        dish={dishesById[activeDishId]}
        saved={savedSet.has(activeDishId)}
        meal={state.meals.find(m => m.dishId === activeDishId)}
        onBack={() => go('results')}
        onToggleSave={toggleSave}
        onAskAI={askAI}
        onLogMeal={logMeal}
        onClearMeal={clearMeal}
      />;
      break;
    case 'chat':
      screen = <DishChatScreen dish={dishesById[chatDishId]} onBack={() => go('dish')} />;
      break;
    default:
      screen = <div>Unknown route</div>;
  }

  // Tweaks panel for layout variant
  const [tweaksOpen, setTweaksOpen] = React.useState(false);
  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div className="recco-app" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {screen}
      {tweaksOpen && (
        <div style={{
          position: 'absolute', bottom: 100, left: 16, right: 16, zIndex: 50,
          background: 'var(--paper)', borderRadius: 'var(--r-lg)',
          border: '1px solid var(--sand)', padding: 14,
          boxShadow: 'var(--shadow-3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <SectionLabel>Tweaks</SectionLabel>
            <button onClick={() => { setTweaksOpen(false); window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); }} style={{ color: 'var(--char-3)' }}><Icons.X size={16} /></button>
          </div>
          <div style={{ fontSize: 12, color: 'var(--char-2)', marginBottom: 8 }}>Results layout</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['stack', 'cards', 'compare'].map(v => (
              <button key={v} onClick={() => setLayout(v)} style={{
                flex: 1, padding: '8px', borderRadius: 'var(--r-sm)',
                background: state.layoutVariant === v ? 'var(--char)' : 'var(--cream)',
                color: state.layoutVariant === v ? 'var(--bone)' : 'var(--char)',
                fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
              }}>{v}</button>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: 'var(--char-3)', lineHeight: 1.4 }}>Tap the camera button on Home to see results in your selected layout.</div>
        </div>
      )}
    </div>
  );
}

window.ReccoApp = ReccoApp;
