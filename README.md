# Tayyab Latif — DevOps & DevSecOps Portfolio

A single-page portfolio built with Next.js: animated hero, About section, project showcase with tech filters, a working contact form (email), and an AI chat widget.

## Tech stack & versions

| Tool | Version |
| --- | --- |
| Node.js | 20.9+ (developed on v24.18.0) |
| npm | 10+ (developed on 11.16.0) |
| pnpm (optional, preferred) | 9+ (lockfile: `pnpm-lock.yaml`) |
| Next.js | 16.3.3 (App Router) |
| React / React DOM | 19 |
| TypeScript | 5.7.3 |
| Tailwind CSS | 4.3.x |
| Other | lucide-react, sonner, nodemailer, @anthropic-ai/sdk |

> Check `node -v` and `npm -v` before starting.

## Getting started

```bash
# 1. Clone
git clone https://github.com/SyedDanyal190/Tayyab-Portfolio.git
cd Tayyab-Portfolio

# 2. Install dependencies (pick one)
pnpm install
# or
npm install

# 3. Create your environment file
cp .env.example .env.local      # Windows PowerShell: copy .env.example .env.local
# then fill in the values (see below)

# 4. Run the dev server
pnpm dev     # or: npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |

## Environment variables

Set these in `.env.local` (never commit this file — it is git-ignored).

| Variable | Required | Purpose |
| --- | --- | --- |
| `GMAIL_USER` | For contact form | Gmail address that sends the emails |
| `GMAIL_APP_PASSWORD` | For contact form | Gmail App Password (needs 2-Step Verification; create at <https://myaccount.google.com/apppasswords>) |
| `CONTACT_TO_EMAIL` | No | Where inquiries are delivered |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | No | Use another SMTP provider instead of Gmail |
| `OPENROUTER_API_KEY` | For chat widget | Key from <https://openrouter.ai/settings/keys> |
| `OPENROUTER_MODEL` | No | Override the chat model |
| `SITE_URL` | No | Site URL sent to OpenRouter (default `http://localhost:3000`) |

The site still runs without these; the contact form falls back to opening the visitor's email app, and chat is unavailable without a key.

## Project structure

```
app/
  page.tsx            Home, About, Projects, Contact sections
  layout.tsx          Root layout & metadata
  globals.css         All site styles and animations
  api/contact/        Contact form email endpoint
  api/chat/           AI chat endpoint
components/
  globe.tsx           Spinning dotted globe (canvas) with atom orbits
  atom-orbits.tsx     SVG atom rings with moving electrons
  type-text.tsx       Typing animation
  chat-widget.tsx     Chat UI
public/               Images (portrait, laptop, project screenshots)
```

## Editing content

- Projects, skills, and text: `app/page.tsx` (arrays at the top of the file).
- Images: replace files in `public/` (`profile-portrait.png`, `laptop.svg`, `projects/*`).
- Colours and animations: `app/globals.css` (`--accent` controls the theme colour).

### Reusing the globe

Copy `components/globe.tsx`, `components/atom-orbits.tsx`, and the `.globe*`, `.atom-*`, and `globe-roam-all` CSS. Wrap `<Globe />` in a `.globe-roam` div inside a `position: relative` section to make it drift around.

## Deployment

Deploy on [Vercel](https://vercel.com): import the GitHub repo, add the environment variables above, and deploy.
