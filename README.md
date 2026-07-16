# AI Interview Prep

An AI-powered interview preparation tool. Upload your resume, add a short self-description and the job description you're targeting, and it generates a full interview report — match score, likely technical & behavioral questions (with what the interviewer is really checking for, and how to answer), your skill gaps, and a day-wise prep plan. You can also generate a tailored resume PDF from the same data.

Built as a MERN app with Google Gemini doing the heavy lifting on the AI side.

## Features

- **Email/password auth** — signup with OTP email verification before login is allowed
- **Advanced session-based authentication** — a proper session system instead of just "one JWT and done":
  - Every login creates a `Session` document in MongoDB, storing a SHA-256 hash of the refresh token along with the device's IP address and user agent
  - Short-lived access token (15 min) + long-lived refresh token (7 days), issued together at login
  - **Refresh token rotation** — every time `/refresh-token` is hit, the old refresh token is invalidated and a brand new one is issued and re-hashed into the session, so a leaked/old token can't be reused
  - Refresh tokens are never stored in plain text — only their SHA-256 hash is kept, and lookups happen against that hash
  - **Multi-device session tracking** — `/all-sessions` lists every active session for the account with IP + device info and flags which one is the current session
  - **Per-session revocation** — kill access from one specific device (`/revoke-session/:sessionId`) without logging out everywhere else
  - **Global logout** — `/logout-all` revokes every session for the account in one go
  - Refresh token is delivered as an `httpOnly`, `secure`, `sameSite: strict` cookie — never exposed to JS on the frontend
- **Resume upload & parsing** — PDF resume text is extracted server-side and fed into the AI prompt
- **AI interview report generation** — structured JSON output (via a defined schema, validated with Zod) covering:
  - Match score against the job description
  - Technical questions with intention + suggested answers
  - Behavioral questions with intention + suggested answers
  - Skill gaps with severity
  - A day-by-day preparation plan
- **AI-tailored resume PDF export** — generates a styled, ATS-friendly one/two-page resume as HTML and renders it to PDF with Puppeteer
- **Past reports list** — view all previously generated interview reports for your account

## Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Google GenAI SDK (Gemini) for report + resume generation
- JWT (`jsonwebtoken`) + bcrypt for auth
- Zod for request & AI-output validation
- Multer for resume file uploads
- `pdf-parse` for reading resume PDFs
- Puppeteer for HTML → PDF resume export
- Nodemailer (Gmail OAuth2) for OTP emails

**Frontend**
- React 19 + React Router v7
- Tailwind CSS v4
- Axios
- react-hot-toast for notifications

## Project Structure

```
Backend/
  server.js
  src/
    app.js
    controller/       # auth.controller.js, interview.controller.js
    routes/            # auth.routes.js, interview.routes.js
    models/             # user, session, otp, interviewReport, resume
    middlewares/        # auth, file upload, zod validation
    services/           # ai.services.js (Gemini + Puppeteer), email.js
    validations/         # zod schemas
    utils/                # config, otp/email helpers
    db/

Frontend/
  src/
    App.jsx
    components/Navbar.jsx
    features/
      auth/       # context, hook, api service, pages (Login, Register, OTP, Settings)
      interview/  # context, hook, api service, pages (Home, Interview)
```

## API Overview

**Auth** — `/api/auth`
| Method | Route | Description |
|---|---|---|
| POST | `/register` | Create account, sends OTP |
| POST | `/verify-email` | Verify OTP |
| POST | `/resend-otp` | Resend OTP |
| POST | `/login` | Login, issues access token + sets refresh cookie |
| POST | `/refresh-token` | Rotates refresh token, issues new access token |
| GET | `/logout` | Revoke current session |
| GET | `/logout-all` | Revoke all sessions |
| GET | `/getMe` | Get logged-in user |
| GET | `/all-sessions` | List active sessions |
| POST | `/revoke-session/:sessionId` | Revoke a specific session |

**Interview** — `/api/ai`
| Method | Route | Description |
|---|---|---|
| POST | `/` | Upload resume + generate interview report |
| GET | `/` | List all reports for the user |
| GET | `/report/:interviewId` | Get a specific report |
| POST | `/report/pdf/:interviewReportId` | Generate & download tailored resume PDF |

## Running Locally

**Backend**
```bash
cd Backend
npm install
```

Create a `.env` in `Backend/`:
```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_ACCESS_TOKEN=
GOOGLE_USER=

GOOGLE_API_KEY=your_gemini_api_key
```

```bash
npm run dev
```

**Frontend**
```bash
cd Frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`, talking to the backend on `http://localhost:3000`.
