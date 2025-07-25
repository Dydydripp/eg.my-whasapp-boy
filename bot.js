
```js
const { default: makeWASocket, DisconnectReason, useSingleFileAuthState } = require("@adiwajshing/baileys");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const P = require("pino");
const { state, saveState } = useSingleFileAuthState("./session.json");

const banned = new Set();
const greeted = new Map();

async function startBot() {
  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: true,
    auth: state,
  });

  sock.ev.on("creds.update", saveState);

  sock.ev.on("messages.upsert", async (msg) => {
    const m = msg.messages[0];
    if (!m.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const sender = m.key.participant || from;
    const text = m.message.conversation || m.message.extendedTextMessage?.text || "";

    // Auto-read
    await sock.readMessages([m.key]);

    // Auto view status
    if (from.includes("status@broadcast")) {
      await sock.readMessages([m.key]);
    }

    // Repons "slt" 1 fwa pa jou
    const today = new Date().toDateString();
    if (text.toLowerCase() === "slt") {
      if (greeted.get(sender) !== today) {banned.add(num + "@s.whatsapp.net");
        await sock.sendMessage(from, { text: `Nimewo ${num} banni.` });
      }
    }

    // Komand .menu
    if (text === ".menu") {
      await sock.sendMessage(from, {
        text: `📋 *Menu Bot Dydy*\n
.foto – voye yon foto
.videyo – voye yon videyo
.mizik – voye mizik
.ban +nimewo – banni yon moun
.menu – montre meni`
      });
    }
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
      startBot();
    } else if (connection === "open") {
      console.log("✅ Bot konekte ak WhatsApp!");
    }
  });
}

startBot();
