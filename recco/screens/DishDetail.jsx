// Recco — Dish detail
//
// Two new sections beyond the basic detail:
//   1. "Why this pick?" — transparent score breakdown. Builds trust by
//      showing exactly which signals drove the recommendation.
//   2. Post-meal feedback — "Did you order this? How was it?" Closes the
//      personalization loop and feeds future ranking weights.

function DishDetailScreen({ dish, saved, meal, onBack, onToggleSave, onAskAI, onLogMeal, onClearMeal }) {
  if (!dish) return null;
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar
        onBack={onBack}
        right={
          <button onClick={() => onToggleSave(dish.id)} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: saved ? 'var(--tomato)' : 'var(--char-2)' }}>
            {saved ? <Icons.HeartOn size={22} /> : <Icons.Heart size={22} />}
          </button>
        }
      />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
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

        {/* Name + blurb */}
        <div style={{ padding: '0 24px 16px' }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--char-3)' }}>{dish.section.toUpperCase()} · {dish.price}</div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 6, lineHeight: 1.1 }}>{dish.name}</div>
          <div style={{ fontSize: 15, color: 'var(--char-2)', marginTop: 8, lineHeight: 1.45 }}>{dish.blurb}</div>
        </div>

        {/* Status banner */}
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

        {/* ─── Why this pick? — transparent score breakdown ─── */}
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

        {/* Tags */}
        {dish.tags.length > 0 && (
          <div style={{ padding: '0 24px 24px' }}>
            <SectionLabel style={{ marginBottom: 12 }}>Also</SectionLabel>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {dish.tags.map(t => <Pill key={t} tone="neutral" size="md">{t}</Pill>)}
            </div>
          </div>
        )}

        {/* ─── Did you order this? — feedback loop ─── */}
        <MealFeedback dish={dish} meal={meal} onLog={onLogMeal} onClear={onClearMeal} />
      </div>

      {/* Sticky bottom CTA — hidden until live AI is wired (window.RECCO_ENABLE_LIVE_AI) */}
      {window.RECCO_ENABLE_LIVE_AI && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '12px 20px 44px',
          background: 'linear-gradient(to top, var(--bone) 60%, transparent)',
        }}>
          <PrimaryButton onClick={() => onAskAI(dish.id)} icon={<Icons.Sparkle size={18} />}>
            Ask Recco about this dish
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}

// ─── Why this pick? ────────────────────────────────────────────
// Renders each scoring signal as a row with a label, a +/- delta chip,
// and a one-line reasoning sentence. The point is *legibility*: users
// trust a recommendation more when they can see why.
function WhyThisPick({ dish }) {
  const [open, setOpen] = React.useState(true);
  const breakdown = dish.breakdown || [];

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
          animation: 'recco-fade-in 0.25s ease',
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
    mood:      <Icons.Sparkle size={16} stroke={2.2} />,
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
        {/* Restaurant strength: render a tiny inline meter so the signal feels concrete */}
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

// ─── Meal feedback ─────────────────────────────────────────────
// Three states:
//   1. Not logged yet → ask "Did you order this?"
//   2. Logged → show what they said + offer to change/clear
//   3. "Wrong dish" → small note acknowledging
function MealFeedback({ dish, meal, onLog, onClear }) {
  // After up/down we briefly show a thank-you state
  const [justLogged, setJustLogged] = React.useState(null);
  React.useEffect(() => {
    if (justLogged) {
      const t = setTimeout(() => setJustLogged(null), 2200);
      return () => clearTimeout(t);
    }
  }, [justLogged]);

  const handleLog = (rating) => {
    onLog(dish.id, rating);
    setJustLogged(rating);
  };

  if (meal && !justLogged) {
    // Already logged — compact summary
    const summary = {
      up:    { icon: '👍', label: 'You liked this', color: 'var(--safe)' },
      down:  { icon: '👎', label: 'Not your thing', color: 'var(--flag)' },
      wrong: { icon: '⤺',  label: 'Marked as wrong recommendation', color: 'var(--char-3)' },
    }[meal.rating];
    return (
      <div style={{ padding: '0 24px 24px' }}>
        <SectionLabel style={{ marginBottom: 12 }}>Your feedback</SectionLabel>
        <div style={{
          background: 'var(--paper)', border: '1px solid var(--sand)',
          borderRadius: 'var(--r-md)', padding: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>{summary.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: summary.color }}>{summary.label}</div>
              <div style={{ fontSize: 11, color: 'var(--char-3)', marginTop: 2 }}>Recco will weight similar dishes accordingly.</div>
            </div>
          </div>
          <button onClick={() => onClear(dish.id)} style={{
            fontSize: 12, fontWeight: 600, color: 'var(--char-3)',
            padding: '6px 10px', borderRadius: 'var(--r-full)',
            background: 'var(--cream)', whiteSpace: 'nowrap',
          }}>Change</button>
        </div>
      </div>
    );
  }

  if (justLogged) {
    return (
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{
          background: 'var(--tomato-soft)', borderRadius: 'var(--r-lg)',
          padding: 16, display: 'flex', alignItems: 'center', gap: 12,
          animation: 'recco-fade-in 0.3s ease',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--tomato)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icons.Check size={20} stroke={2.6} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tomato-ink)' }}>Got it — Recco is learning</div>
            <div style={{ fontSize: 12, color: 'var(--tomato-ink)', opacity: 0.8, marginTop: 2 }}>
              {justLogged === 'up'    && 'We\'ll surface more dishes like this.'}
              {justLogged === 'down'  && 'We\'ll dial back this kind of dish.'}
              {justLogged === 'wrong' && 'Noted — we\'ll improve this recommendation.'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 24px 24px' }}>
      <SectionLabel style={{ marginBottom: 12 }}>Did you order this?</SectionLabel>
      <div style={{
        background: 'var(--paper)', border: '1px solid var(--sand)',
        borderRadius: 'var(--r-lg)', padding: 14,
      }}>
        <div style={{ fontSize: 13, color: 'var(--char-2)', lineHeight: 1.4, marginBottom: 12 }}>
          Help Recco learn your taste. Your feedback adjusts future picks for you.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <FeedbackButton onClick={() => handleLog('up')} icon="👍" label="Loved it" tone="up" />
          <FeedbackButton onClick={() => handleLog('down')} icon="👎" label="Not for me" tone="down" />
        </div>
        <button onClick={() => handleLog('wrong')} style={{
          marginTop: 10, width: '100%', textAlign: 'center',
          fontSize: 12, fontWeight: 600, color: 'var(--char-3)',
          padding: '8px 0',
        }}>
          Wrong recommendation for me →
        </button>
      </div>
    </div>
  );
}

function FeedbackButton({ onClick, icon, label, tone }) {
  const tones = {
    up:   { bd: 'var(--safe)', bg: 'var(--safe-soft)', fg: 'var(--safe)' },
    down: { bd: 'var(--flag)', bg: 'var(--flag-soft)', fg: 'var(--flag)' },
  }[tone];
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '14px 12px',
      background: 'var(--cream)', color: 'var(--char)',
      borderRadius: 'var(--r-md)', border: '1px solid var(--sand)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      fontSize: 13, fontWeight: 700, letterSpacing: '-0.005em',
      transition: 'all 0.15s',
    }}
    onPointerDown={(e) => {
      e.currentTarget.style.background = tones.bg;
      e.currentTarget.style.borderColor = tones.bd;
      e.currentTarget.style.color = tones.fg;
    }}
    >
      <span style={{ fontSize: 22, lineHeight: 1 }}>{icon}</span>
      {label}
    </button>
  );
}

window.DishDetailScreen = DishDetailScreen;
