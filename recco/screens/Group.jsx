// Recco — Group ordering flow
// User picks 1–5 companions to combine taste profiles for the same scan.
// Pro-gated: free users hit the paywall when adding a 2nd companion.

function GroupScreen({ profile, selectedIds, onToggle, onBack, onContinue, onUpsell, isPro }) {
  // Free tier: only 1 companion allowed; adding a 2nd opens the paywall
  const maxFree = 1;
  const overLimit = !isPro && selectedIds.length > maxFree;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} title="Group ordering" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 20px' }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>Eat together.</div>
        <div style={{ fontSize: 14, color: 'var(--char-2)', marginTop: 6, lineHeight: 1.4 }}>
          Pick who's at your table. We'll rank one menu that works for everyone.
        </div>

        {/* The host (current user) — always present */}
        <SectionLabel style={{ marginTop: 24, marginBottom: 10 }}>Your table</SectionLabel>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px',
          background: 'var(--char)', color: 'var(--bone)',
          borderRadius: 'var(--r-md)',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'var(--tomato)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700,
          }}>{profile.name === 'You' ? 'Y' : (profile.name?.[0] || 'Y')}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>You · the host</div>
            <div style={{ fontSize: 12, color: 'rgba(250,247,242,0.7)' }}>{(DIETS.find(d => d.id === profile.diet)?.label) || 'Balanced'}{profile.allergens.length ? ` · ${profile.allergens.length} allergens` : ''}</div>
          </div>
          <Icons.Check size={18} stroke={2.6} />
        </div>

        {/* Companions */}
        <SectionLabel style={{ marginTop: 22, marginBottom: 10 }}>Add diners</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {COMPANIONS.map(c => {
            const sel = selectedIds.includes(c.id);
            return (
              <button key={c.id} onClick={() => onToggle(c.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px',
                background: sel ? 'var(--paper)' : 'var(--paper)',
                border: '1.5px solid ' + (sel ? 'var(--char)' : 'var(--sand)'),
                borderRadius: 'var(--r-md)',
                textAlign: 'left',
                transition: 'border-color 0.15s',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: c.avatar.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 16,
                  flexShrink: 0,
                }}>{c.avatar.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--char-3)' }}>{c.blurb}</div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: '1.5px solid ' + (sel ? 'var(--char)' : 'var(--sand)'),
                  background: sel ? 'var(--char)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--bone)',
                  flexShrink: 0,
                }}>
                  {sel && <Icons.Check size={14} stroke={3} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Free-tier nudge */}
        {!isPro && selectedIds.length >= 1 && (
          <div style={{
            marginTop: 14,
            padding: 14,
            background: 'var(--cream)',
            borderRadius: 'var(--r-md)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ color: 'var(--tomato-ink)' }}><Icons.Sparkle size={16} /></div>
            <div style={{ flex: 1, fontSize: 12, color: 'var(--char-2)', lineHeight: 1.4 }}>
              Free includes <b style={{ color: 'var(--char)' }}>1 companion</b>. Pro lets you add up to 5.
            </div>
            <button onClick={onUpsell} style={{ fontSize: 12, fontWeight: 700, color: 'var(--tomato-ink)', whiteSpace: 'nowrap' }}>Go Pro</button>
          </div>
        )}
      </div>

      <div style={{ padding: '12px 24px 32px', background: 'linear-gradient(to top, var(--bone) 60%, transparent)' }}>
        <PrimaryButton
          onClick={overLimit ? onUpsell : onContinue}
          disabled={selectedIds.length === 0}
          icon={overLimit ? <Icons.Sparkle size={18} /> : <Icons.Camera size={18} />}
        >
          {overLimit
            ? 'Unlock 5-person groups'
            : selectedIds.length === 0
              ? 'Add at least one diner'
              : `Scan a menu for ${selectedIds.length + 1}`}
        </PrimaryButton>
      </div>
    </div>
  );
}

// ─── Group results ────────────────────────────────────────────
// Same restaurant Olmo, but ranked for the combined table. Each dish shows
// the group score + a strip of per-diner fits.
function GroupResultsScreen({ restaurant, dishes, diners, onBack, onOpenDish, onAskAI }) {
  const top = dishes.slice(0, 3);
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} title={restaurant.name} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Diners strip */}
        <div style={{ padding: '4px 24px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          {diners.map((d, i) => (
            <div key={d.id} style={{
              width: 32, height: 32, borderRadius: '50%',
              background: d.avatar?.color || 'var(--tomato)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 13,
              border: '2px solid var(--bone)',
              marginLeft: i === 0 ? 0 : -8,
            }}>{d.avatar?.initials || 'Y'}</div>
          ))}
          <div style={{ marginLeft: 8, fontSize: 13, color: 'var(--char-2)' }}>
            <b style={{ color: 'var(--char)' }}>{diners.length} diners</b> · ranked together
          </div>
        </div>

        <div style={{ padding: '0 24px 8px' }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>What works for everyone</div>
          <div style={{ fontSize: 13, color: 'var(--char-2)', marginTop: 4 }}>
            We weight toward the lowest individual fit so nobody gets stuck.
          </div>
        </div>

        {/* Top group picks */}
        <div style={{ padding: '14px 24px 8px' }}>
          <SectionLabel>Top picks for the table</SectionLabel>
        </div>
        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {top.map((d, i) => (
            <GroupDishCard key={d.id} dish={d} rank={i} onOpen={() => onOpenDish(d.id)} />
          ))}
        </div>

        {/* Rest */}
        {dishes.length > 3 && (
          <>
            <div style={{ padding: '22px 24px 8px' }}>
              <SectionLabel>Other options</SectionLabel>
            </div>
            <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dishes.slice(3).map(d => (
                <GroupDishMini key={d.id} dish={d} onOpen={() => onOpenDish(d.id)} />
              ))}
            </div>
          </>
        )}

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

function GroupDishCard({ dish, rank, onOpen }) {
  const g = dish.group;
  const concerns = [];
  if (g.unsafeFor.length) concerns.push(`Allergen for ${g.unsafeFor.join(', ')}`);
  if (g.dietMissFor.length) concerns.push(`Doesn't fit ${g.dietMissFor.join(', ')}'s diet`);

  return (
    <button onClick={onOpen} style={{
      width: '100%', textAlign: 'left',
      background: 'var(--paper)', border: '1px solid var(--sand)',
      borderRadius: 'var(--r-lg)',
      padding: 14,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <DishThumb dish={dish} size={64} radius={12} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--char-3)' }}>
            #{rank + 1} TABLE PICK
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 2 }}>{dish.name}</div>
          <div style={{ fontSize: 12, color: 'var(--char-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dish.blurb}</div>
        </div>
        <MatchRing score={g.groupScore} size={48} stroke={4} />
      </div>

      {/* Per-diner fit strip */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 6,
        padding: 10,
        background: 'var(--cream)',
        borderRadius: 'var(--r-md)',
      }}>
        {g.perDiner.map(p => {
          const isUnsafe = !dish.group.perDiner.find(x => x.id === p.id).isSafe;
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <div style={{ width: 80, fontWeight: 600, color: 'var(--char-2)' }}>{p.name}</div>
              <div style={{ flex: 1, height: 4, background: 'var(--sand)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${p.score}%`,
                  background: isUnsafe ? 'var(--flag)' : p.score >= 80 ? 'var(--safe)' : p.score >= 50 ? 'var(--tomato)' : 'var(--char-3)',
                  borderRadius: 2,
                }} />
              </div>
              <div className="mono" style={{ width: 28, textAlign: 'right', fontSize: 11, fontWeight: 700, color: isUnsafe ? 'var(--flag)' : 'var(--char)' }}>
                {isUnsafe ? '⚠' : p.score}
              </div>
            </div>
          );
        })}
      </div>

      {concerns.length > 0 && (
        <div style={{
          fontSize: 12, color: 'var(--flag)',
          padding: '8px 10px', background: 'var(--flag-soft)',
          borderRadius: 'var(--r-sm)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icons.Alert size={13} stroke={2.4} />
          {concerns.join(' · ')}
        </div>
      )}
    </button>
  );
}

function GroupDishMini({ dish, onOpen }) {
  const g = dish.group;
  return (
    <button onClick={onOpen} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: 10, borderRadius: 'var(--r-md)',
      background: 'var(--paper)', border: '1px solid var(--sand)',
      textAlign: 'left',
    }}>
      <DishThumb dish={dish} size={44} radius={10} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{dish.name}</div>
        <div style={{ fontSize: 11, color: 'var(--char-3)' }}>
          {g.unsafeFor.length ? `⚠ Allergen for ${g.unsafeFor[0]}` : `Min fit ${g.min}`}
        </div>
      </div>
      <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: g.unsafeFor.length ? 'var(--flag)' : 'var(--char)' }}>
        {g.groupScore}
      </div>
    </button>
  );
}

Object.assign(window, { GroupScreen, GroupResultsScreen });
