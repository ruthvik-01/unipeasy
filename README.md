# UniPeasy

A learning app for JNTUK students. Simple explanations, study plans, and skill building — all in one place.

## Features

**Learn** — Enter any topic, get a simple explanation with analogies and a quick quiz.

**Strategist** — Paste your syllabus and exam date. Get a study schedule that fits your pace.

**Skills** — Pick a skill (coding, ML, soft skills). Work through levels. Get feedback.

**Materials** — Notes organized by branch, year, and subject.

**Memory Palace** — Save explanations and mind maps for later.

## Tech

- Next.js 15 + React
- Firebase (auth + database)
- Google Gemini AI
- Tailwind CSS

## Setup

```bash
npm install
```

Add `.env.local`:

```
NEXT_PUBLIC_ADMIN_PASSWORD=xxx
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
GOOGLE_GENAI_API_KEY=xxx
```

Run:

```bash
npm run dev
```

Opens at `localhost:9002`

## Admin

Go to `/admin` — manage users, materials, and view analytics. Password protected.

## Structure

```
src/
  app/        → pages
  components/ → UI
  ai/         → AI logic
  lib/        → utilities
  context/    → state
```

## License

MIT
