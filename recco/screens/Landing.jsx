// Recco — Landing / marketing page (in-frame, scrollable)

function LandingScreen({ onGetStarted }) {
  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: 'var(--bone)' }}>
      {/* Sticky nav — top padding clears iOS status bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5,
        padding: '64px 24px 14px',
        background: 'rgba(250,247,242,0.92)', backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--sand)',
      }}>
        <ReccoLogo size={22} />
      </div>

      {/* Hero */}
      <div style={{ padding: '32px 28px 32px' }}>
        <Pill tone="tomato" size="md" style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em' }}>
          AI MENU INTELLIGENCE
        </Pill>
        <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 16 }}>
          Stop guessing.<br/>Start <span style={{ color: 'var(--tomato)' }}>recco</span>mmending.
        </div>
        <div style={{ fontSize: 15, color: 'var(--char-2)', marginTop: 14, lineHeight: 1.5 }}>
          Point your camera at any menu. Recco reads every dish, flags allergens, and ranks the picks for your taste — in under 3 seconds.
        </div>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PrimaryButton onClick={onGetStarted} icon={<Icons.Camera size={20} />}>Start scanning</PrimaryButton>
          <div style={{ fontSize: 12, color: 'var(--char-3)', textAlign: 'center' }}>Free · No account needed to start</div>
        </div>

        {/* Social proof */}
        <div style={{ marginTop: 28, padding: 14, background: 'var(--paper)', border: '1px solid var(--sand)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex' }}>
            {['#A0392E', '#7A8A6F', '#D9B864', '#8C6A4A'].map((c, i) => (
              <div key={i} style={{ width: 26, height: 26, borderRadius: '50%', background: c, marginLeft: i === 0 ? 0 : -8, border: '2px solid var(--paper)' }} />
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--char)' }}>★ 4.9 · 12,000 reviews</div>
            <div style={{ fontSize: 11, color: 'var(--char-3)' }}>Featured in Eater & Bon Appétit</div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: '32px 28px', background: 'var(--cream)' }}>
        <SectionLabel>How it works</SectionLabel>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 8, lineHeight: 1.15 }}>
          From camera to recommendation in three steps.
        </div>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            ['01', 'Point & scan', 'Laminated, handwritten, chalkboard — Recco reads them all.', '#A0392E'],
            ['02', 'AI reads everything', 'Ingredients parsed, allergens flagged, macros estimated. ~3 seconds.', '#7A8A6F'],
            ['03', 'Your perfect pick', 'Ranked for your taste, your diet, your goals. With reasoning.', '#D9B864'],
          ].map(([num, title, body, color]) => (
            <div key={num} style={{ background: 'var(--paper)', border: '1px solid var(--sand)', borderRadius: 'var(--r-lg)', padding: 18, display: 'flex', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{num}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--char-2)', marginTop: 4, lineHeight: 1.4 }}>{body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 28px 36px', borderTop: '1px solid var(--sand)' }}>
        <ReccoLogo size={20} />
        <div style={{ fontSize: 11, color: 'var(--char-3)', marginTop: 12 }}>© 2026 Recco. Made with care.</div>
      </div>
    </div>
  );
}

window.LandingScreen = LandingScreen;
