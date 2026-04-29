// Recco — Pro upsell / paywall screen
// Shown when the user taps "Recco Pro" in Profile, or hits a gated feature
// (group ordering, unlimited group members, taste-archive export).
//
// The screen is intentionally restrained — most paywalls scream. Recco's
// approach: show what gets unlocked and what changes, then let the user
// pick a plan with one tap. No urgency timers, no countdowns.

function PaywallScreen({ onBack, onStartTrial, source = 'profile', isPro = false }) {
  // 'monthly' | 'annual'
  const [plan, setPlan] = React.useState('annual');

  // Source-aware headline so the upsell feels contextual (a Group-flow user
  // gets a Group-flow headline, etc.)
  const headlines = {
    profile:  ["Recco Pro", "Sharper picks. Group dinners. No nags."],
    group:    ["Eat together with Recco Pro", "Group ordering for up to 6 people, with one combined ranking."],
    history:  ["Keep every meal in Recco Pro", "Unlimited scan history and exportable taste archive."],
    chat:     ["Unlimited dish chat with Recco Pro", "Ask anything — about ingredients, subs, or wine pairings."],
  };
  const [eyebrow, headline] = headlines[source] || headlines.profile;

  const features = [
    { icon: <Icons.User size={18} />,    title: 'Group ordering',     sub: 'Combine up to 6 taste profiles and rank one menu for the whole table.' },
    { icon: <Icons.History size={18} />, title: 'Unlimited history',  sub: 'Free keeps the last 5 scans. Pro keeps every meal forever.' },
    { icon: <Icons.Send size={18} />,    title: 'Unlimited dish chat',sub: 'Free is capped at 5 questions/day. Pro is unmetered.' },
    { icon: <Icons.Sparkle size={18} />, title: 'Taste archive',      sub: 'Export your taste vector + meal history as JSON. Bring it to any future Recco.' },
    { icon: <Icons.Wand size={18} />,    title: 'Custom diets',       sub: 'Pregnancy, low-FODMAP, kosher, halal, AIP, and your own rule set.' },
    { icon: <Icons.Heart size={18} />,   title: 'Restaurant requests',sub: 'Email you a heads-up when a new menu drops at places you\'ve scanned.' },
  ];

  const plans = [
    { id: 'annual',  label: 'Annual',  price: '$29.99/yr',  per: '$2.50 / month',  badge: 'Save 50%' },
    { id: 'monthly', label: 'Monthly', price: '$4.99/mo',   per: 'Cancel anytime', badge: null },
  ];

  if (isPro) {
    // If the user is already Pro, this screen becomes a "manage" view
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <TopBar onBack={onBack} title="Recco Pro" />
        <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: 'var(--char)', color: 'var(--bone)',
            borderRadius: 'var(--r-lg)', padding: 20,
            display: 'flex', alignItems: 'center', gap: 14,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: 'var(--tomato)', opacity: 0.85 }} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--tomato)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Sparkle size={22} stroke={2.2} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>Recco Pro</div>
                <div style={{ fontSize: 13, color: 'rgba(250,247,242,0.7)' }}>Annual · renews May 14, 2026</div>
              </div>
            </div>
          </div>
          <button style={{ height: 44, fontSize: 14, fontWeight: 600, color: 'var(--char-2)', background: 'var(--paper)', border: '1px solid var(--sand)', borderRadius: 'var(--r-md)' }}>Manage subscription</button>
          <div style={{ fontSize: 12, color: 'var(--char-3)', textAlign: 'center', marginTop: 'auto', paddingBottom: 24 }}>Thanks for supporting Recco.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bone)' }}>
      <TopBar onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Hero */}
        <div style={{ padding: '0 28px 28px' }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--tomato-ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icons.Sparkle size={13} /> {eyebrow.toUpperCase()}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 10 }}>{headline}</div>
        </div>

        {/* Features */}
        <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--sand)', borderRadius: 'var(--r-lg)', overflow: 'hidden', margin: '0 24px' }}>
          {features.map((f, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14,
              padding: 16, background: 'var(--paper)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--cream)', color: 'var(--char)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{f.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'var(--char-2)', marginTop: 2, lineHeight: 1.4 }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div style={{ padding: '24px 24px 0' }}>
          <SectionLabel style={{ marginBottom: 10 }}>Pick a plan</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {plans.map(p => {
              const sel = plan === p.id;
              return (
                <button key={p.id} onClick={() => setPlan(p.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 18px',
                  borderRadius: 'var(--r-md)',
                  background: sel ? 'var(--char)' : 'var(--paper)',
                  color: sel ? 'var(--bone)' : 'var(--char)',
                  border: '1.5px solid ' + (sel ? 'var(--char)' : 'var(--sand)'),
                  textAlign: 'left',
                  position: 'relative',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: '2px solid ' + (sel ? 'var(--bone)' : 'var(--sand)'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {sel && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--bone)' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 700 }}>{p.label}</span>
                      {p.badge && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                          padding: '3px 7px', borderRadius: 'var(--r-full)',
                          background: 'var(--tomato)', color: '#fff',
                        }}>{p.badge}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: sel ? 'rgba(250,247,242,0.7)' : 'var(--char-3)', marginTop: 1 }}>{p.per}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{p.price}</div>
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: 'var(--char-3)', marginTop: 14, textAlign: 'center', lineHeight: 1.5 }}>
            7-day free trial · cancel anytime · charges to your App Store account
          </div>
        </div>

        <div style={{ height: 16 }} />
      </div>

      <div style={{ padding: '12px 24px 32px', background: 'linear-gradient(to top, var(--bone) 60%, transparent)' }}>
        <PrimaryButton onClick={() => onStartTrial(plan)} icon={<Icons.Sparkle size={18} />}>
          {plan === 'annual' ? 'Start free trial · then $29.99/yr' : 'Start free trial · then $4.99/mo'}
        </PrimaryButton>
        <button onClick={onBack} style={{ width: '100%', height: 44, fontSize: 13, fontWeight: 600, color: 'var(--char-3)', marginTop: 6 }}>Maybe later</button>
      </div>
    </div>
  );
}

window.PaywallScreen = PaywallScreen;
