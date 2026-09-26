const axios = require("axios");
const { kv } = require("@vercel/kv");

const MAILTM = "https://api.mail.tm";

// Cosmetic provider labels only (real mail can only be received on the
// underlying mail.tm domain - no third-party code can create real
// gmail.com / outlook.com / hotmail.com inboxes).
const P = {
  g: "gmail", gmail: "gmail",
  o: "outlook", outlook: "outlook",
  h: "hotmail", hotmail: "hotmail",
  e: "edu", edu: "edu", student: "edu", s: "edu"
};

function randStr(len) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

module.exports = async (req, res) => {
  try {
    const arg = (req.query.providers || "").toLowerCase();
    if (arg && !P[arg]) {
      return res.status(400).json({ error: "❌ Provider: gmail(g) | outlook(o) | hotmail(h) | edu(e)" });
    }
    const label = arg ? P[arg] : "gmail";

    const { data: domainsRes } = await axios.get(`${MAILTM}/domains`);
    const domain = domainsRes["hydra:member"]?.[0]?.domain;
    if (!domain) return res.status(500).json({ error: "❌ No mail domain available." });

    const address = `${label}.${randStr(8)}@${domain}`;
    const password = randStr(14);

    await axios.post(`${MAILTM}/accounts`, { address, password });
    const { data: tokenRes } = await axios.post(`${MAILTM}/token`, { address, password });
    const token = tokenRes.token;

    await kv.set(`tm:${address}`, token, { ex: 3600 });

    return res.status(200).json({ email: address, provider: label });
  } catch (err) {
    return res.status(500).json({ error: "❌ Failed to generate email.", detail: err.message });
  }
};
