// Recco — single-page profile setup (replaces multi-step onboarding for MVP)
//
// Shown right after Landing's "Start scanning". Asks the same questions a user
// can edit later from Profile (diet + allergens), then routes straight to the
// camera scanner via "Scan the menu".

function ProfileSetupScreen({ profile, onUpdateProfile, onContinue, onBack }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} title="Your profile" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px 20px' }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Tell us how you eat
        </div>
        <div style={{ fontSize: 14, color: 'var(--char-2)', marginTop: 6, lineHeight: 1.4, marginBottom: 28 }}>
          We'll use this to rank menus for you. You can change anything later from Profile.
        </div>

        {/* Diet */}
        <SectionLabel style={{ marginBottom: 12 }}>Diet</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
          {DIETS.map(d => {
            const sel = profile.diet === d.id;
            return (
              <button key={d.id} onClick={() => onUpdateProfile({ diet: d.id })} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                padding: '14px 16px', borderRadius: 'var(--r-md)',
                background: sel ? 'var(--char)' : 'var(--paper)',
                color: sel ? 'var(--bone)' : 'var(--char)',
                border: '1.5px solid ' + (sel ? 'var(--char)' : 'var(--sand)'),
                textAlign: 'left',
                transition: 'all 0.15s',
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{d.label}</div>
                  <div style={{ fontSize: 12, color: sel ? 'rgba(250,247,242,0.7)' : 'var(--char-3)', marginTop: 2 }}>{d.hint}</div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  border: '2px solid ' + (sel ? 'var(--bone)' : 'var(--sand)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {sel && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--bone)' }} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Allergens */}
        <SectionLabel style={{ marginBottom: 12 }}>Allergens we should flag</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {ALLERGENS.map(a => {
            const sel = profile.allergens.includes(a.id);
            return (
              <button key={a.id} onClick={() => {
                const next = sel ? profile.allergens.filter(x => x !== a.id) : [...profile.allergens, a.id];
                onUpdateProfile({ allergens: next });
              }} style={{
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
        <div style={{ fontSize: 12, color: 'var(--char-3)', lineHeight: 1.5 }}>
          Recco does its best to spot allergens, but always confirm with your server for severe allergies.
        </div>
      </div>
      <div style={{ padding: '12px 24px 44px', background: 'linear-gradient(to top, var(--bone) 60%, transparent)' }}>
        <PrimaryButton onClick={onContinue} icon={<Icons.Camera size={20} />}>Scan the menu</PrimaryButton>
      </div>
    </div>
  );
}

Object.assign(window, { ProfileSetupScreen });
