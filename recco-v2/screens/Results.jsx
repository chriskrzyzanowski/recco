// Recco v2 — Results screen
// MVP trim: stack layout only (no Cards/Compare layouts), no macros row,
// no Saved heart, no "Ask Recco" chat (Ask AI cut for MVP).

function ResultsScreen({ restaurant, dishes, onBack, onOpenDish }) {
  const [filter, setFilter] = React.useState('all');
  const filtered = dishes.filter(d => {
    if (filter === 'safe') return d.isSafe;
    if (filter === 'flagged') return !d.isSafe;
    return true;
  });
  const safeCount = dishes.filter(d => d.isSafe).length;
  const flaggedCount = dishes.length - safeCount;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar title={restaurant.name} onBack={onBack} />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 32 }}>
        <div style={{ padding: '4px 24px 16px' }}>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.12em', color: 'var(--char-3)' }}>{(restaurant.type || '').toUpperCase()}</div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 4 }}>{restaurant.name}</div>
          <div style={{ fontSize: 13, color: 'var(--char-2)', marginTop: 4 }}>
            {dishes.length} dishes · <span style={{ color: 'var(--safe)' }}>{safeCount} match your profile</span>{flaggedCount > 0 && <> · <span style={{ color: 'var(--flag)' }}>{flaggedCount} flagged</span></>}
          </div>
        </div>

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

        <StackLayout dishes={filtered} onOpenDish={onOpenDish} />
      </div>
    </div>
  );
}

function StackLayout({ dishes, onOpenDish }) {
  if (dishes.length === 0) return <EmptyMsg>No dishes match this filter.</EmptyMsg>;
  const [hero, ...rest] = dishes;
  return (
    <>
      <div style={{ padding: '0 24px 16px' }}>
        <button onClick={() => onOpenDish(hero.id)} style={{
          width: '100%', textAlign: 'left',
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

          {hero.flags.length > 0 ? (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {hero.flags.map(f => <Pill key={f} tone="flag" size="sm">⚠ Contains {f}</Pill>)}
            </div>
          ) : hero.tags.length > 0 ? (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {hero.tags.slice(0,3).map(t => <Pill key={t} tone="neutral" size="sm">{t}</Pill>)}
            </div>
          ) : null}
        </button>
      </div>

      <div style={{ padding: '0 24px' }}>
        <SectionLabel style={{ marginBottom: 10 }}>Other picks</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rest.map((d, i) => <DishRow key={d.id} dish={d} onClick={() => onOpenDish(d.id)} delay={i * 30} />)}
        </div>
      </div>
    </>
  );
}

function DishRow({ dish, onClick, delay = 0 }) {
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
          {dish.section}{dish.price ? ` · ${dish.price}` : ''}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span className="mono" style={{ fontSize: 16, fontWeight: 700, color: dish.score >= 85 ? 'var(--tomato)' : dish.score >= 60 ? 'var(--char)' : 'var(--char-3)' }}>{dish.score}</span>
        <span style={{ fontSize: 9, color: 'var(--char-3)', fontWeight: 700 }}>%</span>
      </div>
    </button>
  );
}

function EmptyMsg({ children }) {
  return <div style={{ padding: 40, textAlign: 'center', color: 'var(--char-3)', fontSize: 14 }}>{children}</div>;
}

window.ResultsScreen = ResultsScreen;
