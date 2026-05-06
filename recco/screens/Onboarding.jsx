// Recco — single-page profile setup (replaces multi-step onboarding for MVP)
//
// Shown right after Landing's "Start scanning". In-the-moment questions
// (hunger + mood) plus persistent allergen flags, then routes straight to
// the camera scanner via "Scan the menu".

const HUNGER_LEVELS = [
  { id: 'light',       label: 'Light bite' },
  { id: 'moderate',    label: 'Moderate' },
  { id: 'hungry',      label: 'Hungry' },
  { id: 'very-hungry', label: 'Very hungry' },
];

const MOOD_CHOICES = [
  { id: 'healthy',     label: 'Healthy',     hint: 'Greens, lean protein, clean' },
  { id: 'comfort',     label: 'Comfort',     hint: 'Hearty and satisfying' },
  { id: 'adventurous', label: 'Adventurous', hint: 'Something new tonight' },
  { id: 'familiar',    label: 'Familiar',    hint: 'Stick with what works' },
];

const DIET_TAGS = [
  { id: 'vegetarian',   label: 'Vegetarian' },
  { id: 'vegan',        label: 'Vegan' },
  { id: 'pescatarian',  label: 'Pescatarian' },
  { id: 'high-protein', label: 'High protein' },
];

function ProfileSetupScreen({ profile, mood, hunger, onUpdateProfile, onSetMood, onSetHunger, onContinue, onBack }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} title="Your visit" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px 20px' }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          How are you feeling?
        </div>
        <div style={{ fontSize: 14, color: 'var(--char-2)', marginTop: 6, lineHeight: 1.4, marginBottom: 28 }}>
          We'll rank dishes for the meal you want, right now.
        </div>

        {/* Hunger scale */}
        <SectionLabel style={{ marginBottom: 12 }}>How hungry are you?</SectionLabel>
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {HUNGER_LEVELS.map((h, i) => {
            const sel = hunger === h.id;
            return (
              <button key={h.id} onClick={() => onSetHunger(h.id)} style={{
                flex: 1,
                padding: '12px 6px',
                borderRadius: 'var(--r-md)',
                background: sel ? 'var(--char)' : 'var(--paper)',
                color: sel ? 'var(--bone)' : 'var(--char)',
                border: '1.5px solid ' + (sel ? 'var(--char)' : 'var(--sand)'),
                fontSize: 12, fontWeight: 700, lineHeight: 1.2,
                transition: 'all 0.15s',
              }}>{h.label}</button>
            );
          })}
        </div>

        {/* Mood */}
        <SectionLabel style={{ marginBottom: 12 }}>What sounds good?</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
          {MOOD_CHOICES.map(m => {
            const sel = mood === m.id;
            return (
              <button key={m.id} onClick={() => onSetMood(m.id)} style={{
                padding: '14px 14px',
                borderRadius: 'var(--r-md)',
                background: sel ? 'var(--char)' : 'var(--paper)',
                color: sel ? 'var(--bone)' : 'var(--char)',
                border: '1.5px solid ' + (sel ? 'var(--char)' : 'var(--sand)'),
                textAlign: 'left',
                transition: 'all 0.15s',
                display: 'flex', flexDirection: 'column', gap: 2,
              }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{m.label}</span>
                <span style={{ fontSize: 11, color: sel ? 'rgba(250,247,242,0.7)' : 'var(--char-3)' }}>{m.hint}</span>
              </button>
            );
          })}
        </div>

        {/* Diet preference (single-select) */}
        <SectionLabel style={{ marginBottom: 12 }}>Diet preference</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
          {DIET_TAGS.map(d => {
            const sel = profile.dietTag === d.id;
            return (
              <button key={d.id} onClick={() => onUpdateProfile({ dietTag: sel ? null : d.id })} style={{
                padding: '14px 14px',
                borderRadius: 'var(--r-md)',
                background: sel ? 'var(--char)' : 'var(--paper)',
                color: sel ? 'var(--bone)' : 'var(--char)',
                border: '1.5px solid ' + (sel ? 'var(--char)' : 'var(--sand)'),
                textAlign: 'left',
                fontSize: 15, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span>{d.label}</span>
                {sel && <Icons.Check size={18} stroke={2.6} />}
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
