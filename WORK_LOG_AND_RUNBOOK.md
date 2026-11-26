# snehal.fyi — Comprehensive Work Log & Troubleshooting Runbook

> **Last Updated:** November 27, 2026  
> **Repository:** [https://github.com/snehalreddy23/snehal.fyi](https://github.com/snehalreddy23/snehal.fyi)  
> **Live Production Site:** [https://snehal-fyi.vercel.app](https://snehal-fyi.vercel.app)  
> **Vercel Project Dashboard:** [https://vercel.com/snehalchirra-2957/snehal-fyi](https://vercel.com/snehalchirra-2957/snehal-fyi)  
> **Visitor Analytics:** [https://vercel.com/snehalchirra-2957/snehal-fyi/analytics](https://vercel.com/snehalchirra-2957/snehal-fyi/analytics)  
> **Admin Dashboard:** [https://snehal-fyi.vercel.app/admin](https://snehal-fyi.vercel.app/admin) (Default Passcode: `snehal2025`)

---

## 📑 Table of Contents
1. [Architecture & Tech Stack](#1-architecture--tech-stack)
2. [Master Work Log (Everything Built & Modified)](#2-master-work-log)
3. [All Official URLs & Handles](#3-all-official-urls--handles)
4. [Environment Variables Reference](#4-environment-variables-reference)
5. [How-To Operational Guides](#5-how-to-operational-guides)
   - [How to Add a Job](#how-to-add-a-job)
   - [How to Delete an Expired Job](#how-to-delete-an-expired-job)
   - [How to Change the Admin Passcode](#how-to-change-the-admin-passcode)
   - [How to View Visitor Analytics](#how-to-view-visitor-analytics)
6. [Troubleshooting & Emergency Fixes](#6-troubleshooting--emergency-fixes)
   - [Issue 1: Admin says "Failed to commit to GitHub"](#issue-1-admin-says-failed-to-commit-to-github)
   - [Issue 2: Vercel Build Fails on Redeploy](#issue-2-vercel-build-fails-on-redeploy)
   - [Issue 3: Analytics shows zero visits](#issue-3-analytics-shows-zero-visits)
   - [Issue 4: Vercel Free Bandwidth / Limit Warnings](#issue-4-vercel-free-bandwidth--limit-warnings)
   - [Issue 5: Local Development Server Won't Start](#issue-5-local-development-server-wont-start)

---

## 1. Architecture & Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 4 with custom Apple-minimalist dark aesthetics (`#000000` true black, `#161618` card surfaces, subtle borders `rgba(255,255,255,0.08)`)
- **Hosting & Edge CDN:** Vercel Global Edge Network
- **CMS & Database:** GitHub API directly reading and writing to `src/data/jobs.json` inside repository `snehalreddy23/snehal.fyi` (Zero database subscription cost, version-controlled)
- **Analytics:** Privacy-first Vercel Web Analytics (`@vercel/analytics/next`)
- **PDF Extraction:** Client-side Web Worker parsing with `pdfjs-dist`

---

## 2. Master Work Log

### A. Admin Dashboard (`/admin`) & GitHub API CMS
- Created `src/app/admin/page.tsx` with a biometric-styled passcode lock screen.
- Created `src/utils/githubJobs.ts` to communicate with the GitHub REST API (`GET` and `PUT` file contents).
- Created API endpoints:
  - `POST /api/admin/auth`: Passcode validation and GitHub configuration status check.
  - `GET /api/admin/jobs`: Fetches latest jobs directly from GitHub repo.
  - `POST /api/admin/jobs`: Validates new job fields, auto-generates numeric ID (`107`, `108`), creates clean slug, assigns color badge, inserts at index 0, and commits to GitHub repo.
  - `DELETE /api/admin/jobs?id=...`: Filters out the job and commits the removal directly to GitHub repo.
- Configured local dev fallback: If running locally without a GitHub token, it automatically writes directly to the local `src/data/jobs.json` file.

### B. Visitor Tracking & Vercel Web Analytics
- Installed `@vercel/analytics` package.
- Embedded `<Analytics />` from `@vercel/analytics/next` into `src/app/layout.tsx`.
- Linked the `/admin` dashboard directly to the live [Vercel Analytics Dashboard](https://vercel.com/snehalchirra-2957/snehal-fyi/analytics).
- Enabled real-time tracking of:
  - Unique visitors and total page views
  - Top visited jobs and blog posts
  - Traffic referrers (Telegram channel vs Instagram vs Google vs Direct)

### C. Standardized Telegram & Social Links
- Updated **all 10 Telegram touchpoints** across the entire project to point strictly to `https://t.me/snehal_fyi` with visible handle `@snehal_fyi`:
  1. `src/components/CommunityBanner.tsx`
  2. `src/components/Navbar.tsx` (Desktop badge)
  3. `src/components/Navbar.tsx` (Mobile dropdown)
  4. `src/app/page.tsx` (Social action buttons)
  5. `src/components/JobFeed.tsx` (Filter reset prompt)
  6. `src/app/jobs/[slug]/page.tsx` (Job detail alert banner & join button)
  7. `src/components/JobShareButtons.tsx` (Pre-filled Telegram share text)
  8. `src/app/blog/[slug]/page.tsx` (Article bottom CTA)
  9. `src/app/about/page.tsx` (Profile social link)
  10. `src/components/Footer.tsx` (Site footer)
- Preserved Instagram link strictly as `https://instagram.com/snehal.fyi` (`@snehal.fyi`).

### D. Resume ATS Checker (`/ats-checker`)
- **Clear & Reset Resume:** Added multi-location clear buttons (at top action bar, next to file input, and bottom of results) with `fileInputRef` state reset so users can test multiple resumes in one session.
- **God-Mode Bar-Raiser Prompt Directive:** Built an elite prompt copy engine for ChatGPT/Claude with:
  - 10+ banned AI buzzwords (*spearheaded, leveraged, orchestrated, crucial, testament*).
  - Google X-Y-Z formula enforcement (`Accomplished X as measured by Y by doing Z`).
  - Dual live interview defense talking points with mathematical justification.
- **Resume Tailoring CTA:** Added 1-click Google Form tailoring request modal for freshers who want 1-on-1 resume reviews.

### E. Blog & Playbook Redesign (`/blog` & `/blog/[slug]`)
- Purged outdated external tools and dead curated sheets.
- Re-architected blog posts into clean, modular data structures in `src/data/blog.ts`.
- Removed all raw markdown syntax (`###`, `---`, `**`) leaking into the UI.
- Built `src/components/BlogCallout.tsx` featuring 1-click clipboard copyable email and cold outreach templates with visual before/after contrast cards.

### F. About Page (`/about`)
- Removed "Founder" badge and replaced it with a friendly, approachable badge: `Feel free to connect`.

---

## 3. All Official URLs & Handles

| Destination | Official URL | Handle / Label |
| :--- | :--- | :--- |
| **Telegram Channel** | [https://t.me/snehal_fyi](https://t.me/snehal_fyi) | `@snehal_fyi` |
| **Instagram Page** | [https://instagram.com/snehal.fyi](https://instagram.com/snehal.fyi) | `@snehal.fyi` |
| **GitHub Repository** | [https://github.com/snehalreddy23/snehal.fyi](https://github.com/snehalreddy23/snehal.fyi) | `snehalreddy23/snehal.fyi` |
| **Vercel Dashboard** | [https://vercel.com/snehalchirra-2957/snehal-fyi](https://vercel.com/snehalchirra-2957/snehal-fyi) | `snehalchirra-2957` |
| **Vercel Analytics** | [https://vercel.com/snehalchirra-2957/snehal-fyi/analytics](https://vercel.com/snehalchirra-2957/snehal-fyi/analytics) | Live Web Analytics |
| **Admin Dashboard** | [https://snehal-fyi.vercel.app/admin](https://snehal-fyi.vercel.app/admin) | Secret Key: `ADMIN_PASSCODE` |

---

## 4. Environment Variables Reference

These are set in your [Vercel Project Settings → Environment Variables](https://vercel.com/snehalchirra-2957/snehal-fyi/settings/environment-variables) and in your local `.env.local`:

```env
# Admin Dashboard Security Passcode (Defaults to snehal2025 if omitted)
ADMIN_PASSCODE=snehal2025

# GitHub Personal Access Token (Classic with 'repo' scope)
# Used by the site to auto-commit job updates directly to your repo
GITHUB_TOKEN=ghp_your_personal_access_token_here

# GitHub Repository Information
GITHUB_OWNER=snehalreddy23
GITHUB_REPO=snehal.fyi
GITHUB_BRANCH=main
```

---

## 5. How-To Operational Guides

### How to Add a Job
1. Go to **[`https://snehal-fyi.vercel.app/admin`](https://snehal-fyi.vercel.app/admin)**.
2. Enter your passcode (`snehal2025`) and unlock.
3. Fill out:
   - **Company Name:** (e.g. *Atlassian*)
   - **Role Title:** (e.g. *Graduate Software Engineer*)
   - **Official Apply URL:** The direct career portal link.
   - **Salary / CTC:** (e.g. *₹18 - ₹24 LPA*)
   - **Location:** (e.g. *Bengaluru / Remote*)
   - **Category & Batch:** Select *Software*, click batch buttons (*2025*, *2026*).
   - **Snehal's Pro Tip:** Short tip for freshers applying.
4. Click **"Publish Job via GitHub API"**.
5. **Done!** GitHub will receive a new commit (`Add job: ...`), and Vercel will rebuild and publish the live page in ~25–30 seconds.

### How to Delete an Expired Job
1. Go to **[`https://snehal-fyi.vercel.app/admin`](https://snehal-fyi.vercel.app/admin)**.
2. In the right column, search for the company or role.
3. Click the red **Trash icon**.
4. Confirm deletion in the popup.
5. GitHub will commit the removal and Vercel will redeploy automatically.

### How to Change the Admin Passcode
1. Open [Vercel Environment Variables](https://vercel.com/snehalchirra-2957/snehal-fyi/settings/environment-variables).
2. Edit `ADMIN_PASSCODE` and enter your new password.
3. Save, then trigger a **Redeploy** on Vercel.

### How to View Visitor Analytics
1. Open [Vercel Analytics Dashboard](https://vercel.com/snehalchirra-2957/snehal-fyi/analytics).
2. View unique visitors, total page views, top viewed pages, countries, and referral traffic.

---

## 6. Troubleshooting & Emergency Fixes

### Issue 1: Admin says "Failed to commit to GitHub" or "GitHub GET failed: 401"
- **Cause:** Your GitHub Personal Access Token expired or was revoked.
- **Fix:**
  1. Open GitHub → Click your profile icon → **Settings** → **Developer Settings** → **Personal access tokens (classic)**.
  2. Click **Generate new token (classic)**.
  3. Name it `snehal-admin-token`, set expiration to `No expiration`, and check the **`repo`** box.
  4. Copy the new token (starts with `ghp_...`).
  5. Go to [Vercel Environment Variables](https://vercel.com/snehalchirra-2957/snehal-fyi/settings/environment-variables) → Update `GITHUB_TOKEN` → Save.
  6. Go to **Deployments** → Click the 3 dots on the latest deployment → **Redeploy**.

---

### Issue 2: Vercel Build Fails on Redeploy
- **How to debug locally:**
  Open terminal on your Mac in `/Users/snehalreddy/Desktop/snehal.fyi` and run:
  ```bash
  npm run build
  ```
  If there is a TypeScript typo in any job or file, the terminal will point out the exact file and line number.
- **Common culprit:** Special characters unescaped in text. Ensure apostrophes in JSX are written as `&apos;` or `{'\'}`.

---

### Issue 3: Analytics shows zero visits
- **Fix:**
  1. Ad-blockers: If you have Brave Shields, uBlock Origin, or AdBlock enabled on your browser, Vercel Analytics pings are blocked on your local machine. Test in an Incognito window or on your mobile phone without ad-blockers.
  2. Make sure Web Analytics is enabled: Open [https://vercel.com/snehalchirra-2957/snehal-fyi/analytics](https://vercel.com/snehalchirra-2957/snehal-fyi/analytics) and ensure the blue "Enable" button was clicked.

---

### Issue 4: Vercel Free Bandwidth / Limit Warnings
- **Did you know?** Vercel gives **100 GB** free data transfer per month. Currently, you have used **~11 MB (0.01%)**. That supports over **200,000+ monthly visits**.
- **What if your site goes massively viral (1,000,000+ views)?**
  You can connect **Cloudflare DNS (100% Free)**:
  1. Create a free account at [Cloudflare.com](https://cloudflare.com).
  2. Add your domain (`snehal.fyi`).
  3. Turn on the orange cloud (Proxy enabled).
  4. Cloudflare will cache 95%+ of all requests globally with **unlimited free bandwidth**, so you never exceed Vercel's limits or pay a single rupee.

---

### Issue 5: Local Development Server Won't Start
- If `npm run dev` or `npm run start` fails locally:
  ```bash
  # 1. Kill any stale node process using port 3000
  kill -9 $(lsof -ti:3000)

  # 2. Reinstall packages if needed
  npm install

  # 3. Start development server
  npm run dev
  ```
  Your site will be live at `http://localhost:3000`.

---

## 7. Quick Codebase Directory Map

```
snehal.fyi/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Homepage with jobs feed & playbook
│   │   ├── layout.tsx             # Root layout with Vercel Analytics (<Analytics />)
│   │   ├── admin/page.tsx         # Password-protected Admin Job Dashboard
│   │   ├── ats-checker/page.tsx   # Resume ATS scanner + God-mode ChatGPT prompt
│   │   ├── blog/page.tsx          # Clean Apple typography blog archive
│   │   ├── blog/[slug]/page.tsx   # Detailed career guides with 1-click templates
│   │   ├── jobs/[slug]/page.tsx   # Individual job detail page with application guide
│   │   ├── about/page.tsx         # Approachable Snehal profile & social links
│   │   └── api/admin/
│   │       ├── auth/route.ts      # Passcode verification endpoint
│   │       └── jobs/route.ts      # GitHub API commit endpoint (GET, POST, DELETE)
│   ├── components/
│   │   ├── CommunityBanner.tsx    # Top alert bar (pointing to @snehal_fyi)
│   │   ├── Navbar.tsx             # Top navigation with social links
│   │   ├── Footer.tsx             # Global footer
│   │   ├── JobFeed.tsx            # Filterable job cards grid
│   │   ├── JobCard.tsx            # Individual job summary card
│   │   ├── JobShareButtons.tsx    # 1-click WhatsApp & Telegram share buttons
│   │   └── BlogCallout.tsx        # Copyable template callout with clipboard action
│   ├── data/
│   │   ├── jobs.json              # Source of truth for all job listings
│   │   ├── jobs.ts                # TypeScript loader for jobs
│   │   └── blog.ts                # Structured blog post articles
│   ├── types/index.ts             # TypeScript interfaces (Job, BlogPost, ATSReport)
│   └── utils/
│       ├── atsScanner.ts          # Core ATS scoring and keyword analysis logic
│       └── githubJobs.ts          # GitHub REST API client for commits
├── .env.example                   # Environment variable template
├── .env.local                     # Local secrets (ignored by Git)
├── WORK_LOG_AND_RUNBOOK.md        # This master documentation and troubleshooting file
└── package.json                   # Dependencies (@vercel/analytics, pdfjs-dist, lucide-react)
```
