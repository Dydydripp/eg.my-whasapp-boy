```js
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const P = require("pino");
const fs = require("fs");

const bannedWords = ["moveword1", "moveword2", "insult1"]; // Ranplase pa mo w vle
const spamThreshold = 5; // Mesaj an 10 segonn
const spamTimeout = 10000;

const lastOnlineDate = new Map();
const messageLogs = new Map();
const spamUsers = new Set();

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: true,
    auth: state,
    version,
  });

  sock.ev.on("creds.update", saveCreds);

  // Spam control
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

    // Check banned words
    const foundBadWord = bannedWords.find(w => text.toLowerCase().includes(w));
[22/07 11:26 AM] ChatGPT: if (foundBadWord) {
      await sock.sendMessage(from, { text: "Tanpri pa itilize pawòl ofansif." });
      return;
    }

    // Spam check
    const now = Date.now();
    if (!messageLogs.has(from)) messageLogs.set(from, []);
    const times = messageLogs.get(from).filter(t => now - t < spamTimeout);
    times.push(now);
    messageLogs.set(from, times);

    if (times.length > spamThreshold) {
      spamUsers.add(from);
      await sock.sendMessage(from, { text: "Ou ap twòp voye mesaj, tanpri ralanti." });
      return;
    }

    // Responses
    if (text.toLowerCase().includes("bonjour")) {
      await sock.sendMessage(from, { text: "Bonjou! Ki jan m ka ede w?" });
    } else if (text.startsWith(".aide")) {
      await sock.sendMessage(from, { text: "Kòmand disponib: .aide, .menu, .google <rechèch>" });
    } else if (text.startsWith(".menu")) {
      await sock.sendMessage(from, { text: "M ap ka fè repons selon mo kle, spam filter, status, mesaj chak jou, elatriye." });
    } else if (text.startsWith(".google")) {
      const query = text.slice(7).trim();
      if (query) {
        await sock.sendMessage(from, { text: `M pa kapab fè rechèch Google aktyèlman, men ou ka fè sa: https://www.google.com/search?q=${encodeURIComponent(query)}` });
      } else {
[22/07 11:27 AM] ChatGPT: await sock.sendMessage(from,  text: "Tanpri mete sa w vle rechèch apre .google" );
       else 
      await sock.sendMessage(from,  text: "M resevwa mesaj ou!" );
    );

  // Message 1 fwa pa jou lè moun online
  sock.ev.on("presence.update", async (update) => 
    const jid = update.id;
    const presences = update.presences;
    const today = new Date().toDateString();

    if (presences        presences[jid]?.lastKnownPresence === "online") 
      const lastDate = lastOnlineDate.get(jid);
      if (lastDate !== today) 
        await sock.sendMessage(jid,  text: "Bonjou! Ou konekte sou WhatsApp 🟢" );
        lastOnlineDate.set(jid, today);
      );

  // Log mesaj nan tèminal
  sock.ev.on("messages.upsert", ( messages ) => 
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    console.log(`Message from{from}: ${text}`);
  });
}

startBot();
```

---

package.json

```json
{
  "name": "my-whatsapp-bot",
  "version": "1.0.0",
  "description": "Bot WhatsApp san OpenAI",
  "main": "bot.js",
  "scripts": {
    "start": "node bot.js"
  },
  "dependencies": {
    "@whiskeysockets/baileys": "^6.5.0",
    "pino": "^8.0.0"
  }
}[:

---

bot.js

```js
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const P = require("pino");
const fs = require("fs");

const bannedWords = ["moveword1", "moveword2", "insult1"]; // Ranplase pa mo w vle
const spamThreshold = 5; // Mesaj an 10 segonn
const spamTimeout = 10000;

const lastOnlineDate = new Map();
const messageLogs = new Map();
const spamUsers = new Set();

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: true,
    auth: state,
    version,
  });

  sock.ev.on("creds.update", saveCreds);

  // Spam control
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

    // Check banned words
    const foundBadWord = bannedWords.find(w => text.toLowerCase().includes(w));
[22/07 11:26 AM] ChatGPT: if (foundBadWord) {
      await sock.sendMessage(from, { text: "Tanpri pa itilize pawòl ofansif." });
      return;
    }

    // Spam check
    const now = Date.now();
    if (!messageLogs.has(from)) messageLogs.set(from, []);
    const times = messageLogs.get(from).filter(t => now - t < spamTimeout);
    times.push(now);
    messageLogs.set(from, times);

    if (times.length > spamThreshold) {
      spamUsers.add(from);
      await sock.sendMessage(from, { text: "Ou ap twòp voye mesaj, tanpri ralanti." });
      return;
    }

    // Responses
    if (text.toLowerCase().includes("bonjour")) {
      await sock.sendMessage(from, { text: "Bonjou! Ki jan m ka ede w?" });
    } else if (text.startsWith(".aide")) {
      await sock.sendMessage(from, { text: "Kòmand disponib: .aide, .menu, .google <rechèch>" });
    } else if (text.startsWith(".menu")) {
      await sock.sendMessage(from, { text: "M ap ka fè repons selon mo kle, spam filter, status, mesaj chak jou, elatriye." });
    } else if (text.startsWith(".google")) {
      const query = text.slice(7).trim();
      if (query) {
        await sock.sendMessage(from, { text: `M pa kapab fè rechèch Google aktyèlman, men ou ka fè sa: https://www.google.com/search?q=${encodeURIComponent(query)}` });
      } else {
[22/07 11:27 AM] ChatGPT: await sock.sendMessage(from,  text: "Tanpri mete sa w vle rechèch apre .google" );
       else 
      await sock.sendMessage(from,  text: "M resevwa mesaj ou!" );
    );

  // Message 1 fwa pa jou lè moun online
  sock.ev.on("presence.update", async (update) => 
    const jid = update.id;
    const presences = update.presences;
    const today = new Date().toDateString();

    if (presences        presences[jid]?.lastKnownPresence === "online") 
      const lastDate = lastOnlineDate.get(jid);
      if (lastDate !== today) 
        await sock.sendMessage(jid,  text: "Bonjou! Ou konekte sou WhatsApp 🟢" );
        lastOnlineDate.set(jid, today);
      );

  // Log mesaj nan tèminal
  sock.ev.on("messages.upsert", ( messages ) => 
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    console.log(`Message from{from}: ${text}`);
  });
}

startBot();
```

---

package.json

```json
{
  "name": "my-whatsapp-bot",
  "version": "1.0.0",
  "description": "Bot WhatsApp san OpenAI",
  "main": "bot.js",
  "scripts": {
    "start": "node bot.[:

---


