// Recco v2 — main app router
// MVP trim: removed accounts/sign-in, profile, saved, group, paywall,
// chat, moods, flavor swipe, restaurant picker. Camera scans whatever
// menu is in front of you (uses default restaurant for the demo).

const STORAGE_KEY = 'recco-v2-state';

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
    profile: { diet: 'balanced', allergens: [] },
    historyExtra: [],
  };
}

function ReccoApp({ initialRoute = 'landing' }) {
  const [state, setState] = React.useState(() => loadState() || defaultState());
  const [route, setRoute] = React.useState(() => {
    const s = loadState();
    if (s?.onboarded) return 'home';
    return initialRoute;
  });
  const [activeDishId, setActiveDishId] = React.useState(null);
  const [activeScan, setActiveScan] = React.useState(null);

  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const setProfile = (patch) => setState(s => ({ ...s, profile: { ...s.profile, ...patch } }));

  // For MVP, demo always uses the default restaurant — no picker, no
  // geolocation. The camera "scans whatever menu is in front of you".
  const activeRestaurant = RESTAURANTS[DEFAULT_RESTAURANT_ID];
  const ranked = React.useMemo(
    () => rankDishes(activeRestaurant.dishes, state.profile),
    [state.profile, activeRestaurant]
  );
  // Build dish lookup across all restaurants (history may reference others)
  const allDishesRanked = React.useMemo(() => {
    const out = [];
    for (const r of Object.values(RESTAURANTS)) {
      out.push(...rankDishes(r.dishes, state.profile).map(d => ({ ...d, restaurantId: r.id })));
    }
    return out;
  }, [state.profile]);
  const dishesById = React.useMemo(
    () => Object.fromEntries(allDishesRanked.map(d => [d.id, d])),
    [allDishesRanked]
  );
  const history = HISTORY_SCANS;

  const go = (r) => setRoute(r);
  const goBack = () => {
    const map = {
      'diet': 'welcome', 'allergens': 'diet', 'success': 'allergens',
      'history': 'settings', 'settings': 'home',
      'edit-diet': 'settings', 'edit-allergens': 'settings',
      'dish': 'results',
      'scan': 'home', 'analysis': 'scan',
      'results': 'home',
    };
    setRoute(map[route] || 'home');
  };

  const startScan = () => setRoute('scan');
  const onScanDone = () => setRoute('analysis');
  const onAnalysisDone = () => {
    setActiveScan({ restaurant: activeRestaurant, ranked });
    setState(s => ({ ...s, hasScanned: true }));
    setRoute('results');
  };

  const openDish = (id) => { setActiveDishId(id); setRoute('dish'); };

  let screen;
  switch (route) {
    case 'landing':
      screen = <LandingScreen onGetStarted={() => go('welcome')} />;
      break;
    case 'welcome':
      screen = <WelcomeScreen
        onContinue={() => go('diet')}
        onSkip={() => { setState(s => ({ ...s, onboarded: true })); go('home'); }}
      />;
      break;
    case 'diet':
      screen = <DietSelectionScreen
        value={state.profile.diet}
        onChange={(v) => setProfile({ diet: v })}
        onBack={goBack}
        onContinue={() => go('allergens')}
      />;
      break;
    case 'allergens':
      screen = <AllergenSelectionScreen
        value={state.profile.allergens}
        onToggle={(id) => setProfile({ allergens: state.profile.allergens.includes(id) ? state.profile.allergens.filter(a => a !== id) : [...state.profile.allergens, id] })}
        onBack={goBack}
        onContinue={() => { setState(s => ({ ...s, onboarded: true })); go('success'); }}
        onSkip={() => { setState(s => ({ ...s, onboarded: true })); go('success'); }}
      />;
      break;
    case 'success':
      screen = <OnboardingSuccessScreen profile={state.profile} onContinue={startScan} />;
      break;
    case 'home': {
      const isNewUser = (state.historyExtra?.length || 0) === 0 && !state.hasScanned;
      screen = (
        <HomeScreen
          profile={state.profile}
          history={isNewUser ? [] : history}
          dishesById={dishesById}
          isNewUser={isNewUser}
          onNav={go}
          onScan={startScan}
          onOpenSettings={() => go('settings')}
          onOpenScan={(scan) => {
            const rid = scan && scan.restaurantId;
            if (rid && RESTAURANTS[rid]) {
              const r = RESTAURANTS[rid];
              setActiveScan({ restaurant: r, ranked: rankDishes(r.dishes, state.profile) });
            } else {
              setActiveScan({ restaurant: activeRestaurant, ranked });
            }
            go('results');
          }}
        />
      );
      break;
    }
    case 'history':
      screen = <HistoryScreen history={history} onBack={() => go('settings')} onOpen={(scan) => {
        const rid = scan && scan.restaurantId;
        if (rid && RESTAURANTS[rid]) {
          const r = RESTAURANTS[rid];
          setActiveScan({ restaurant: r, ranked: rankDishes(r.dishes, state.profile) });
        } else {
          setActiveScan({ restaurant: activeRestaurant, ranked });
        }
        go('results');
      }} />;
      break;
    case 'settings':
      screen = <SettingsScreen
        profile={state.profile}
        onBack={() => go('home')}
        onNav={go}
        onEditDiet={() => go('edit-diet')}
        onEditAllergens={() => go('edit-allergens')}
        onResetData={() => { localStorage.removeItem(STORAGE_KEY); setState(defaultState()); go('landing'); }}
      />;
      break;
    case 'edit-diet':
      screen = <EditDietScreen value={state.profile.diet} onChange={(v) => setProfile({ diet: v })} onBack={goBack} />;
      break;
    case 'edit-allergens':
      screen = <EditAllergensScreen value={state.profile.allergens} onToggle={(id) => setProfile({ allergens: state.profile.allergens.includes(id) ? state.profile.allergens.filter(a => a !== id) : [...state.profile.allergens, id] })} onBack={goBack} />;
      break;
    case 'scan':
      screen = <CameraScanScreen restaurant={activeRestaurant} onBack={() => go('home')} onComplete={onScanDone} />;
      break;
    case 'analysis':
      screen = <AIAnalysisScreen profile={state.profile} onComplete={onAnalysisDone} />;
      break;
    case 'results':
      screen = <ResultsScreen
        restaurant={(activeScan && activeScan.restaurant) || activeRestaurant}
        dishes={(activeScan && activeScan.ranked) || ranked}
        onBack={() => go('home')}
        onOpenDish={openDish}
      />;
      break;
    case 'dish':
      screen = <DishDetailScreen
        dish={dishesById[activeDishId]}
        onBack={() => go('results')}
      />;
      break;
    default:
      screen = <div>Unknown route</div>;
  }

  return (
    <div className="recco-app" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {screen}
    </div>
  );
}

window.ReccoApp = ReccoApp;
