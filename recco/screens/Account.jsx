// Recco — History, Saved, Profile, Edit screens

function HistoryScreen({ history, onBack, onOpen, onNav }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} title="Scan history" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 100px' }}>
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
      <TabBar active="history" onNav={onNav} />
    </div>
  );
}

function SavedScreen({ saved, dishesById, onBack, onOpen, onToggleSave, onNav }) {
  const items = saved.map(id => dishesById[id]).filter(Boolean);
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} title="Saved dishes" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 100px' }}>
        {items.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>🤍</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 16 }}>No saved dishes yet</div>
            <div style={{ fontSize: 14, color: 'var(--char-2)', marginTop: 6, lineHeight: 1.4 }}>Tap the heart on any dish to save it for later.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(d => (
              <div key={d.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: 12, borderRadius: 'var(--r-md)',
                background: 'var(--paper)', border: '1px solid var(--sand)',
              }}>
                <button onClick={() => onOpen(d.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, textAlign: 'left', minWidth: 0 }}>
                  <DishThumb dish={d} size={48} radius={10} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--char-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.blurb}</div>
                  </div>
                </button>
                <button onClick={() => onToggleSave(d.id)} style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tomato)' }}>
                  <Icons.HeartOn size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <TabBar active="saved" onNav={onNav} />
    </div>
  );
}

function ProfileScreen({ profile, savedCount, scanCount, mealCount = 0, onNav, onOpen, onSignOut }) {
  const dietLabel = DIETS.find(d => d.id === profile.diet)?.label || 'Balanced';
  const tier = profileTier(mealCount);
  const tasteCount = profile.tastes ? Object.keys(profile.tastes).length : 0;
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Profile" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 100px' }}>
        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '4px 0 24px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--char)', color: 'var(--bone)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700,
          }}>
            {profile.name?.[0] || 'Y'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{profile.name || 'Your profile'}</div>
            <div style={{ fontSize: 13, color: 'var(--char-3)' }}>{profile.email || 'Local profile'}</div>
          </div>
        </div>

        {/* Profile strength — grows as Recco learns from your meals.
            The pitch: this isn't static; it gets smarter the more you use it. */}
        <div style={{
          background: 'linear-gradient(135deg, var(--char) 0%, #2a2622 100%)',
          color: 'var(--bone)',
          borderRadius: 'var(--r-lg)', padding: 18, marginBottom: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: 'var(--tomato)', opacity: 0.18, filter: 'blur(8px)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.12em', color: 'rgba(250,247,242,0.6)' }}>PROFILE STRENGTH</div>
              <div className="mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--tomato)' }}>{tier.pct}%</div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>{tier.label}</div>
            <div style={{ fontSize: 13, color: 'rgba(250,247,242,0.7)', lineHeight: 1.4, marginBottom: 14 }}>{tier.hint}</div>
            <div style={{ height: 6, background: 'rgba(250,247,242,0.12)', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ width: `${tier.pct}%`, height: '100%', background: 'var(--tomato)', borderRadius: 999, transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'rgba(250,247,242,0.5)', fontFamily: 'var(--mono)', letterSpacing: '0.05em' }}>
              <span>{mealCount} MEALS LOGGED</span>
              <span>{tier.max < 999 ? `${tier.max - mealCount} TO NEXT TIER` : 'MAX TIER'}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 28 }}>
          {[
            ['Scans', scanCount],
            ['Saved', savedCount],
            ['Meals', mealCount],
          ].map(([k, v]) => (
            <div key={k} style={{ background: 'var(--paper)', border: '1px solid var(--sand)', borderRadius: 'var(--r-md)', padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{v}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--char-3)', letterSpacing: '0.08em', marginTop: 2 }}>{k.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <SectionLabel style={{ marginBottom: 8 }}>Taste profile</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--sand)', borderRadius: 'var(--r-md)', overflow: 'hidden', marginBottom: 24 }}>
          <ProfileRow icon={<Icons.Wand size={18} />} label="Diet" value={dietLabel} onClick={() => onOpen('edit-diet')} />
          <ProfileRow icon={<Icons.Alert size={18} />} label="Allergens" value={profile.allergens.length ? `${profile.allergens.length} flagged` : 'None'} onClick={() => onOpen('edit-allergens')} />
        </div>

        {/* Pro upsell card — shown only to free users */}
        {!profile.isPro && (
          <button onClick={() => onOpen('paywall')} style={{
            width: '100%', textAlign: 'left',
            background: 'var(--char)', color: 'var(--bone)',
            borderRadius: 'var(--r-lg)',
            padding: 16,
            display: 'flex', alignItems: 'center', gap: 14,
            position: 'relative', overflow: 'hidden',
            marginBottom: 24,
          }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'var(--tomato)', opacity: 0.85 }} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--tomato)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icons.Sparkle size={20} stroke={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.01em' }}>Try Recco Pro</div>
                <div style={{ fontSize: 12, color: 'rgba(250,247,242,0.7)', marginTop: 2 }}>Sharper picks · unlimited chat · 7-day trial</div>
              </div>
              <Icons.Chevron size={18} stroke={2.2} />
            </div>
          </button>
        )}

        {profile.isPro && (
          <button onClick={() => onOpen('paywall')} style={{
            width: '100%', textAlign: 'left',
            background: 'var(--paper)', color: 'var(--char)',
            border: '1px solid var(--sand)',
            borderRadius: 'var(--r-md)',
            padding: 14,
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 24,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--char)', color: 'var(--tomato)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icons.Sparkle size={16} stroke={2.2} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Recco Pro</div>
              <div style={{ fontSize: 12, color: 'var(--char-3)' }}>Manage subscription</div>
            </div>
            <Icons.Chevron size={16} stroke={2} />
          </button>
        )}

        <SectionLabel style={{ marginBottom: 8 }}>App</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--sand)', borderRadius: 'var(--r-md)', overflow: 'hidden', marginBottom: 24 }}>
          <ProfileRow icon={<Icons.History size={18} />} label="Scan history" />
          <ProfileRow icon={<Icons.Settings size={18} />} label="Notifications" value="On" />
        </div>

        <button onClick={onSignOut} style={{ width: '100%', padding: 14, fontSize: 14, fontWeight: 600, color: 'var(--flag)' }}>Sign out</button>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--char-3)', marginTop: 12 }}>Recco · v1.0 · Made with care</div>
      </div>
      <TabBar active="profile" onNav={onNav} />
    </div>
  );
}

function ProfileRow({ icon, label, value, onClick }) {
  return (
    <button onClick={onClick} disabled={!onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px', background: 'var(--paper)',
      textAlign: 'left',
      cursor: onClick ? 'pointer' : 'default',
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

Object.assign(window, { HistoryScreen, SavedScreen, ProfileScreen, EditDietScreen, EditAllergensScreen });
