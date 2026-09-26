const axios = require("axios");
const { kv } = require("@vercel/kv");

const MAILTM = "https://api.mail.tm";

module.exports = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: "❌ email query param required." });

    const token = await kv.get(`tm:${email}`);
    if (!token) return res.status(404).json({ error: "❌ Unknown or expired address." });

    const { data: msgRes } = await axios.get(`${MAILTM}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const list = msgRes["hydra:member"] || [];
    if (list.length === 0) return res.status(200).json({ data: [] });

    const { data: full } = await axios.get(`${MAILTM}/messages/${list[0].id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.status(200).json({
      data: [{
        from: full.from?.address || "?",
        subject: full.subject || "(No subject)",
        date: full.createdAt,
        body: full.text || full.html?.join(" ") || "No content."
      }]
    });
  } catch (err) {
    return res.status(500).json({ error: "❎ Error processing request.", detail: err.message });
  }
};
