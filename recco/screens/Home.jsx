// Recco — Home / Dashboard
// Goal: fast to whip out at a restaurant.
// Big "Scan menu" hero CTA. Recent scans + saved dishes as quick-resume.

function HomeScreen({ profile, mood, onSetMood, history, saved, dishesById, onNav, onScan, onOpenScan, onOpenDish, isNewUser, activeRestaurantId, onSelectRestaurant }) {
  const activeRestaurant = RESTAURANTS[activeRestaurantId] || RESTAURANTS[DEFAULT_RESTAURANT_ID];
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 11) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', paddingBottom: 100 }}>
      {/* Header — paddingTop clears iOS status bar */}
      <div style={{ padding: '64px 24px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <ReccoLogo size={26} />
        <button onClick={() => onNav('profile')} style={{
          width: 36, height: 36, borderRadius: '50%', background: 'var(--cream)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--char-2)',
        }}><Icons.User size={18} /></button>
      </div>

      {/* Greeting */}
      <div style={{ padding: '8px 24px 18px' }}>
        <div style={{ color: 'var(--char-3)', fontSize: 14, fontWeight: 500 }}>{greeting},</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 2 }}>What are you eating tonight?</div>
      </div>

      {/* Restaurant picker — simulates being 'at' a place. In a real app this
          is auto-detected via geofence + menu header. Here we let the user
          tap-to-switch so the demo can show all four restaurants. */}
      <div style={{ padding: '0 24px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <SectionLabel>You're at</SectionLabel>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--char-3)' }}>Tap to switch</span>
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -24px', padding: '0 24px 4px' }}>
          {Object.values(RESTAURANTS).map(r => {
            const active = r.id === activeRestaurantId;
            return (
              <button key={r.id} onClick={() => onSelectRestaurant && onSelectRestaurant(r.id)} style={{
                flexShrink: 0, width: 184,
                textAlign: 'left',
                borderRadius: 'var(--r-lg)',
                background: active ? 'var(--char)' : 'var(--paper)',
                color: active ? 'var(--bone)' : 'var(--char)',
                border: '1px solid ' + (active ? 'var(--char)' : 'var(--sand)'),
                padding: 12,
                display: 'flex', flexDirection: 'column', gap: 10,
                transition: 'background 0.18s, color 0.18s',
              }}>
                <div style={{
                  height: 56, borderRadius: 'var(--r-md)',
                  background: `linear-gradient(135deg, ${r.accent}, ${r.accent}cc)`,
                  position: 'relative', overflow: 'hidden',
                  display: 'flex', alignItems: 'flex-end', padding: 8,
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 6px)',
                  }} />
                  <div className="mono" style={{ position: 'relative', fontSize: 9, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase' }}>
                    {r.type}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {r.name}
                    {active && <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                      padding: '2px 6px', borderRadius: 'var(--r-full)',
                      background: 'var(--tomato)', color: '#fff',
                    }}>HERE</span>}
                  </div>
                  <div style={{ fontSize: 11, color: active ? 'rgba(250,247,242,0.6)' : 'var(--char-3)', marginTop: 2 }}>
                    {r.neighborhood}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mood selector — the "missing context" the menu doesn't provide.
          Re-ranks the same menu based on the kind of meal you want. */}
      <div style={{ padding: '0 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <SectionLabel>Mood · optional</SectionLabel>
          {mood && (
            <button onClick={() => onSetMood(mood)} style={{ fontSize: 11, fontWeight: 600, color: 'var(--char-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icons.X size={12} stroke={2.4} /> Clear
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', margin: '0 -24px', padding: '0 24px' }}>
          {MOODS.map(m => {
            const active = mood === m.id;
            return (
              <button key={m.id} onClick={() => onSetMood(m.id)} style={{
                flexShrink: 0,
                padding: '10px 14px',
                borderRadius: 'var(--r-full)',
                background: active ? 'var(--char)' : 'var(--paper)',
                color: active ? 'var(--bone)' : 'var(--char)',
                border: '1px solid ' + (active ? 'var(--char)' : 'var(--sand)'),
                fontSize: 13, fontWeight: 600, letterSpacing: '-0.005em',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s',
              }}>
                {m.label}
              </button>
            );
          })}
        </div>
        {mood && (
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--char-2)', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icons.Sparkle size={13} stroke={2.2} />
            {(MOODS.find(m => m.id === mood) || {}).hint} — we'll bias picks accordingly.
          </div>
        )}
      </div>

      {/* Hero scan card */}
      <div style={{ padding: '0 24px' }}>
        <button onClick={onScan} style={{
          width: '100%', borderRadius: 'var(--r-xl)',
          background: 'var(--char)', color: 'var(--bone)',
          padding: '28px 24px',
          display: 'flex', flexDirection: 'column', gap: 18,
          textAlign: 'left',
          position: 'relative', overflow: 'hidden',
          boxShadow: 'var(--shadow-2)',
        }}
        onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.985)'}
        onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {/* tomato accent corner */}
          <div style={{
            position: 'absolute', top: -50, right: -50,
            width: 180, height: 180, borderRadius: '50%',
            background: 'var(--tomato)', opacity: 0.85,
            filter: 'blur(0px)',
          }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--char-3)' }}>SCAN A MENU</div>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(250,247,242,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}>
              <Icons.Camera size={26} stroke={2} />
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 6 }}>Scan {activeRestaurant.name}</div>
            <div style={{ fontSize: 14, color: 'rgba(250,247,242,0.7)', lineHeight: 1.4 }}>
              {mood
                ? `We'll rank ${activeRestaurant.dishes.length} dishes for your ${profile.diet === 'balanced' ? 'profile' : profile.diet} · ${(MOODS.find(m => m.id === mood) || {}).label.toLowerCase()} mood.`
                : `We'll rank ${activeRestaurant.dishes.length} dishes for your ${profile.diet === 'balanced' ? 'taste' : profile.diet} profile in under 5 seconds.`}
            </div>
          </div>
        </button>
      </div>

      {/* Recent scans (hidden for brand-new users) */}
      {!isNewUser && history.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{ padding: '0 24px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <SectionLabel>Recent scans</SectionLabel>
            <button onClick={() => onNav('history')} style={{ fontSize: 12, fontWeight: 600, color: 'var(--char-3)', whiteSpace: 'nowrap' }}>View all</button>
          </div>
          <div style={{ display: 'flex', gap: 12, padding: '0 24px', overflowX: 'auto' }}>
            {history.slice(0, 5).map(s => (
              <button key={s.id} onClick={() => onOpenScan(s.id)} style={{
                flexShrink: 0, width: 180,
                borderRadius: 'var(--r-lg)',
                background: 'var(--paper)',
                border: '1px solid var(--sand)',
                padding: 14,
                textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div style={{
                  height: 70, borderRadius: 'var(--r-md)',
                  background: `linear-gradient(135deg, ${s.color}, ${s.color}aa)`,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 6px)',
                  }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--char-3)', marginTop: 2 }}>{s.scannedAt} · {s.dishCount} dishes</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Saved dishes (hidden for brand-new users) */}
      {!isNewUser && saved.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{ padding: '0 24px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <SectionLabel>Saved dishes</SectionLabel>
            <button onClick={() => onNav('saved')} style={{ fontSize: 12, fontWeight: 600, color: 'var(--char-3)', whiteSpace: 'nowrap' }}>View all</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 24px' }}>
            {saved.slice(0, 2).map(id => {
              const d = dishesById[id];
              if (!d) return null;
              return (
                <button key={id} onClick={() => onOpenDish(id)} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: 10, borderRadius: 'var(--r-md)',
                  background: 'var(--paper)', border: '1px solid var(--sand)',
                  textAlign: 'left',
                }}>
                  <DishThumb dish={d} size={48} radius={10} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--char-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.blurb}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* New-user empty state — replaces history/saved before first real scan */}
      {isNewUser && (
        <div style={{ padding: '28px 24px 0' }}>
          <SectionLabel style={{ marginBottom: 12 }}>Get started</SectionLabel>
          <div style={{
            background: 'var(--paper)',
            border: '1px solid var(--sand)',
            borderRadius: 'var(--r-lg)',
            padding: 18,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { n: '1', icon: <Icons.Camera size={16} />, title: 'Scan your first menu', sub: "Tap the camera button up top, point at a menu, and we'll do the rest." },
                { n: '2', icon: <Icons.Sparkle size={16} />, title: 'See picks ranked for you', sub: 'Every dish gets a match score, allergens flagged, and a "why" you can tap.' },
                { n: '3', icon: <Icons.HeartOn size={16} />, title: 'Tell us how it went', sub: 'After your meal, rate your dish so Recco learns what to suggest next time.' },
              ].map(s => (
                <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--cream)', color: 'var(--char)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                    flexShrink: 0,
                  }}>{s.n}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--char-2)', marginTop: 2, lineHeight: 1.4 }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo button — for the prototype, lets reviewers see what scans look like */}
          <button onClick={() => onOpenScan && onOpenScan('demo')} style={{
            width: '100%', marginTop: 12,
            padding: '14px 16px',
            background: 'transparent',
            border: '1px dashed var(--char-light, var(--char-3))',
            borderRadius: 'var(--r-md)',
            fontSize: 13, fontWeight: 600, color: 'var(--char-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icons.Image size={14} /> See a sample scan first
          </button>
        </div>
      )}

      {/* Tip card — only shown to returning users */}
      {!isNewUser && (
      <div style={{ padding: '28px 24px 0' }}>
        <div style={{
          background: 'var(--tomato-soft)',
          borderRadius: 'var(--r-lg)',
          padding: 16,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <div style={{ color: 'var(--tomato-ink)', marginTop: 2 }}>
            <Icons.Sparkle size={18} stroke={2.2} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tomato-ink)' }}>Tip</div>
            <div style={{ fontSize: 13, color: 'var(--tomato-ink)', opacity: 0.85, marginTop: 2, lineHeight: 1.4 }}>
              Hold steady at arm's length. Recco reads laminated, handwritten, and chalkboard menus.
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

window.HomeScreen = HomeScreen;
