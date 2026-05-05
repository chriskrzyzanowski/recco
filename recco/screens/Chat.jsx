// Recco — Dish Q&A chat (real Claude)

function DishChatScreen({ dish, onBack }) {
  const [messages, setMessages] = React.useState(() => [
    { role: 'assistant', text: `Hey! I'm Recco. Ask me anything about ${dish.name} — ingredients, modifications, what to pair, anything.` },
  ]);
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  const presets = [
    'Is this spicy?',
    `What if I'm avoiding ${dish.flags[0] || 'dairy'}?`,
    'What pairs well?',
  ];

  async function send(text) {
    if (!text.trim() || busy) return;
    const userMsg = { role: 'user', text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setBusy(true);
    const sys = `You are Recco, a friendly food expert helping a diner understand a dish at a restaurant. Keep answers SHORT (2-3 sentences max), conversational, and helpful. The dish is "${dish.name}" — ${dish.blurb}. Ingredients: ${dish.ingredients.join(', ')}. Macros: ${dish.macros.cal} cal, ${dish.macros.p}g protein. ${dish.flags.length ? `Note: contains ${dish.flags.join(', ')}.` : ''}`;
    try {
      const reply = await window.claude.complete({
        messages: [
          { role: 'user', content: `${sys}\n\nUser question: ${text}` },
        ],
      });
      setMessages(m => [...m, { role: 'assistant', text: reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', text: "Sorry, I'm having trouble reaching the server. Try again in a moment?" }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar onBack={onBack} title={dish.name} />
      {/* Dish strip */}
      <div style={{ padding: '4px 20px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <DishThumb dish={dish} size={36} radius={8} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--char-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {dish.flags.length ? `contains ${dish.flags.join(', ')}` : 'safe for you'}
          </div>
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '82%',
            padding: '10px 14px',
            borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            background: m.role === 'user' ? 'var(--char)' : 'var(--paper)',
            color: m.role === 'user' ? 'var(--bone)' : 'var(--char)',
            border: m.role === 'user' ? 'none' : '1px solid var(--sand)',
            fontSize: 14, lineHeight: 1.45,
            animation: 'recco-fade-in 0.25s ease',
          }}>
            {m.text}
          </div>
        ))}
        {busy && (
          <div style={{ alignSelf: 'flex-start', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: 'var(--paper)', border: '1px solid var(--sand)', display: 'flex', gap: 4 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: 'var(--char-3)',
                animation: `recco-pulse 1.2s ${i * 0.15}s infinite`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Presets */}
      {messages.length <= 1 && (
        <div style={{ padding: '4px 20px 8px', display: 'flex', gap: 6, overflowX: 'auto' }}>
          {presets.map(p => (
            <button key={p} onClick={() => send(p)} style={{
              flexShrink: 0, padding: '8px 12px',
              background: 'var(--cream)', borderRadius: 'var(--r-full)',
              fontSize: 12, fontWeight: 600, color: 'var(--char-2)',
              whiteSpace: 'nowrap',
            }}>{p}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '8px 16px 44px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          placeholder="Ask anything…"
          style={{
            flex: 1, height: 48, padding: '0 18px', borderRadius: 'var(--r-full)',
            background: 'var(--paper)', border: '1.5px solid var(--sand)',
            fontSize: 15,
          }}
        />
        <button onClick={() => send(input)} disabled={!input.trim() || busy} style={{
          width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
          background: input.trim() && !busy ? 'var(--tomato)' : 'var(--sand)',
          color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
        }}>
          <Icons.Send size={18} />
        </button>
      </div>
    </div>
  );
}

window.DishChatScreen = DishChatScreen;
