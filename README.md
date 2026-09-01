# CloudSwift — Full-Stack Lead Automation

Azure Expert MSP website + WhatsApp lead qualification automation + Admin panel.

---

## Project Structure

```
Cloudswift/
├── backend/                  Express API + WhatsApp automation
│   ├── models/               MongoDB schemas
│   ├── routes/               API route handlers
│   ├── services/             Chatbot engine, Meta API, Cloudinary, scoring
│   ├── middleware/           Admin auth
│   ├── server.js             Entry point
│   └── .env                  ← fill this in before running
│
├── frontend/                 React + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── admin/        Admin panel pages
│   │   │   └── HomePage.jsx  Public CloudSwift website
│   │   ├── App.jsx           Routes: / and /admin/*
│   │   ├── main.jsx
│   │   └── config.js
│   └── .env                  ← set API URL here
```

---

## Quick Start

### 1. Fill in credentials

**`backend/.env`** — replace every `REPLACE_WITH_*` value:

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | MongoDB Atlas → Connect → Drivers |
| `WA_TOKEN` | Meta Business → WhatsApp → API Setup |
| `WA_PHONE_NUMBER_ID` | Meta Business → WhatsApp → API Setup |
| `WA_WABA_ID` | Meta Business → WhatsApp → API Setup |
| `WA_APP_SECRET` | Meta App → Settings → Basic |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard |
| `SALES_REP_WA_NUMBER` | Sales rep's number with country code, e.g. `919XXXXXXXXX` |

---

### 2. Run the backend

```bash
cd backend
npm install        # already done
npm run dev        # node --watch server.js  (port 5000)
```

Verify it's running:
```
GET http://localhost:5000/api/health
```

---

### 3. Run the frontend

```bash
cd frontend
npm install        # already done
npm run dev        # vite dev server  (port 5173)
```

- Public site: `http://localhost:5173`
- Admin panel: `http://localhost:5173/admin`
- Default login: `admin` / `admin` (change in `backend/.env`)

---

### 4. Register the WhatsApp webhook with Meta

Once the backend is deployed to a public URL:

1. Go to **Meta Business → WhatsApp → Configuration**
2. Set **Callback URL**: `https://yourdomain.com/api/whatsapp/webhook`
3. Set **Verify Token**: `cloudswift_whatsapp_verify_2026` (or whatever you set in `.env`)
4. Subscribe to **messages** field
5. Click **Verify and Save**

---

### 5. Admin panel first-time setup

After logging in at `/admin`:

1. **Settings** — set `salesRepWaNumber`, `calendlyLink`, `salesRepName`
2. **Flow Images** — upload all brand images and PDFs (Cloudinary CDN)
3. **Templates** — review default templates, activate as needed
4. Test the full flow by messaging your WhatsApp number

---

## API Endpoints

| Route | Method | Description |
|---|---|---|
| `/api/health` | GET | Server + connection status |
| `/api/whatsapp/webhook` | GET | Meta webhook verification |
| `/api/whatsapp/webhook` | POST | Incoming messages |
| `/api/leads` | GET | List leads (admin auth) |
| `/api/leads/stats` | GET | Dashboard counts |
| `/api/leads/:id` | PATCH | Update lead |
| `/api/leads/:id/post-call` | POST | Trigger post-call WA message |
| `/api/leads/:id/send-message` | POST | Send manual WA message |
| `/api/crm/conversations` | GET | CRM conversation list |
| `/api/crm/conversations/:phone/messages` | GET | Chat history |
| `/api/crm/conversations/:phone/send` | POST | Send WA from admin |
| `/api/assets` | GET/POST | Flow images (Cloudinary) |
| `/api/assets/:key` | DELETE | Remove asset |
| `/api/settings` | GET/PUT | System settings |
| `/api/admin/login` | POST | Admin login |
| `/api/admin/stats` | GET | Dashboard stats |
| `/api/admin/templates` | GET/POST/PUT/DELETE | WA templates CRUD |

---

## WhatsApp Flow Summary

```
New message arrives
      ↓
Flow 1 — auto-reply in 90s, 5-option list menu (topic selection)
      ↓
Flow 2 — Q1: company size  →  Q2: situation  →  Q3: timeline
      ↓
Lead Scoring Engine
      ↓
   HOT  →  Sales rep brief (2 min) + Calendly link to prospect
  WARM  →  Confirm message + nurture Day 3 / 7 / 21
  COLD  →  Exit message + referral ask
```

---

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Node.js 18+, Express, ESM |
| Database | MongoDB Atlas via Mongoose |
| WhatsApp | Meta Cloud API (direct, no BSP) |
| File storage | Cloudinary |
| Real-time | Socket.IO |
| Nurture scheduler | node-cron (every 30 min) |
| Frontend | React 18, Vite, React Router v6 |
| Admin UI | Pure inline CSS (no framework) |

---

## Notes

- **Never** use the primary domain for cold email. Use a subdomain (`mail.oncloudswift.com`).
- Meta WA templates must be pre-approved before outbound messages work on session-expired contacts.
- The nurture scheduler fires every 30 minutes — leads are not notified more than once per step.
- Cloudinary images are served via CDN and auto-optimised.
- Socket.IO connects admin clients to the `admin` room — all `new_lead` and `lead_update` events are live.
