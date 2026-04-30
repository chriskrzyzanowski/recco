// Recco — Camera scan + AI analysis (animated)

function CameraScanScreen({ onBack, onComplete, restaurant }) {
  const r = restaurant || RESTAURANTS[DEFAULT_RESTAURANT_ID];
  const [phase, setPhase] = React.useState('aim'); // aim → scanning → error → done
  const [detected, setDetected] = React.useState(0);
  // Tracks the simulated reason for the error state, for copy variation
  const [errorKind, setErrorKind] = React.useState('low-confidence');

  React.useEffect(() => {
    if (phase !== 'aim') return;
    const t1 = setTimeout(() => setPhase('scanning'), 800);
    return () => clearTimeout(t1);
  }, [phase]);

  React.useEffect(() => {
    if (phase !== 'scanning') return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDetected(i);
      if (i >= 6) {
        clearInterval(id);
        setTimeout(() => onComplete(), 400);
      }
    }, 220);
    return () => clearInterval(id);
  }, [phase, onComplete]);

  const triggerError = (kind) => {
    setErrorKind(kind);
    setPhase('error');
  };
  const retry = () => {
    setDetected(0);
    setPhase('aim');
  };

  // Simulated menu items on the "menu image"
  const items = [
    { y: 80, w: 60 }, { y: 120, w: 70 }, { y: 175, w: 55 },
    { y: 240, w: 65 }, { y: 300, w: 60 }, { y: 360, w: 70 },
  ];

  return (
    <div style={{ width: '100%', height: '100%', background: '#0F0E0C', position: 'relative', overflow: 'hidden' }}>
      {/* Top controls — clear iOS status bar */}
      <div style={{ position: 'absolute', top: 60, left: 12, right: 12, zIndex: 10, display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icons.X size={20} />
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icons.Flash size={18} />
          </button>
          <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icons.Image size={18} />
          </button>
        </div>
      </div>

      {/* Live badge */}
      {phase === 'scanning' && (
        <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 60, display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--tomato)', borderRadius: 'var(--r-full)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'recco-pulse 1s infinite' }} />
          READING
        </div>
      )}

      {/* Viewfinder — fake menu page */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 280, height: 420, borderRadius: 8,
          background: '#F5EFE2',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          transform: 'rotate(-1deg)',
        }}>
          {/* fake menu typography — reflects whatever restaurant is active */}
          <div style={{ padding: '20px 18px', color: '#2a2620' }}>
            <div style={{ fontFamily: 'serif', fontSize: 14, fontWeight: 800, letterSpacing: '0.1em', textAlign: 'center' }}>
              {(r.name || 'MENU').toUpperCase()}
            </div>
            <div style={{ height: 1, background: '#2a2620', opacity: 0.3, margin: '8px 0 10px' }} />
            <div style={{ fontFamily: 'serif', fontSize: 9, letterSpacing: '0.15em', textAlign: 'center', opacity: 0.6 }}>
              {(r.type || '').toUpperCase()}
            </div>
            <div style={{ marginTop: 12 }}>
              {(r.dishes || []).slice(0, 6).map((d) => (
                <FakeMenuLine
                  key={d.id}
                  title={d.name}
                  price={d.price || ''}
                  desc={(d.ingredients || []).slice(0, 4).join(', ')}
                />
              ))}
            </div>
          </div>

          {/* OCR detection boxes */}
          {phase === 'scanning' && items.slice(0, detected).map((it, i) => (
            <div key={i} style={{
              position: 'absolute', left: 16, top: it.y,
              width: `${it.w}%`, height: 18,
              border: '1.5px solid var(--tomato)',
              borderRadius: 3,
              background: 'rgba(245,76,52,0.10)',
              animation: 'recco-fade-in 0.2s ease',
            }} />
          ))}

          {/* scan line */}
          {phase === 'scanning' && (
            <div style={{
              position: 'absolute', left: 0, right: 0, top: 0, height: 40,
              background: 'linear-gradient(to bottom, transparent, rgba(245,76,52,0.4), transparent)',
              animation: 'recco-scan 2s ease-in-out infinite',
              borderTop: '1px solid var(--tomato)',
              borderBottom: '1px solid var(--tomato)',
            }} />
          )}
        </div>
      </div>

      {/* Corner brackets */}
      {phase === 'aim' && [
        { top: 80, left: 24, b: 'top left' },
        { top: 80, right: 24, b: 'top right' },
        { bottom: 200, left: 24, b: 'bottom left' },
        { bottom: 200, right: 24, b: 'bottom right' },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute', width: 24, height: 24,
          ...c,
          borderTop: c.b.includes('top') ? '2px solid #fff' : 'none',
          borderBottom: c.b.includes('bottom') ? '2px solid #fff' : 'none',
          borderLeft: c.b.includes('left') ? '2px solid #fff' : 'none',
          borderRight: c.b.includes('right') ? '2px solid #fff' : 'none',
        }} />
      ))}

      {/* Bottom hint — above home indicator */}
      <div style={{ position: 'absolute', bottom: 80, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500, padding: '0 40px' }}>
        {phase === 'aim' ? 'Center the menu in the frame' : phase === 'scanning' ? `Reading ${detected} dish${detected === 1 ? '' : 'es'}…` : ''}
      </div>

      {/* Demo trigger — for prototype reviewers; surfaces the error states.
          In a shipped app this would be a real failure mode. */}
      {phase === 'aim' && (
        <div style={{ position: 'absolute', bottom: 36, left: 0, right: 0, display: 'flex', gap: 6, justifyContent: 'center', zIndex: 11 }}>
          <button onClick={() => triggerError('low-confidence')} style={{
            fontSize: 10, padding: '5px 9px', borderRadius: 999,
            background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(10px)',
            color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.05em',
          }}>DEMO: low confidence</button>
          <button onClick={() => triggerError('blurry')} style={{
            fontSize: 10, padding: '5px 9px', borderRadius: 999,
            background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(10px)',
            color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.05em',
          }}>DEMO: blurry</button>
        </div>
      )}

      {/* Error overlay — shown when scan fails */}
      {phase === 'error' && (
        <ScanErrorPanel kind={errorKind} onRetry={retry} onManual={onComplete} onCancel={onBack} />
      )}
    </div>
  );
}

function FakeMenuLine({ title, price, desc }) {
  return (
    <div style={{ marginTop: 8, fontFamily: 'serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700 }}>
        <span>{title}</span><span>{price}</span>
      </div>
      <div style={{ fontSize: 8, color: '#5a544a', marginTop: 1, fontStyle: 'italic' }}>{desc}</div>
    </div>
  );
}

// ─── Scan error / low-confidence panel ─────────────────────────
// Shown when the OCR can't read a menu cleanly. Two variants:
// • low-confidence: read a few items but isn't sure — offers retry or "use what we got"
// • blurry: couldn't read enough — offers retry, lighting tip, or manual entry
function ScanErrorPanel({ kind, onRetry, onManual, onCancel }) {
  const isLowConf = kind === 'low-confidence';
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 70,
      background: 'rgba(15,14,12,0.65)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div style={{
        width: '100%',
        background: 'var(--bone)',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '24px 24px 44px',
        animation: 'recco-slide-up 0.32s cubic-bezier(.4,.2,.2,1)',
      }}>
        {/* drag handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--sand)', margin: '0 auto 16px' }} />

        {/* Icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: isLowConf ? 'var(--tomato-soft)' : 'var(--flag-soft)',
            color: isLowConf ? 'var(--tomato-ink)' : 'var(--flag)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icons.Alert size={20} stroke={2.4} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>
            {isLowConf ? 'We caught some of that' : 'Couldn\'t read the menu'}
          </div>
        </div>

        {/* Body copy */}
        <div style={{ fontSize: 14, color: 'var(--char-2)', lineHeight: 1.5, marginBottom: 18 }}>
          {isLowConf ? (
            <>We read <b style={{ color: 'var(--char)' }}>3 of 6 dishes</b> with high confidence. The rest were partly cut off. Reshoot for the full menu, or use what we have.</>
          ) : (
            <>The image was too blurry, dim, or angled to read. Try moving closer, holding still, and getting more light on the menu.</>
          )}
        </div>

        {/* Tips */}
        <div style={{
          background: 'var(--cream)', borderRadius: 'var(--r-md)',
          padding: 14, marginBottom: 18,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--char-3)' }}>FOR A BETTER SCAN</div>
          {[
            ['💡', 'More light helps. Avoid candle-only.'],
            ['📏', 'Hold the menu flat at arm\'s length.'],
            ['📸', 'Get the whole page in the frame.'],
          ].map(([e, t]) => (
            <div key={t} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--char)' }}>
              <span style={{ fontSize: 14 }}>{e}</span>
              <span>{t}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PrimaryButton onClick={onRetry} icon={<Icons.Camera size={18} />}>Try again</PrimaryButton>
          {isLowConf && (
            <button onClick={onManual} style={{
              height: 52, borderRadius: 'var(--r-full)',
              background: 'var(--paper)', border: '1.5px solid var(--sand)',
              fontSize: 15, fontWeight: 700, color: 'var(--char)',
            }}>Use what we have</button>
          )}
          <button onClick={onManual} style={{
            height: 44, fontSize: 13, fontWeight: 600, color: 'var(--char-3)',
          }}>Type a dish name manually</button>
        </div>
      </div>
    </div>
  );
}

// ─── AI Analysis ──────────────────────────────────────────────
function AIAnalysisScreen({ profile, onComplete }) {
  const steps = [
    'Reading menu structure',
    'Parsing ingredients',
    'Cross-checking allergens',
    `Matching to ${profile.diet} profile`,
    'Estimating macros',
    'Ranking your picks',
  ];
  const [done, setDone] = React.useState(0);

  React.useEffect(() => {
    if (done >= steps.length) {
      const t = setTimeout(onComplete, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone(d => d + 1), done === 0 ? 250 : 280);
    return () => clearTimeout(t);
  }, [done]);

  const progress = (done / steps.length) * 100;

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--bone)', display: 'flex', flexDirection: 'column', padding: '54px 28px 0' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* spinner */}
        <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 28 }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '3px solid var(--sand)',
            borderTopColor: 'var(--tomato)',
            animation: 'recco-spin 1s linear infinite',
          }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tomato)' }}>
            <Icons.Sparkle size={28} />
          </div>
        </div>
        <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--char-3)' }}>RECCO IS THINKING</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 6, lineHeight: 1.15 }}>Reading the menu…</div>

        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((s, i) => {
            const isDone = i < done;
            const isActive = i === done;
            const isPending = i > done;
            return (
              <div key={s} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                opacity: isPending ? 0.35 : 1,
                transition: 'opacity 0.3s',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: isDone ? 'var(--safe)' : isActive ? 'var(--tomato)' : 'transparent',
                  border: isPending ? '1.5px solid var(--sand)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', flexShrink: 0,
                  transition: 'all 0.2s',
                }}>
                  {isDone && <Icons.Check size={14} stroke={3} />}
                  {isActive && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'recco-pulse 0.8s infinite' }} />}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: isPending ? 'var(--char-3)' : 'var(--char)' }}>{s}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ paddingBottom: 48 }}>
        <div style={{ height: 4, background: 'var(--sand)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--tomato)', borderRadius: 2, transition: 'width 0.3s ease' }} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CameraScanScreen, AIAnalysisScreen });
