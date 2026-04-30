// Recco v2 — Home
// MVP trim: no moods, no restaurant picker (camera scans whatever's
// in front of you), no profile button (no accounts), no Saved row.
// Big primary CTA = scan. History stays.

function HomeScreen({ profile, history, dishesById, onNav, onScan, onOpenScan, isNewUser, onOpenSettings }) {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 11) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', paddingBottom: 36 }}>
      {/* Header — settings cog instead of profile avatar */}
      <div style={{ padding: '64px 24px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <ReccoLogo size={26} />
        <button onClick={onOpenSettings} style={{
          width: 36, height: 36, borderRadius: '50%', background: 'var(--cream)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--char-2)',
        }}><Icons.Settings size={18} /></button>
      </div>

      {/* Greeting */}
      <div style={{ padding: '8px 24px 22px' }}>
        <div style={{ color: 'var(--char-3)', fontSize: 14, fontWeight: 500 }}>{greeting},</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 2 }}>What are you eating tonight?</div>
      </div>

      {/* Hero scan card — the only thing on this screen that matters */}
      <div style={{ padding: '0 24px' }}>
        <button onClick={onScan} style={{
          width: '100%', borderRadius: 'var(--r-xl)',
          background: 'var(--char)', color: 'var(--bone)',
          padding: '32px 24px',
          display: 'flex', flexDirection: 'column', gap: 18,
          textAlign: 'left',
          position: 'relative', overflow: 'hidden',
          boxShadow: 'var(--shadow-2)',
        }}
        onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.985)'}
        onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{
            position: 'absolute', top: -50, right: -50,
            width: 180, height: 180, borderRadius: '50%',
            background: 'var(--tomato)', opacity: 0.85,
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
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 6 }}>Point at a menu</div>
            <div style={{ fontSize: 14, color: 'rgba(250,247,242,0.7)', lineHeight: 1.4 }}>
              We'll read every dish and rank them for your {profile.diet === 'balanced' ? 'taste' : profile.diet} profile in about three seconds.
            </div>
          </div>
        </button>
      </div>

      {/* Recent scans (hidden for brand-new users) */}
      {!isNewUser && history.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div style={{ padding: '0 24px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <SectionLabel>Recent scans</SectionLabel>
            <button onClick={() => onNav('history')} style={{ fontSize: 12, fontWeight: 600, color: 'var(--char-3)', whiteSpace: 'nowrap' }}>View all</button>
          </div>
          <div style={{ display: 'flex', gap: 12, padding: '0 24px', overflowX: 'auto' }}>
            {history.slice(0, 5).map(s => (
              <button key={s.id} onClick={() => onOpenScan(s)} style={{
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

      {/* New-user empty state */}
      {isNewUser && (
        <div style={{ padding: '32px 24px 0' }}>
          <SectionLabel style={{ marginBottom: 12 }}>How it works</SectionLabel>
          <div style={{
            background: 'var(--paper)',
            border: '1px solid var(--sand)',
            borderRadius: 'var(--r-lg)',
            padding: 18,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { n: '1', title: 'Tap the scan button', sub: 'Point your phone at any printed menu.' },
                { n: '2', title: 'Recco reads it all', sub: 'Ingredients parsed, allergens flagged. ~3 seconds.' },
                { n: '3', title: 'See your top picks', sub: 'Ranked for your taste, with a "why" you can tap.' },
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
                    <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--char-2)', marginTop: 2, lineHeight: 1.4 }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo button — see what scans look like before scanning anything */}
          <button onClick={() => onOpenScan && onOpenScan('demo')} style={{
            width: '100%', marginTop: 12,
            padding: '14px 16px',
            background: 'transparent',
            border: '1px dashed var(--char-3)',
            borderRadius: 'var(--r-md)',
            fontSize: 13, fontWeight: 600, color: 'var(--char-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icons.Image size={14} /> See a sample scan first
          </button>
        </div>
      )}
    </div>
  );
}

window.HomeScreen = HomeScreen;
