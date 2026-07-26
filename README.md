# For You — React + Node rebuild

Two projects, deployed separately:

- **`frontend/`** — the birthday site itself, rebuilt in React (Vite).
  All copy (About You timeline, wish tree wishes, story chapters, reasons,
  the private "Pandi" note, greeting/ending text) lives in `src/data/*.js`,
  not scattered across components — edit those files to change any wording
  without touching component code.
- **`backend/`** — a small always-on API that powers the "Send a Message
  Through Time" form: it schedules an email (via `node-cron` +
  `nodemailer`) to go out at a date/time you pick, even months or years
  from now, storing everything in MongoDB Atlas. It also logs lightweight
  click analytics (`{ button, timestamp }`) for a few key buttons.

## Quick start (local)

```bash
# backend
cd backend
cp .env.example .env    # fill in MONGODB_URI + SMTP credentials
npm install
npm run dev

# frontend, in a second terminal
cd frontend
cp .env.example .env    # point VITE_API_BASE_URL at the backend above
npm install
npm run dev
```

Open the frontend dev server URL (Vite will print it, typically
`http://localhost:5173`).

## Images

`frontend/public/images/guitar-sketch.png` and `her-photo.jpg` are the two
photos used in the "A little something I kept" image-reveal section —
already cropped and placed for you. Swap them for different files with the
same names if you want to change what's shown, no code changes needed.

## Deploying

- `backend/` → see `backend/README.md` (Render/Railway/Fly.io/VPS — needs
  to run 24/7, since scheduled sends can be months out).
- `frontend/` → `npm run build` inside `frontend/`, then deploy the
  generated `dist/` folder to any static host (Vercel, Netlify, GitHub
  Pages...). Set `VITE_API_BASE_URL` to your deployed backend's URL
  *before* running the build — Vite bakes env vars in at build time.
- Enable CORS on the backend (`CORS_ORIGIN` in its `.env`) for whatever
  domain the frontend ends up on.
