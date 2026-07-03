import express from 'express';
const router = express.Router();

router.post('/generate-itinerary', async (req, res) => {
  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(req.body), // { model, max_tokens, messages } — same shape frontend already builds
    });

    const data = await groqRes.json();
    res.status(groqRes.status).json(data);
  } catch (err) {
    console.error('Groq proxy error:', err);
    res.status(500).json({ error: 'Groq request failed' });
  }
});

export default router;