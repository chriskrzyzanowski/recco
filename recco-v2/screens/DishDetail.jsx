// Recco v2 — Dish detail
// MVP trim: removed macros card, "Ask Recco" sticky CTA (chat cut),
// Saved heart, meal feedback (no accounts → no persistence story).
// Kept: hero, status banner, Why this pick, ingredients, tags.

function DishDetailScreen({ dish, onBack }) {
  if (!dish) return null;
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 32 }}>
        {/* Hero image */}
        <div style={{ padding: '0 24px 20px' }}>
          <div style={{
            width: '100%', aspectRatio: 1.5, borderRadius: 'var(--r-xl)',
            background: `linear-gradient(135deg, ${dish.color}, ${dish.color}cc)`,
            position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'flex-end', padding: 20,
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 10px)' }} />
            <div className="mono" style={{ position: 'relative', color: 'rgba(255,255,255,0.85)', fontSize: 11, letterSpacing: '0.1em' }}>
              // {dish.name.toLowerCase()}
            </div>
            <div style={{ position: 'absolute', top: 16, right: 16 }}>
              <MatchRing score={dish.score} size={64} stroke={4} color="#fff" />
            </div>
          </div>
        </div>

        <div style={{ padding: '0 24px 16px' }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--char-3)' }}>{dish.section.toUpperCase()} · {dish.price}</div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 6, lineHeight: 1.1 }}>{dish.name}</div>
          <div style={{ fontSize: 15, color: 'var(--char-2)', marginTop: 8, lineHeight: 1.45 }}>{dish.blurb}</div>
        </div>

        <div style={{ padding: '0 24px 20px' }}>
          {dish.isSafe ? (
            <div style={{
              padding: 14, borderRadius: 'var(--r-md)',
              background: 'var(--safe-soft)', color: 'var(--safe)',
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 14, fontWeight: 600,
            }}>
              <Icons.Check size={20} stroke={2.4} /> Safe for your profile
            </div>
          ) : (
            <div style={{
              padding: 14, borderRadius: 'var(--r-md)',
              background: 'var(--flag-soft)', color: 'var(--flag)',
              display: 'flex', flexDirection: 'column', gap: 6,
              fontSize: 14, fontWeight: 600,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Icons.Alert size={20} stroke={2.4} /> Contains {dish.flags.join(', ')}</div>
              <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.85, paddingLeft: 30 }}>You flagged {dish.flags.length === 1 ? 'this' : 'these'} during onboarding.</div>
            </div>
          )}
        </div>

        <WhyThisPick dish={dish} />

        {/* Ingredients */}
        <div style={{ padding: '0 24px 24px' }}>
          <SectionLabel style={{ marginBottom: 12 }}>Ingredients · annotated</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {dish.ingredients.map((ing, i) => {
              const lower = ing.toLowerCase();
              const moreFlag = dish.flags.find(f => {
                const k = f === 'gluten' ? 'wheat' : f === 'dairy' ? 'milk' : f === 'shellfish' ? 'shrimp' : f === 'eggs' ? 'egg' : f;
                return lower.includes(k);
              });
              const flagged = !!moreFlag;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                  padding: '10px 14px',
                  background: flagged ? 'var(--flag-soft)' : 'var(--paper)',
                  border: '1px solid ' + (flagged ? 'transparent' : 'var(--sand)'),
                  borderRadius: 'var(--r-md)',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: flagged ? 'var(--flag)' : 'var(--char)' }}>{ing}</div>
                  {flagged && <Pill tone="flag" size="sm">{moreFlag}</Pill>}
                </div>
              );
            })}
          </div>
        </div>

        {dish.tags.length > 0 && (
          <div style={{ padding: '0 24px 24px' }}>
            <SectionLabel style={{ marginBottom: 12 }}>Also</SectionLabel>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {dish.tags.map(t => <Pill key={t} tone="neutral" size="md">{t}</Pill>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WhyThisPick({ dish }) {
  const [open, setOpen] = React.useState(true);
  const breakdown = (dish.breakdown || []).filter(b => b.key !== 'mood'); // mood cut for MVP

  return (
    <div style={{ padding: '0 24px 24px' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', marginBottom: 12, textAlign: 'left',
      }}>
        <SectionLabel>Why this pick? · {dish.score} match</SectionLabel>
        <div style={{ color: 'var(--char-3)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600 }}>
          {open ? 'Hide' : 'Show'}
          <span style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-flex' }}>
            <Icons.ChevronD size={14} stroke={2.4} />
          </span>
        </div>
      </button>

      {open && (
        <div style={{
          background: 'var(--paper)', border: '1px solid var(--sand)',
          borderRadius: 'var(--r-lg)', padding: 4,
        }}>
          {breakdown.map((b, i) => (
            <BreakdownRow key={b.key} row={b} last={i === breakdown.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function BreakdownRow({ row, last }) {
  const tone = row.delta > 0 ? 'positive' : row.delta < 0 ? 'negative' : 'neutral';
  const toneStyle = {
    positive: { bg: 'var(--safe-soft)', fg: 'var(--safe)', sign: '+' },
    negative: { bg: 'var(--flag-soft)', fg: 'var(--flag)', sign: '' },
    neutral:  { bg: 'var(--cream)',     fg: 'var(--char-3)', sign: '' },
  }[tone];
  const icon = {
    diet:      <Icons.Apple size={16} stroke={2.2} />,
    allergens: <Icons.Alert size={16} stroke={2.2} />,
    strength:  <Icons.Wand size={16} stroke={2.2} />,
  }[row.key] || <Icons.Check size={16} stroke={2.2} />;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '12px 14px',
      borderBottom: last ? 'none' : '1px solid var(--sand)',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: toneStyle.bg, color: toneStyle.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.005em', whiteSpace: 'nowrap' }}>{row.label}</div>
          <div className="mono" style={{
            fontSize: 11, fontWeight: 700, color: toneStyle.fg,
            padding: '2px 7px', borderRadius: 'var(--r-full)', background: toneStyle.bg,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>{toneStyle.sign}{row.delta}</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--char-2)', marginTop: 2, lineHeight: 1.4 }}>{row.reason}</div>
        {row.key === 'strength' && typeof row.strength === 'number' && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 4, background: 'var(--sand)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                width: `${row.strength}%`, height: '100%',
                background: row.strength >= 80 ? 'var(--tomato)' : row.strength >= 60 ? 'var(--char)' : 'var(--char-3)',
                borderRadius: 999, transition: 'width 0.5s',
              }} />
            </div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--char-3)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
              {row.strength}/100
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.DishDetailScreen = DishDetailScreen;
