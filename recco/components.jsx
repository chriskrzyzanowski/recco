// Recco — shared UI primitives + brand mark
// Inline SVG icons (stroke-based, 24px) — kept tiny and consistent.

// ─── Logo ────────────────────────────────────────────────────
function ReccoLogo({ size = 28, color = 'var(--char)' }) {
  // Wordmark: lowercase "recco" with a soft tomato dot over the second 'c'
  // (the "recommendation" mark).
  return (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0, fontFamily: 'var(--sans)', fontWeight: 800, fontSize: size, letterSpacing: '-0.04em', color, lineHeight: 1, position: 'relative' }}>
      <span style={{ position: 'relative' }}>
        recco
        <span style={{
          position: 'absolute',
          width: size * 0.18, height: size * 0.18, borderRadius: '50%',
          background: 'var(--tomato)',
          // sit above the second 'c'
          top: -size * 0.18, left: size * 0.78,
        }} />
      </span>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────
const Icon = ({ d, size = 22, stroke = 2, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {d}
  </svg>
);
const Icons = {
  Camera:   (p) => <Icon {...p} d={<><path d="M3 7h3l2-3h8l2 3h3v13H3z"/><circle cx="12" cy="13" r="4"/></>} />,
  Home:     (p) => <Icon {...p} d={<><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></>} />,
  History:  (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />,
  Heart:    (p) => <Icon {...p} d={<><path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.64A4 4 0 0 1 19 10c0 5.65-7 10-7 10z"/></>} />,
  HeartOn:  (p) => <Icon {...p} d={<><path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.64A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" fill="currentColor"/></>} />,
  User:     (p) => <Icon {...p} d={<><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></>} />,
  Check:    (p) => <Icon {...p} d={<><path d="M5 12l5 5L20 7"/></>} />,
  X:        (p) => <Icon {...p} d={<><path d="M6 6l12 12M18 6L6 18"/></>} />,
  Chevron:  (p) => <Icon {...p} d={<><path d="M9 6l6 6-6 6"/></>} />,
  ChevronL: (p) => <Icon {...p} d={<><path d="M15 6l-6 6 6 6"/></>} />,
  ChevronD: (p) => <Icon {...p} d={<><path d="M6 9l6 6 6-6"/></>} />,
  Settings: (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a7.97 7.97 0 0 0 0-6l2-1.5-2-3.5-2.4 1a8 8 0 0 0-5.2-3l-.4-2.5h-4l-.4 2.5a8 8 0 0 0-5.2 3l-2.4-1-2 3.5L0 9a7.97 7.97 0 0 0 0 6l-2 1.5"/></>} />,
  Plus:     (p) => <Icon {...p} d={<><path d="M12 5v14M5 12h14"/></>} />,
  Search:   (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></>} />,
  Send:     (p) => <Icon {...p} d={<><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></>} />,
  Sparkle:  (p) => <Icon {...p} d={<><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM19 15l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/></>} />,
  Alert:    (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></>} />,
  Menu:     (p) => <Icon {...p} d={<><path d="M4 6h16M4 12h16M4 18h16"/></>} />,
  Image:    (p) => <Icon {...p} d={<><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.5"/><path d="M21 15l-5-5L5 21"/></>} />,
  Flash:    (p) => <Icon {...p} d={<><path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z"/></>} />,
  Globe:    (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>} />,
  Pencil:   (p) => <Icon {...p} d={<><path d="M4 20h4l11-11-4-4L4 16zM14 5l4 4"/></>} />,
  Apple:    (p) => <Icon {...p} d={<><path d="M16 4c-1 1-2 1.5-3 1.5C13 4 14 3 15 2.5M12 8c-2-2-5-1-6 1-2 4 1 11 4 11 1 0 2-.5 2-.5s1 .5 2 .5c3 0 6-7 4-11-1-2-4-3-6-1z"/></>} />,
  Wand:     (p) => <Icon {...p} d={<><path d="M3 21l9-9M14 6l4 4M16 4l4 4M12 8l4 4"/></>} />,
};

// ─── Match score ring ─────────────────────────────────────────
function MatchRing({ score, size = 56, stroke = 4, color }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  const ringColor = color || (score >= 85 ? 'var(--tomato)' : score >= 60 ? 'var(--warn)' : 'var(--char-3)');
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--sand)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={ringColor} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', lineHeight: 1,
      }}>
        <span className="mono" style={{ fontSize: size * 0.32, fontWeight: 700, color: 'var(--char)' }}>{score}</span>
        <span style={{ fontSize: size * 0.16, color: 'var(--char-3)', fontWeight: 600, marginTop: 2 }}>MATCH</span>
      </div>
    </div>
  );
}

// ─── Dish thumb (placeholder card with first letter + color wash) ─
function DishThumb({ dish, size = 56, radius = 12 }) {
  const initial = dish.name[0];
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: `linear-gradient(135deg, ${dish.color}, ${dish.color}cc)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: size * 0.4,
      fontFamily: 'var(--mono)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* subtle grain stripes */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 8px)',
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{initial}</span>
    </div>
  );
}

// ─── Pill / chip ──────────────────────────────────────────────
function Pill({ children, tone = 'neutral', size = 'sm', style = {} }) {
  const tones = {
    neutral: { bg: 'var(--cream)', fg: 'var(--char-2)', bd: 'transparent' },
    safe:    { bg: 'var(--safe-soft)', fg: 'var(--safe)', bd: 'transparent' },
    warn:    { bg: 'var(--warn-soft)', fg: 'var(--warn)', bd: 'transparent' },
    flag:    { bg: 'var(--flag-soft)', fg: 'var(--flag)', bd: 'transparent' },
    tomato:  { bg: 'var(--tomato)', fg: '#fff', bd: 'transparent' },
    outline: { bg: 'transparent', fg: 'var(--char-2)', bd: 'var(--sand)' },
  }[tone];
  const sizes = {
    sm: { padding: '4px 9px', fontSize: 11, height: 22 },
    md: { padding: '6px 12px', fontSize: 13, height: 28 },
  }[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      borderRadius: 'var(--r-full)',
      background: tones.bg, color: tones.fg, border: `1px solid ${tones.bd}`,
      fontWeight: 600, letterSpacing: '0.01em',
      whiteSpace: 'nowrap',
      ...sizes, ...style,
    }}>{children}</span>
  );
}

// ─── Primary button — full width, big tap target ──────────────
function PrimaryButton({ children, onClick, icon, disabled, style = {}, tone = 'tomato' }) {
  const tones = {
    tomato: { bg: 'var(--tomato)', fg: '#fff' },
    ink: { bg: 'var(--char)', fg: 'var(--bone)' },
    ghost: { bg: 'transparent', fg: 'var(--char)', border: '1.5px solid var(--sand)' },
  }[tone];
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        height: 56, width: '100%',
        borderRadius: 'var(--r-full)',
        background: tones.bg, color: tones.fg,
        border: tones.border || 'none',
        fontWeight: 700, fontSize: 17, letterSpacing: '-0.01em',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        opacity: disabled ? 0.4 : 1,
        transition: 'transform 0.15s, opacity 0.15s',
        ...style,
      }}
      onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
      onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {icon}{children}
    </button>
  );
}

// ─── Bottom tab bar ───────────────────────────────────────────
// Layout: 2 side tabs · floating center scan button · 2 side tabs.
// Bottom padding clears iOS home indicator (~34px).
function TabBar({ active, onNav }) {
  const sideTabs = [
    [
      { id: 'history', label: 'History', icon: Icons.History },
      { id: 'saved', label: 'Saved', icon: Icons.Heart },
    ],
    [
      { id: 'profile', label: 'Profile', icon: Icons.User },
      { id: 'home-list', label: 'Home', icon: Icons.Home, route: 'home' },
    ],
  ];
  const renderTab = (t) => {
    const isActive = active === (t.route || t.id);
    return (
      <button key={t.id} onClick={() => onNav(t.route || t.id)}
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          color: isActive ? 'var(--char)' : 'var(--char-3)',
          padding: '6px 0',
        }}>
        <t.icon size={22} stroke={isActive ? 2.4 : 2} />
        <span style={{ fontSize: 10.5, fontWeight: isActive ? 700 : 500, letterSpacing: '0.02em' }}>{t.label}</span>
      </button>
    );
  };
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 38, paddingTop: 8,
      background: 'rgba(250,247,242,0.92)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--sand)',
      display: 'flex', alignItems: 'center',
      zIndex: 10,
    }}>
      <div style={{ flex: 1, display: 'flex' }}>{sideTabs[0].map(renderTab)}</div>
      <div style={{ width: 80, display: 'flex', justifyContent: 'center' }}>
        <button onClick={() => onNav('scan')}
          style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'var(--tomato)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: -22, boxShadow: '0 6px 18px rgba(190,60,40,0.32)',
            transition: 'transform 0.15s',
          }}
          onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Icons.Camera size={26} stroke={2.2} />
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex' }}>{sideTabs[1].map(renderTab)}</div>
    </div>
  );
}

// ─── Top bar (back button, title, optional action) ────────────
// paddingTop: 54 clears iOS status bar / dynamic island.
function TopBar({ title, onBack, right, transparent }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 5,
      paddingTop: 54, height: 52 + 54, padding: '54px 8px 0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: transparent ? 'transparent' : 'rgba(250,247,242,0.92)',
      backdropFilter: transparent ? 'none' : 'blur(16px)',
    }}>
      <div style={{ width: 44, display: 'flex' }}>
        {onBack && (
          <button onClick={onBack} style={{
            width: 40, height: 40, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--char)',
          }}>
            <Icons.ChevronL size={22} stroke={2.4} />
          </button>
        )}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{title}</div>
      <div style={{ width: 44, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

// ─── Section label (uppercase mono) ───────────────────────────
function SectionLabel({ children, style = {} }) {
  return (
    <div className="mono" style={{
      fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em',
      color: 'var(--char-3)', textTransform: 'uppercase',
      ...style,
    }}>{children}</div>
  );
}

Object.assign(window, {
  ReccoLogo, Icons, MatchRing, DishThumb, Pill, PrimaryButton, TabBar, TopBar, SectionLabel,
});
