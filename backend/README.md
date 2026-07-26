# Backend — scheduled message API

A tiny Express API with a `node-cron` scheduler and a `nodemailer` sender,
used by the frontend's "Send a Message Through Time" form. It stores
scheduled messages in **MongoDB Atlas** (via Mongoose) and checks every
minute for anything due to send. It also logs a small amount of ordinary
interaction analytics — which of a few key buttons got clicked, and when —
to its own MongoDB collection.

## Why this needs a real host

A browser tab can't hold a scheduled job open for weeks, months, or years —
it has to live server-side, and the process needs to be **running 24/7**
for the cron check to ever fire. This is true no matter what the frontend
looks like. Don't run this on something that sleeps/spins down for long
periods unless you're okay with delayed sends on wake.

## MongoDB Atlas setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. **Database Access** → add a database user (username/password).
3. **Network Access** → allow the IP(s) this backend will run from (or
   `0.0.0.0/0` for simplicity on a personal project).
4. **Database > Connect > Drivers** → copy the connection string, drop it
   into `MONGODB_URI` in `.env`, and add a database name to the path (e.g.
   `.../for-you?retryWrites=true&w=majority`).

Two collections are created automatically the first time each is written
to — no manual schema setup needed:
- `messages` — scheduled messages (replaces the old `jobs.json` file)
- `buttonclicks` — `{ button, timestamp }` for each tracked button click

## Local development

```bash
cd backend
cp .env.example .env      # fill in MONGODB_URI + SMTP credentials
npm install
npm run dev                # or: npm start
```

Health check: `GET http://localhost:4000/api/health`

## Environment variables

| Variable       | Description                                             |
|----------------|----------------------------------------------------------|
| `MONGODB_URI`  | MongoDB Atlas connection string (see setup above)         |
| `SMTP_HOST`    | Your SMTP provider's host (e.g. Gmail, SendGrid, Mailgun) |
| `SMTP_PORT`    | Usually `587` (TLS) or `465` (SSL)                        |
| `SMTP_USER`    | SMTP username                                             |
| `SMTP_PASS`    | SMTP password / app password / API key                    |
| `FROM_ADDRESS` | The address emails are actually sent from (SMTP providers won't let you send arbitrary "from" addresses — the form's "from" field is used as `Reply-To` instead) |
| `PORT`         | Port to listen on (defaults to `4000`)                    |
| `CORS_ORIGIN`  | Comma-separated list of allowed origins. Leave blank to allow all. |

## Deploying

Any host that keeps a Node process alive continuously works. A few options:

### Render / Railway / Fly.io (easiest)
1. Push this `backend/` folder to a Git repo (or the whole project — just
   set the service's root directory to `backend/`).
2. Create a new **Web Service** pointing at that repo/directory.
3. Build command: `npm install`. Start command: `npm start`.
4. Add the environment variables above in the host's dashboard.
5. Deploy. Note the public URL — you'll set this as `VITE_API_BASE_URL`
   when building the frontend.

### Plain VPS
1. Install Node 18+.
2. `git clone` the repo, `cd backend`, `npm install`.
3. Copy `.env.example` to `.env` and fill it in.
4. Run it under a process manager so it survives reboots/crashes, e.g.:
   ```bash
   npm install -g pm2
   pm2 start server.js --name birthday-backend
   pm2 save
   pm2 startup
   ```
5. Put it behind a reverse proxy (nginx/Caddy) with HTTPS if it's
   internet-facing.

## API

```
POST /api/schedule
  body: { fromEmail, toEmail, message, sendAt }
  → 200 { ok: true, id }
  → 400 { ok: false, error }

POST /api/analytics/click
  body: { button }        // e.g. "open_heart", "read_story", "open_pandi_heart"
  → 200 { ok: true }        // stores { button, timestamp } in the buttonclicks collection
  → 400 { ok: false, error }

GET  /api/health
  → 200 { ok: true, time }
```

## Notes / limitations

- Failed sends are retried on the next minute's cron tick indefinitely
  (the job just stays `sent: false`); check server logs or the `messages`
  collection's `lastError` field if something isn't going out.
- No authentication on `/api/schedule` or `/api/analytics/click` — anyone
  with the URL can queue a message or log a click. Fine for a private link
  between two people; add auth if that changes.
- Analytics is intentionally minimal — just which button, and when. There's
  no dashboard/GET endpoint for it here; query the `buttonclicks` collection
  directly in Atlas (or add a `GET /api/analytics/clicks` route) if you want
  to see the numbers later.
