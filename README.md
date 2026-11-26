# snehal.fyi 🚀

The official website for **[@snehal.fyi](https://instagram.com/snehal.fyi)** — a high-performance, mobile-first Job Board & Resume Playbook for freshers and entry-level job seekers (2024, 2025, & 2026 batches).

---

## ⚡ Key Features

- **100% Free Hosting on Vercel:** Zero monthly cost, instant global CDN, automatic SSL.
- **Instagram / ManyChat Shortlinks:**
  - `snehal.fyi/j/101` automatically redirects to the exact job page (`/jobs/google-associate-cloud-engineer-2025`).
  - Perfect for ManyChat auto-DMs!
- **Mobile-First Design:** Optimized for users opening links directly inside the Instagram in-app browser.
  - Sticky "Apply Now" button on mobile.
  - 1-tap WhatsApp & Telegram sharing with pre-formatted message text.
- **Search & Multi-Filter:** Instant client-side search by company, role, skill, and batch pills (2024, 2025, 2026).
- **Resume & Interview Playbook:** Dedicated blog section with ATS-beating resume blueprint, LinkedIn cold messaging scripts, and core technical questions.

---

## 📁 Project Structure

```
snehal.fyi/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Homepage (Hero, Search/Filter Feed, ManyChat banner, FAQ)
│   │   ├── jobs/[slug]/page.tsx   # Detailed Job Page with Snehal's Insider Tips & WhatsApp share
│   │   ├── j/[id]/page.tsx        # Fast Shortlink Route for ManyChat (e.g. /j/101)
│   │   ├── blog/page.tsx          # Resume Tips & Career Guides archive
│   │   ├── blog/[slug]/page.tsx   # Full article page
│   │   ├── about/page.tsx         # Brand story & anti-scam philosophy
│   │   └── layout.tsx             # Root layout with mobile banners
│   ├── components/                # Reusable UI components
│   ├── data/
│   │   ├── jobs.ts                # ⭐️ ADD NEW JOBS HERE IN 30 SECONDS
│   │   └── blog.ts                # Add new resume/interview guides here
│   └── types/index.ts             # TypeScript interfaces for Job & BlogPost
```

---

## 📝 How to Add a New Job in 30 Seconds

Open [`src/data/jobs.ts`](file:///Users/snehalreddy/Desktop/snehal.fyi/src/data/jobs.ts) and add a new object to `JOBS_DATA`:

```ts
{
  id: "107", // The 3-digit code for your Reel & ManyChat!
  slug: "microsoft-software-engineer-2025",
  company: "Microsoft",
  role: "Software Engineer (Fresher)",
  category: "Software",
  badge: "Hot",
  logoBg: "bg-blue-700",
  location: "Hyderabad / Bengaluru",
  jobType: "Full-Time",
  batch: ["2024", "2025", "2026"],
  salary: "₹16 - ₹20 LPA",
  experience: "Freshers Eligible",
  postedDate: "Today",
  deadline: "Apply ASAP",
  applyUrl: "https://careers.microsoft.com/...", // Official link
  eligibility: [
    "B.Tech / B.E in CS/IT/ECE",
    "Batch 2024, 2025, 2026",
    "No active backlogs",
  ],
  description: "...",
  responsibilities: ["..."],
  requirements: ["..."],
  selectionProcess: ["Online Test", "Technical Rounds", "HR"],
  snehalTips: "Focus on binary trees and dynamic programming in Round 1.",
  featured: true,
  tags: ["Microsoft", "SDE", "Fresher"],
}
```

Push your commit to GitHub, and Vercel will rebuild the site in ~30 seconds automatically!

---

## 🚀 How to Deploy on Vercel for Free ($0)

1. **Initialize Git & Push to GitHub:**
   ```bash
   git add .
   git commit -m "Launch snehal.fyi job board"
   # Create a repo on github.com called 'snehal.fyi'
   git remote add origin https://github.com/YOUR_USERNAME/snehal.fyi.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub.
   - Click **"Add New Project"** and select `snehal.fyi`.
   - Keep default settings and click **Deploy**.
   - Your site is now live at `snehal-fyi.vercel.app` (or whatever free name you choose)!

---

## 🤖 ManyChat Automation Setup Guide

1. Sign up for free on [ManyChat](https://manychat.com) and link your `@snehal.fyi` Instagram account.
2. Go to **Automations → New Automation → Instagram**:
   - **Trigger:** *User comments on a post or Reel*.
   - Set condition: *Comment contains words: `APPLY`, `LINK`, `JOB`, or specific Job IDs like `101`, `102`*.
3. **Action 1 (Public Comment Reply):**
   - *"Sent the direct link to your DMs! 🚀 Check your message requests if you can't find it."*
   - *(This drives high comment engagement and signals Instagram's algorithm to push the Reel to Explore!)*
4. **Action 2 (Automated DM):**
   - *"Hey there! 👋 Here is your direct link to apply for the [Company] opening: https://snehal-fyi.vercel.app/j/101"*
   - *"Make sure to tailor your resume before submitting. Good luck! — Snehal"*

---

## 📈 Faceless-to-10k Instagram Strategy

1. **The 3-Second Hook:** First frame of every Reel must state:
   - *"Google is hiring freshers (2024/2025/2026 batches) with zero experience. Comment 101 for link."*
2. **Visuals:** High-aesthetic b-roll (coding on dark mode, coffee, rainy aesthetic, clean typing visuals).
3. **Audio:** Trending lo-fi or calm beats.
4. **Transition to Face Brand:** At 10,000 followers, start by doing voiceovers, then casual Q&A stories, followed by direct talking-head career advice reels.
