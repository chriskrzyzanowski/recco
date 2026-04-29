// Recco — Flavor Swipe (onboarding step 3)
// User taps Like / Skip on a deck of dish archetype cards.
// Output is a taste vector stored on profile.tastes that biases ranking.

function FlavorSwipeScreen({ onBack, onComplete, onSkip }) {
  // Take 8 cards from the deck (skip the duplicates / weak ones).
  const deck = React.useMemo(() => FLAVOR_DECK.slice(0, 8), []);
  const [idx, setIdx] = React.useState(0);
  // Each entry: { id, liked: bool }
  const [swipes, setSwipes] = React.useState([]);
  // Drag state — for swipe animation
  const [drag, setDrag] = React.useState({ x: 0, dragging: false });
  // Direction of last decision so we can replay the exit animation
  const [exiting, setExiting] = React.useState(null); // 'left' | 'right' | null

  const current = deck[idx];
  const next = deck[idx + 1];
  const done = idx >= deck.length;

  // When the deck is empty, build the vector and finish
  React.useEffect(() => {
    if (done) {
      const vector = buildTasteVector(swipes);
      const t = setTimeout(() => onComplete(vector, swipes), 260);
      return () => clearTimeout(t);
    }
  }, [done]);

  const advance = (liked) => {
    setSwipes(s => [...s, { id: current.id, liked }]);
    setExiting(liked ? 'right' : 'left');
    setTimeout(() => {
      setIdx(i => i + 1);
      setDrag({ x: 0, dragging: false });
      setExiting(null);
    }, 240);
  };

  const onPointerDown = (e) => {
    if (exiting) return;
    setDrag({ x: 0, dragging: true, startX: e.clientX });
  };
  const onPointerMove = (e) => {
    if (!drag.dragging) return;
    const dx = e.clientX - drag.startX;
    setDrag(d => ({ ...d, x: dx }));
  };
  const onPointerUp = () => {
    if (!drag.dragging) return;
    if (Math.abs(drag.x) > 80) {
      advance(drag.x > 0);
    } else {
      setDrag({ x: 0, dragging: false });
    }
  };

  // Card transform (drag offset + rotation)
  const cardTransform = (() => {
    if (exiting === 'right') return 'translateX(440px) rotate(20deg)';
    if (exiting === 'left') return 'translateX(-440px) rotate(-20deg)';
    if (drag.dragging) return `translateX(${drag.x}px) rotate(${drag.x * 0.05}deg)`;
    return 'translateX(0) rotate(0)';
  })();

  const decisionTint = drag.x > 30 ? 'right' : drag.x < -30 ? 'left' : null;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar onBack={onBack} title="Step 3 of 3" right={
        <button onClick={onSkip} style={{ fontSize: 14, color: 'var(--char-3)', fontWeight: 600, padding: '8px 10px' }}>Skip</button>
      } />

      <div style={{ padding: '8px 28px 16px' }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>What looks good?</div>
        <div style={{ fontSize: 14, color: 'var(--char-2)', marginTop: 6, lineHeight: 1.4 }}>
          Tap <b>Yes</b> on dishes you'd order, <b>Skip</b> on the rest. {deck.length - idx} left.
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
          {deck.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i < idx ? 'var(--char)' : i === idx ? 'var(--tomato)' : 'var(--sand)',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>
      </div>

      {/* Card stack */}
      <div style={{ flex: 1, position: 'relative', padding: '8px 32px' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Background card (next in deck) */}
        {next && !done && (
          <FlavorCard card={next} style={{
            position: 'absolute', left: 32, right: 32, top: 8,
            transform: 'scale(0.94) translateY(8px)',
            opacity: 0.6,
            pointerEvents: 'none',
          }} />
        )}

        {/* Foreground card */}
        {current && !done && (
          <FlavorCard
            card={current}
            tint={decisionTint}
            style={{
              position: 'absolute', left: 32, right: 32, top: 8,
              transform: cardTransform,
              transition: drag.dragging ? 'none' : 'transform 0.24s cubic-bezier(.4,.2,.3,1)',
              touchAction: 'none',
              cursor: drag.dragging ? 'grabbing' : 'grab',
              userSelect: 'none',
            }}
            onPointerDown={onPointerDown}
          />
        )}

        {/* "All done" empty state during the brief gap before navigation */}
        {done && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--safe-soft)', color: 'var(--safe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icons.Check size={28} stroke={2.6} />
            </div>
            <div style={{ fontSize: 14, color: 'var(--char-2)', fontWeight: 600 }}>Building your taste profile…</div>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div style={{ padding: '12px 28px 44px', display: 'flex', gap: 14, justifyContent: 'center' }}>
        <button onClick={() => !done && advance(false)} disabled={done} style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--paper)', border: '1.5px solid var(--sand)',
          color: 'var(--char-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-1)',
          opacity: done ? 0.4 : 1,
        }}>
          <Icons.X size={26} stroke={2.4} />
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--char-3)' }}>SWIPE OR TAP</div>
          <div style={{ fontSize: 11, color: 'var(--char-3)' }}>← skip · yes →</div>
        </div>
        <button onClick={() => !done && advance(true)} disabled={done} style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--tomato)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-2)',
          opacity: done ? 0.4 : 1,
        }}>
          <Icons.Check size={28} stroke={2.6} />
        </button>
      </div>
    </div>
  );
}

function FlavorCard({ card, tint, style, onPointerDown }) {
  return (
    <div onPointerDown={onPointerDown} style={{
      aspectRatio: '3 / 4',
      borderRadius: 'var(--r-xl)',
      overflow: 'hidden',
      background: card.color,
      position: 'relative',
      boxShadow: 'var(--shadow-3)',
      ...style,
    }}>
      {/* Decision tint overlays */}
      {tint === 'right' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(82,140,90,0.35)', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 24 }}>
          <div style={{ border: '3px solid #fff', borderRadius: 8, padding: '6px 12px', color: '#fff', fontWeight: 800, letterSpacing: '0.05em', transform: 'rotate(-8deg)', fontSize: 18 }}>YES</div>
        </div>
      )}
      {tint === 'left' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 24 }}>
          <div style={{ border: '3px solid #fff', borderRadius: 8, padding: '6px 12px', color: '#fff', fontWeight: 800, letterSpacing: '0.05em', transform: 'rotate(8deg)', fontSize: 18 }}>SKIP</div>
        </div>
      )}

      {/* Photo placeholder — big emoji + texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 12px), radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 60%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 96, opacity: 0.85,
        filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.25))',
      }}>{card.emoji}</div>

      {/* Bottom info bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
        padding: '64px 20px 20px',
        color: '#fff',
      }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', opacity: 0.8 }}>{card.cuisine.toUpperCase()}</div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 4 }}>{card.name}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {card.tags.slice(0, 3).map(t => (
            <span key={t} style={{
              fontSize: 11, fontWeight: 600,
              padding: '4px 9px', borderRadius: 'var(--r-full)',
              background: 'rgba(255,255,255,0.18)', color: '#fff',
              backdropFilter: 'blur(8px)',
            }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

window.FlavorSwipeScreen = FlavorSwipeScreen;
