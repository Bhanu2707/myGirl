require("dotenv").config();
const mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

const { connectDB } = require("./db");
const Message = require("./models/Message");
const ButtonClick = require("./models/ButtonClick");
// const Visitor = require('./models/Visitors')

const PORT = process.env.PORT || 4000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------
// Mailer
// ---------------------------------------------------------------------
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendJobEmail(job) {
  const fromAddress = process.env.FROM_ADDRESS || process.env.SMTP_USER;
  await transporter.sendMail({
    from: fromAddress,
    to: job.toEmail,
    replyTo: job.fromEmail,
    subject: "A message, sent through time",
    text: `${job.message}\n\n— scheduled by ${job.fromEmail} for ${job.sendAt.toISOString()}`,
  });
}

// ---------------------------------------------------------------------
// Scheduler — runs every minute, sends anything that's due. This (not a
// long-lived setTimeout) is what lets jobs be scheduled months or years
// out: setTimeout can't reliably hold a delay that long, and the process
// wouldn't stay alive for it anyway. The process itself must stay running
// 24/7 on whatever host you deploy this to — see README.md.
// ---------------------------------------------------------------------
async function processDueJobs() {
  const now = new Date();
  const dueJobs = await Message.find({ sent: false, sendAt: { $lte: now } });

  for (const job of dueJobs) {
    try {
      await sendJobEmail(job);
      job.sent = true;
      job.sentAt = new Date();
      await job.save();
      // console.log(`Sent scheduled message ${job._id} to ${job.toEmail}`);
    } catch (err) {
      job.lastError = err.message;
      job.attempts = (job.attempts || 0) + 1;
      await job.save();
      console.error(`Failed to send job ${job._id}:`, err.message);
    }
  }
}

cron.schedule("* * * * *", () => {
  processDueJobs().catch((err) =>
    console.error("processDueJobs crashed:", err),
  );
});

// ---------------------------------------------------------------------
// API
// ---------------------------------------------------------------------
const app = express();
app.use(express.json());

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://my-girl-q5j7ulfxs-bhanus-projects-63161851.vercel.app",  // ✅ No /
    "https://my-girl-black.vercel.app"  // ✅ No /
  ],
  credentials: true
}));

app.get("/",(req, res)=>{
  res.send("hii")
})

app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.post("/api/schedule", async (req, res) => {
  const { fromEmail, toEmail, message, sendAt } = req.body || {};

  if (!fromEmail || !EMAIL_RE.test(fromEmail)) {
    return res
      .status(400)
      .json({
        ok: false,
        error: 'Please provide a valid "from" email address.',
      });
  }
  if (!toEmail || !EMAIL_RE.test(toEmail)) {
    return res
      .status(400)
      .json({ ok: false, error: 'Please provide a valid "to" email address.' });
  }
  if (!message || !message.trim()) {
    return res
      .status(400)
      .json({ ok: false, error: "Message cannot be empty." });
  }
  const sendAtDate = new Date(sendAt);
  if (!sendAt || Number.isNaN(sendAtDate.getTime())) {
    return res
      .status(400)
      .json({ ok: false, error: "Please provide a valid send date/time." });
  }

  try {
    const job = await Message.create({
      fromEmail,
      toEmail,
      message: message.trim(),
      sendAt: sendAtDate,
    });
    res.json({ ok: true, id: job._id });
  } catch (err) {
    console.error("Failed to save scheduled message:", err.message);
    res
      .status(500)
      .json({
        ok: false,
        error: "Could not schedule the message. Please try again.",
      });
  }
});

// ---------------------------------------------------------------------
// Button-click analytics — ordinary interaction logging (which button was
// clicked, and when). Just { button, timestamp } in its own collection.
// ---------------------------------------------------------------------
app.post("/api/analytics/click", async (req, res) => {
  const { button } = req.body || {};

  if (!button || typeof button !== "string" || !button.trim()) {
    return res.status(400).json({ ok: false, error: 'Missing "button" name.' });
  }

  try {
    await ButtonClick.create({ button: button.trim() });
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to log button click:", err.message);
    res.status(500).json({ ok: false, error: "Could not log this click." });
  }
});

const visitorSchema = new mongoose.Schema(
    {
        // 🌐 IP Info
        ip: { type: String, default: 'Unknown' },
        network: { type: String, default: 'Unknown' },
        version: { type: String, default: 'Unknown' }, // IPv4 or IPv6

        // 📍 Location Info
        city: { type: String, default: 'Unknown' },
        region: { type: String, default: 'Unknown' },
        region_code: { type: String, default: 'Unknown' },
        postal: { type: String, default: 'Unknown' },
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
        continent_code: { type: String, default: 'Unknown' },

        // 🏳️ Country Info
        country: { type: String, default: 'Unknown' },
        country_name: { type: String, default: 'Unknown' },
        country_code: { type: String, default: 'Unknown' },
        country_code_iso3: { type: String, default: 'Unknown' },
        country_capital: { type: String, default: 'Unknown' },
        country_tld: { type: String, default: 'Unknown' },
        country_calling_code: { type: String, default: 'Unknown' },
        country_area: { type: Number, default: null },
        country_population: { type: Number, default: null },
        in_eu: { type: Boolean, default: false },

        // 💰 Currency Info
        currency: { type: String, default: 'Unknown' },
        currency_name: { type: String, default: 'Unknown' },

        // 🌍 Language & Timezone
        languages: { type: String, default: 'Unknown' },
        timezone: { type: String, default: 'Unknown' },
        utc_offset: { type: String, default: 'Unknown' },

        // 🏢 ISP / Network Info
        isp: { type: String, default: 'Unknown' }, // org
        asn: { type: String, default: 'Unknown' },

        // 📅 Visit Time
        visitedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true, // Adds createdAt & updatedAt automatically
    }
);

const Visitor = mongoose.model("Visitor", visitorSchema);

//  CREATE THE API ROUTE FOR REACT TO CALL
app.set("trust proxy", true); // Required if hosting on Heroku/AWS/Render

app.get("/api/track-visitor", async (req, res) => {
  try {
    // A. Get Visitor's IP from the request
    let visitorIp =
      req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    // console.log("1. Raw Visitor IP detected by Express:", visitorIp);

    // Clean up IPv6 prefixes
    if (visitorIp && visitorIp.includes("::ffff:")) {
      visitorIp = visitorIp.replace("::ffff:", "");
    }

    // B. Fetch Location from IPAPI
    let apiUrl = `https://ipapi.co/${visitorIp}/json/`;

    // 🚨 NEW LOCALHOST FIX:
    // If testing on your laptop (localhost), we remove the IP from the URL.
    // Calling 'https://ipapi.co/json/' directly will automatically detect your home internet's REAL public IP!
    if (visitorIp === "::1" || visitorIp === "127.0.0.1" || !visitorIp) {
      apiUrl = "https://ipapi.co/json/";
      // console.log(
      //   "2. Localhost detected! Fetching your laptop's real public IP location...",
      // );
    }

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Node.js/Express-Server",
      },
    });

    const data = await response.json();

    // console.log("3. Raw Response from IPAPI:", data);

    // C. Check for errors
    if (data.error) {
      // console.log("❌ IPAPI Error Reason:", data.reason);
      return res
        .status(400)
        .json({ success: false, message: `API Error: ${data.reason}` });
    }

    // D. Print clean data to Server Terminal
    // console.log("🚀 Success! New Visitor Detected!");
    // console.log(
    //   `IP: ${data.ip} | Location: ${data.city}, ${data.country_name}`,
    // );

    // E. Save to MongoDB Atlas
    const newVisitor = new Visitor({
      ip: data.ip,
      network: data.network,
      version: data.version,
      city: data.city,
      region: data.region,
      region_code: data.region_code,
      country: data.country,
      country_name: data.country_name,
      country_code: data.country_code,
      country_code_iso3: data.country_code_iso3,
      country_capital: data.country_capital,
      country_tld: data.country_tld,
      continent_code: data.continent_code,
      in_eu: data.in_eu,
      postal: data.postal,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      utc_offset: data.utc_offset,
      country_calling_code: data.country_calling_code,
      currency: data.currency,
      currency_name: data.currency_name,
      languages: data.languages,
      country_area: data.country_area,
      country_population: data.country_population,
      asn: data.asn,
      org: data.org,
    });

    await newVisitor.save();
    // console.log("✅ Saved to MongoDB!");

    res
      .status(200)
      .json({ success: true, message: "Visitor tracked and saved!" });
  } catch (error) {
    console.error("❌ Server Error tracking visitor:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ---------------------------------------------------------------------
// Startup — connect to MongoDB Atlas first, then start listening.
// ---------------------------------------------------------------------
connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB, exiting:", err.message);
    process.exit(1);
  });