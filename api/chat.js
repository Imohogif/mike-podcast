module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action } = req.body;

  // ── ACTION: chat (Claude generates host response) ──
  if (action === 'chat') {
    const { messages, system } = req.body;
    if (!messages || !system) return res.status(400).json({ error: 'Missing fields' });

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 700,
        system,
        messages,
      }),
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      return res.status(r.status).json({ error: e.error?.message || 'Claude error' });
    }
    const d = await r.json();
    return res.status(200).json({ text: d.content.map(b => b.text || '').join('') });
  }

  // ── ACTION: tts (OpenAI generates audio) ──
  if (action === 'tts') {
    const { text, lang } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing text' });

    const voice = lang === 'ar' ? 'onyx' : 'onyx'; // onyx = deep male voice
    const r = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice,
        speed: 0.92,
      }),
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      return res.status(r.status).json({ error: e.error?.message || 'TTS error' });
    }
    const audioBuffer = await r.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    return res.status(200).send(Buffer.from(audioBuffer));
  }

  return res.status(400).json({ error: 'Unknown action' });
};
