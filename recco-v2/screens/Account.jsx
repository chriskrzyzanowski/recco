// Recco v2 — Account screens (MVP: History + Settings only)
// Removed from v1: Saved, Profile (no accounts), Edit-diet/Edit-allergens
// folded into Settings, ProfileTier/Pro upsell, Group ordering link.

function HistoryScreen({ history, onBack, onOpen }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} title="Scan history" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 32px' }}>
        {history.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>🧾</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 16 }}>Nothing here yet</div>
            <div style={{ fontSize: 14, color: 'var(--char-2)', marginTop: 6, lineHeight: 1.4 }}>Scan a menu and it'll show up here automatically.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {history.map(s => (
              <button key={s.id} onClick={() => onOpen(s)} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: 12, borderRadius: 'var(--r-md)',
                background: 'var(--paper)', border: '1px solid var(--sand)',
                textAlign: 'left',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 'var(--r-sm)',
                  background: `linear-gradient(135deg, ${s.color}, ${s.color}aa)`,
                  position: 'relative', overflow: 'hidden', flexShrink: 0,
                }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 6px)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--char-3)' }}>{s.scannedAt}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--char-3)', marginTop: 2 }}>{s.type} · {s.neighborhood}</div>
                  <div style={{ fontSize: 12, color: 'var(--char-2)', marginTop: 4 }}>Top: <b style={{ color: 'var(--char)' }}>{s.topPick}</b></div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Lightweight settings page (replaces v1 Profile). No avatar, no profile
// strength, no Pro upsell, no group ordering — just diet + allergens
// editing and a link to history.
function SettingsScreen({ profile, onBack, onNav, onEditDiet, onEditAllergens, onResetData }) {
  const dietLabel = DIETS.find(d => d.id === profile.diet)?.label || 'Balanced';
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} title="Settings" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 40px' }}>
        <SectionLabel style={{ marginBottom: 8 }}>Your preferences</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--sand)', borderRadius: 'var(--r-md)', overflow: 'hidden', marginBottom: 24 }}>
          <SettingsRow icon={<Icons.Apple size={18} />} label="Diet" value={dietLabel} onClick={onEditDiet} />
          <SettingsRow icon={<Icons.Alert size={18} />} label="Allergens" value={profile.allergens.length ? `${profile.allergens.length} flagged` : 'None'} onClick={onEditAllergens} />
        </div>

        <SectionLabel style={{ marginBottom: 8 }}>App</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--sand)', borderRadius: 'var(--r-md)', overflow: 'hidden', marginBottom: 24 }}>
          <SettingsRow icon={<Icons.History size={18} />} label="Scan history" onClick={() => onNav('history')} />
        </div>

        <button onClick={onResetData} style={{ width: '100%', padding: 14, fontSize: 14, fontWeight: 600, color: 'var(--flag)' }}>Reset data</button>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--char-3)', marginTop: 12 }}>Recco · MVP · Made with care</div>
      </div>
    </div>
  );
}

function SettingsRow({ icon, label, value, onClick }) {
  return (
    <button onClick={onClick} disabled={!onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px', background: 'var(--paper)',
      textAlign: 'left',
      cursor: onClick ? 'pointer' : 'default',
      width: '100%',
    }}>
      <div style={{ color: 'var(--char-2)' }}>{icon}</div>
      <div style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>{label}</div>
      {value && <div style={{ fontSize: 14, color: 'var(--char-3)', whiteSpace: 'nowrap' }}>{value}</div>}
      {onClick && <Icons.Chevron size={16} stroke={2} />}
    </button>
  );
}

function EditDietScreen({ value, onChange, onBack }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} title="Diet" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 24px' }}>
        <div style={{ fontSize: 13, color: 'var(--char-2)', marginBottom: 16 }}>Recco re-ranks all menus based on your diet.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DIETS.map(d => {
            const sel = value === d.id;
            return (
              <button key={d.id} onClick={() => onChange(d.id)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', borderRadius: 'var(--r-md)',
                background: sel ? 'var(--char)' : 'var(--paper)',
                color: sel ? 'var(--bone)' : 'var(--char)',
                border: '1.5px solid ' + (sel ? 'var(--char)' : 'var(--sand)'),
                textAlign: 'left',
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{d.label}</div>
                  <div style={{ fontSize: 12, color: sel ? 'rgba(250,247,242,0.7)' : 'var(--char-3)', marginTop: 2 }}>{d.hint}</div>
                </div>
                {sel && <Icons.Check size={20} stroke={2.6} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EditAllergensScreen({ value, onToggle, onBack }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} title="Allergens" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 24px' }}>
        <div style={{ fontSize: 13, color: 'var(--char-2)', marginBottom: 16 }}>We'll flag dishes containing anything you select.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
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
      </div>
    </div>
  );
}

Object.assign(window, { HistoryScreen, SettingsScreen, EditDietScreen, EditAllergensScreen });
