// Recco — Results screen with 3 layout variants (Tweakable)

function ResultsScreen({ restaurant, dishes, profile, savedSet, layout, onBack, onOpenDish, onToggleSave, onAskAI }) {
  const [filter, setFilter] = React.useState('all'); // all | safe | flagged
  const filtered = dishes.filter(d => {
    if (filter === 'safe') return d.isSafe;
    if (filter === 'flagged') return !d.isSafe;
    return true;
  });
  const safeCount = dishes.filter(d => d.isSafe).length;
  const flaggedCount = dishes.length - safeCount;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar
        title={restaurant.name}
        onBack={onBack}
        right={<button style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--char-2)' }}><Icons.Search size={20} /></button>}
      />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 32 }}>
        {/* Restaurant hero */}
        <div style={{ padding: '4px 24px 16px' }}>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.12em', color: 'var(--char-3)' }}>{(restaurant.type || '').toUpperCase()} · {(restaurant.scannedAt || 'Just now').toUpperCase()}</div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 4 }}>{restaurant.name}</div>
          <div style={{ fontSize: 13, color: 'var(--char-2)', marginTop: 4 }}>
            {dishes.length} dishes · <span style={{ color: 'var(--safe)' }}>{safeCount} match your profile</span>{flaggedCount > 0 && <> · <span style={{ color: 'var(--flag)' }}>{flaggedCount} flagged</span></>}
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ padding: '0 24px 16px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {[
            { id: 'all', label: `All ${dishes.length}` },
            { id: 'safe', label: `Safe ${safeCount}` },
            { id: 'flagged', label: `Flagged ${flaggedCount}` },
          ].map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              padding: '8px 14px', borderRadius: 'var(--r-full)',
              background: filter === t.id ? 'var(--char)' : 'var(--paper)',
              color: filter === t.id ? 'var(--bone)' : 'var(--char-2)',
              border: filter === t.id ? '1px solid var(--char)' : '1px solid var(--sand)',
              fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
            }}>{t.label}</button>
          ))}
        </div>

        {layout === 'stack' && <StackLayout dishes={filtered} savedSet={savedSet} onOpenDish={onOpenDish} onToggleSave={onToggleSave} onAskAI={onAskAI} />}
        {layout === 'cards' && <CardsLayout dishes={filtered} savedSet={savedSet} onOpenDish={onOpenDish} onToggleSave={onToggleSave} />}
        {layout === 'compare' && <CompareLayout dishes={filtered} savedSet={savedSet} onOpenDish={onOpenDish} onToggleSave={onToggleSave} />}
      </div>
    </div>
  );
}

// ─── Layout 1: Stack (default — top pick hero, list below) ─────
function StackLayout({ dishes, savedSet, onOpenDish, onToggleSave, onAskAI }) {
  if (dishes.length === 0) return <EmptyMsg>No dishes match this filter.</EmptyMsg>;
  const [hero, ...rest] = dishes;
  return (
    <>
      {/* Hero card — div+role for valid HTML (nested clickable Save button below) */}
      <div style={{ padding: '0 24px 16px' }}>
        <div role="button" tabIndex={0} onClick={() => onOpenDish(hero.id)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenDish(hero.id); } }}
          style={{
          width: '100%', textAlign: 'left', cursor: 'pointer',
          background: 'var(--paper)', borderRadius: 'var(--r-xl)',
          border: hero.isSafe ? '1px solid var(--sand)' : '1px solid var(--flag-soft)',
          padding: 18,
          display: 'flex', flexDirection: 'column', gap: 14,
          boxShadow: 'var(--shadow-1)',
          animation: 'recco-slide-up 0.4s ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Pill tone={hero.isSafe ? 'safe' : 'flag'} size="sm">
                {hero.isSafe ? '✓ Top pick' : '⚠ Top pick'}
              </Pill>
              <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 10, lineHeight: 1.2, wordBreak: 'break-word' }}>{hero.name}</div>
              <div style={{ fontSize: 13, color: 'var(--char-2)', marginTop: 6, lineHeight: 1.4 }}>{hero.blurb}</div>
            </div>
            <MatchRing score={hero.score} size={52} stroke={4} />
          </div>

          {/* Macros */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, padding: '12px 0 0', borderTop: '1px solid var(--sand)' }}>
            {[['Cal', hero.macros.cal], ['Pro', `${hero.macros.p}g`], ['Carb', `${hero.macros.c}g`], ['Fat', `${hero.macros.f}g`]].map(([k, v]) => (
              <div key={k}>
                <div className="mono" style={{ fontSize: 10, color: 'var(--char-3)', letterSpacing: '0.06em' }}>{k.toUpperCase()}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Flags / tags */}
          {hero.flags.length > 0 ? (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {hero.flags.map(f => <Pill key={f} tone="flag" size="sm">⚠ Contains {f}</Pill>)}
            </div>
          ) : hero.tags.length > 0 ? (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {hero.tags.slice(0,3).map(t => <Pill key={t} tone="neutral" size="sm">{t}</Pill>)}
            </div>
          ) : null}

          {/* Actions — Ask Recco is hidden until live AI is wired (window.RECCO_ENABLE_LIVE_AI) */}
          <div style={{ display: 'flex', gap: 8 }}>
            {window.RECCO_ENABLE_LIVE_AI && (
              <button onClick={(e) => { e.stopPropagation(); onAskAI(hero.id); }} style={{
                flex: 1, height: 44, borderRadius: 'var(--r-full)',
                background: 'var(--cream)', color: 'var(--char)',
                fontSize: 14, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}><Icons.Sparkle size={16} /> Ask Recco</button>
            )}
            <button onClick={(e) => { e.stopPropagation(); onToggleSave(hero.id); }} style={{
              flex: window.RECCO_ENABLE_LIVE_AI ? '0 0 44px' : 1,
              height: 44,
              borderRadius: window.RECCO_ENABLE_LIVE_AI ? '50%' : 'var(--r-full)',
              background: 'var(--cream)', color: savedSet.has(hero.id) ? 'var(--tomato)' : 'var(--char-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontSize: 14, fontWeight: 700,
            }}>
              {savedSet.has(hero.id) ? <Icons.HeartOn size={18} /> : <Icons.Heart size={18} />}
              {!window.RECCO_ENABLE_LIVE_AI && (savedSet.has(hero.id) ? 'Saved' : 'Save for later')}
            </button>
          </div>
        </div>
      </div>

      {/* Rest of list */}
      <div style={{ padding: '0 24px' }}>
        <SectionLabel style={{ marginBottom: 10 }}>Other picks</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rest.map((d, i) => <DishRow key={d.id} dish={d} saved={savedSet.has(d.id)} onClick={() => onOpenDish(d.id)} onToggleSave={() => onToggleSave(d.id)} delay={i * 30} />)}
        </div>
      </div>
    </>
  );
}

function DishRow({ dish, saved, onClick, onToggleSave, delay = 0 }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: 12, borderRadius: 'var(--r-md)',
      background: 'var(--paper)', border: '1px solid var(--sand)',
      textAlign: 'left',
      animation: `recco-fade-in 0.3s ease ${delay}ms both`,
    }}>
      <DishThumb dish={dish} size={52} radius={11} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dish.name}</div>
          {!dish.isSafe && <span style={{ color: 'var(--flag)', flexShrink: 0 }}><Icons.Alert size={14} /></span>}
        </div>
        <div style={{ fontSize: 12, color: 'var(--char-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>
          {dish.macros.cal} cal · {dish.section}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span className="mono" style={{ fontSize: 16, fontWeight: 700, color: dish.score >= 85 ? 'var(--tomato)' : dish.score >= 60 ? 'var(--char)' : 'var(--char-3)' }}>{dish.score}</span>
        <span style={{ fontSize: 9, color: 'var(--char-3)', fontWeight: 700 }}>%</span>
      </div>
    </button>
  );
}

// ─── Layout 2: Cards (2-up grid) ──────────────────────────────
function CardsLayout({ dishes, savedSet, onOpenDish, onToggleSave }) {
  if (dishes.length === 0) return <EmptyMsg>No dishes match this filter.</EmptyMsg>;
  return (
    <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {dishes.map((d, i) => (
        <div key={d.id} role="button" tabIndex={0} onClick={() => onOpenDish(d.id)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenDish(d.id); } }}
          style={{
          background: 'var(--paper)', borderRadius: 'var(--r-lg)',
          border: '1px solid var(--sand)', padding: 12, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left',
          animation: `recco-fade-in 0.3s ease ${i * 30}ms both`,
          minHeight: 200,
        }}>
          <div style={{ position: 'relative' }}>
            <DishThumb dish={d} size="100%" radius={12} />
            <div style={{
              position: 'absolute', top: 6, left: 6,
              padding: '3px 7px', background: 'rgba(255,255,255,0.95)',
              borderRadius: 'var(--r-full)',
              fontSize: 11, fontWeight: 800, fontFamily: 'var(--mono)',
              color: d.score >= 85 ? 'var(--tomato)' : 'var(--char)',
            }}>{d.score}%</div>
            <button onClick={(e) => { e.stopPropagation(); onToggleSave(d.id); }} style={{
              position: 'absolute', top: 4, right: 4,
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              color: savedSet.has(d.id) ? 'var(--tomato)' : 'var(--char-3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{savedSet.has(d.id) ? <Icons.HeartOn size={14} /> : <Icons.Heart size={14} />}</button>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{d.name}</div>
            <div style={{ fontSize: 11, color: 'var(--char-3)', marginTop: 2 }}>{d.macros.cal} cal · {d.macros.p}g pro</div>
            {!d.isSafe && <div style={{ fontSize: 10, color: 'var(--flag)', marginTop: 4, fontWeight: 600 }}>⚠ {d.flags[0]}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// Override: dish thumb full-width variant
const _origDishThumb = window.DishThumb;
window.DishThumb = function (props) {
  if (props.size === '100%') {
    return (
      <div style={{
        width: '100%', aspectRatio: '1.4', borderRadius: props.radius || 12,
        background: `linear-gradient(135deg, ${props.dish.color}, ${props.dish.color}cc)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: 36,
        fontFamily: 'var(--mono)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 8px)',
        }} />
        <span style={{ position: 'relative' }}>{props.dish.name[0]}</span>
      </div>
    );
  }
  return _origDishThumb(props);
};

// ─── Layout 3: Compare (top 3 side-by-side) ──────────────────
function CompareLayout({ dishes, savedSet, onOpenDish, onToggleSave }) {
  if (dishes.length === 0) return <EmptyMsg>No dishes match this filter.</EmptyMsg>;
  const top = dishes.slice(0, 3);
  const rest = dishes.slice(3);
  return (
    <>
      <div style={{ padding: '0 24px 8px' }}>
        <SectionLabel>Top 3 — swipe to compare</SectionLabel>
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '8px 24px 16px', overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
        {top.map((d, i) => (
          <button key={d.id} onClick={() => onOpenDish(d.id)} style={{
            flexShrink: 0, width: 220, scrollSnapAlign: 'start',
            background: 'var(--paper)', borderRadius: 'var(--r-lg)',
            border: '1px solid var(--sand)', padding: 14, textAlign: 'left',
            display: 'flex', flexDirection: 'column', gap: 10,
            animation: `recco-fade-in 0.3s ease ${i * 50}ms both`,
            boxShadow: i === 0 ? 'var(--shadow-1)' : 'none',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Pill tone={i === 0 ? 'tomato' : 'neutral'} size="sm">#{i + 1}</Pill>
              <MatchRing score={d.score} size={44} stroke={3} />
            </div>
            <DishThumb dish={d} size={60} radius={12} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{d.name}</div>
              <div style={{ fontSize: 11, color: 'var(--char-3)', marginTop: 4 }}>{d.macros.cal} cal · {d.macros.p}g pro · {d.macros.c}g carb</div>
            </div>
            {!d.isSafe && <Pill tone="flag" size="sm">⚠ {d.flags[0]}</Pill>}
          </button>
        ))}
      </div>
      {rest.length > 0 && (
        <div style={{ padding: '0 24px' }}>
          <SectionLabel style={{ marginBottom: 10 }}>Also here</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rest.map((d, i) => <DishRow key={d.id} dish={d} saved={savedSet.has(d.id)} onClick={() => onOpenDish(d.id)} onToggleSave={() => onToggleSave(d.id)} delay={i * 30} />)}
          </div>
        </div>
      )}
    </>
  );
}

function EmptyMsg({ children }) {
  return <div style={{ padding: 40, textAlign: 'center', color: 'var(--char-3)', fontSize: 14 }}>{children}</div>;
}

window.ResultsScreen = ResultsScreen;
