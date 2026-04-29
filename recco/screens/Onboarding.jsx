// Recco — Onboarding flow: Welcome, Diet, Allergens, Success

function WelcomeScreen({ onContinue, onSkip, onSignIn }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '0 28px' }}>
      <div style={{ paddingTop: 64, display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onSkip} style={{ fontSize: 14, color: 'var(--char-3)', fontWeight: 600, padding: 8 }}>Skip</button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 24 }}>
        {/* Brand mark — large */}
        <div style={{
          width: 88, height: 88, borderRadius: 24,
          background: 'var(--char)', color: 'var(--bone)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          boxShadow: 'var(--shadow-2)',
        }}>
          <Icons.Camera size={42} stroke={1.8} />
          <div style={{ position: 'absolute', top: 10, right: 10, width: 14, height: 14, borderRadius: '50%', background: 'var(--tomato)' }} />
        </div>
        <div>
          <ReccoLogo size={42} />
          <div style={{ fontSize: 17, color: 'var(--char-2)', marginTop: 16, fontWeight: 500, lineHeight: 1.4, maxWidth: 280 }}>
            Point your camera at any menu. Get a recommendation that's actually right for you.
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', marginTop: 12 }}>
          {[
            ['🎯', 'Picks tailored to your taste'],
            ['⚠️', 'Allergens flagged automatically'],
            ['✨', 'Gets sharper every meal'],
          ].map(([e, t]) => (
            <div key={t} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', background: 'var(--paper)',
              border: '1px solid var(--sand)', borderRadius: 'var(--r-md)',
              textAlign: 'left',
            }}>
              <div style={{ fontSize: 18 }}>{e}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{t}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ paddingBottom: 48, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PrimaryButton onClick={onContinue}>Set up my profile</PrimaryButton>
        <button onClick={onSignIn} style={{ height: 44, fontSize: 14, color: 'var(--char-2)', fontWeight: 600 }}>
          I already have an account
        </button>
      </div>
    </div>
  );
}

function DietSelectionScreen({ value, onChange, onBack, onContinue }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} title="Step 1 of 3" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 28px 20px' }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>How do you like to eat?</div>
        <div style={{ fontSize: 14, color: 'var(--char-2)', marginTop: 6, lineHeight: 1.4 }}>Pick the one closest to your style. You can change this anytime.</div>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DIETS.map(d => {
            const sel = value === d.id;
            return (
              <button key={d.id} onClick={() => onChange(d.id)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                padding: '16px 18px', borderRadius: 'var(--r-md)',
                background: sel ? 'var(--char)' : 'var(--paper)',
                color: sel ? 'var(--bone)' : 'var(--char)',
                border: '1.5px solid ' + (sel ? 'var(--char)' : 'var(--sand)'),
                textAlign: 'left',
                transition: 'all 0.15s',
              }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{d.label}</div>
                  <div style={{ fontSize: 12, color: sel ? 'rgba(250,247,242,0.7)' : 'var(--char-3)', marginTop: 2 }}>{d.hint}</div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  border: '2px solid ' + (sel ? 'var(--bone)' : 'var(--sand)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {sel && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--bone)' }} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '12px 24px 44px', background: 'linear-gradient(to top, var(--bone) 60%, transparent)' }}>
        <PrimaryButton onClick={onContinue} disabled={!value}>Continue</PrimaryButton>
      </div>
    </div>
  );
}

function AllergenSelectionScreen({ value, onToggle, onBack, onContinue, onSkip }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} title="Step 2 of 3" right={<button onClick={onSkip} style={{ fontSize: 14, color: 'var(--char-3)', fontWeight: 600, padding: '8px 10px' }}>Skip</button>} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 28px 20px' }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>Anything we should flag?</div>
        <div style={{ fontSize: 14, color: 'var(--char-2)', marginTop: 6, lineHeight: 1.4 }}>We'll warn you whenever a dish contains any of these.</div>
        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {ALLERGENS.map(a => {
            const sel = value.includes(a.id);
            return (
              <button key={a.id} onClick={() => onToggle(a.id)} style={{
                padding: '14px 14px',
                borderRadius: 'var(--r-md)',
                background: sel ? 'var(--flag-soft)' : 'var(--paper)',
                color: sel ? 'var(--flag)' : 'var(--char)',
                border: '1.5px solid ' + (sel ? 'var(--flag)' : 'var(--sand)'),
                textAlign: 'left',
                fontSize: 15, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span>{a.label}</span>
                {sel && <Icons.Check size={18} stroke={2.6} />}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 16, fontSize: 12, color: 'var(--char-3)', lineHeight: 1.5 }}>
          Recco does its best to spot allergens, but always confirm with your server for severe allergies.
        </div>
      </div>
      <div style={{ padding: '12px 24px 44px', background: 'linear-gradient(to top, var(--bone) 60%, transparent)' }}>
        <PrimaryButton onClick={onContinue}>{value.length === 0 ? 'No allergens — continue' : `Save ${value.length} & continue`}</PrimaryButton>
      </div>
    </div>
  );
}

function OnboardingSuccessScreen({ profile, onContinue }) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => { setTimeout(() => setShow(true), 100); }, []);
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '54px 28px 0', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <div style={{
        width: 96, height: 96, borderRadius: '50%',
        background: 'var(--safe-soft)', color: 'var(--safe)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: show ? 'scale(1)' : 'scale(0.5)',
        opacity: show ? 1 : 0,
        transition: 'all 0.5s cubic-bezier(.34,1.56,.64,1)',
      }}>
        <Icons.Check size={50} stroke={2.6} />
      </div>
      <div style={{ marginTop: 28, opacity: show ? 1 : 0, transition: 'opacity 0.4s 0.2s' }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>You're all set.</div>
        <div style={{ fontSize: 15, color: 'var(--char-2)', marginTop: 12, lineHeight: 1.5, maxWidth: 280 }}>
          We'll rank menus for your <b style={{ color: 'var(--char)' }}>{DIETS.find(d => d.id === profile.diet)?.label.toLowerCase()}</b> profile{profile.allergens.length > 0 && <> and watch for <b style={{ color: 'var(--char)' }}>{profile.allergens.length}</b> allergen{profile.allergens.length > 1 ? 's' : ''}</>}.
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 48, left: 28, right: 28, opacity: show ? 1 : 0, transition: 'opacity 0.4s 0.4s' }}>
        <PrimaryButton onClick={onContinue} icon={<Icons.Camera size={20} />}>Scan my first menu</PrimaryButton>
      </div>
    </div>
  );
}

function SignInScreen({ onBack, onContinue }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} />
      <div style={{ flex: 1, padding: '8px 28px 20px' }}>
        <ReccoLogo size={28} />
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 32, lineHeight: 1.1 }}>Welcome back.</div>
        <div style={{ fontSize: 14, color: 'var(--char-2)', marginTop: 6 }}>Sign in to sync your taste profile across devices.</div>
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onContinue} style={{
            height: 56, borderRadius: 'var(--r-full)', background: 'var(--char)', color: 'var(--bone)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 16, fontWeight: 700,
          }}><Icons.Apple size={20} /> Continue with Apple</button>
          <button onClick={onContinue} style={{
            height: 56, borderRadius: 'var(--r-full)', background: 'var(--paper)', color: 'var(--char)',
            border: '1.5px solid var(--sand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 16, fontWeight: 700,
          }}><Icons.Globe size={20} /> Continue with Google</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--sand)' }} />
            <div className="mono" style={{ fontSize: 11, color: 'var(--char-3)', letterSpacing: '0.1em' }}>OR EMAIL</div>
            <div style={{ flex: 1, height: 1, background: 'var(--sand)' }} />
          </div>
          <input placeholder="you@email.com" style={{
            height: 52, padding: '0 18px', borderRadius: 'var(--r-md)',
            background: 'var(--paper)', border: '1.5px solid var(--sand)',
            fontSize: 15, fontWeight: 500,
          }} />
          <PrimaryButton onClick={onContinue} tone="tomato">Send magic link</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WelcomeScreen, DietSelectionScreen, AllergenSelectionScreen, OnboardingSuccessScreen, SignInScreen });
