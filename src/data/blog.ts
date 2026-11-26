import { BlogPost } from "@/types";

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "b1",
    slug: "fresher-resume-blueprint-beat-ats",
    title: "The Zero-Experience Fresher Resume Blueprint (ATS 90+ Score)",
    excerpt:
      "Most fresher resumes fail parsing before a human recruiter even sees them. Here is the verified single-column framework based on Google & Harvard recruiting standards.",
    category: "Resume Tips",
    readTime: "4 min read",
    date: "Nov 25, 2026",
    tags: ["Resume", "ATS", "Google X-Y-Z", "Freshers", "Template"],
    content: `### The Reality of Modern ATS Systems
Applicant Tracking Systems (like Workday, Greenhouse, Lever, and Taleo) do not use "magic AI" to reject resumes. They use **document parsers** that extract text line-by-line into structured recruiter profiles.

When a fresher uses a fancy Canva template with 2 columns, graphics, or tables:
- The parser reads horizontally across columns, mixing your project descriptions into your college details.
- Graphic skill bars (e.g. *"Python: 80%"*) are completely invisible to text scanners.
- The recruiter's dashboard shows a scrambled, unreadable profile with 0 matching skills.

---

### The 5 Non-Negotiable Rules of an ATS-Compliant Resume

#### 1. Strictly Single-Column Layout
Top-to-bottom sequential hierarchy only:
1. **Header:** Name, Phone, Email, LinkedIn, GitHub, Portfolio URL.
2. **Education:** Degree, College Name, Batch/Graduation Year (e.g. 2025/2026), CGPA.
3. **Technical Skills:** Categorized (Languages, Frameworks, Cloud/Databases, Developer Tools).
4. **Key Projects:** 2 to 3 deployed, substantial projects with live demos & GitHub repos.
5. **Experience / Internships:** If any, with quantifiable accomplishments.
6. **Certifications & Achievements:** LeetCode count, hackathons, academic honors.

#### 2. The Google X-Y-Z Bullet Phrasing Formula
Formulated by Laszlo Bock (former VP of People Operations at Google):
> **"Accomplished [X], as measured by [Y], by doing [Z]"**

- ❌ **Weak Fresher Bullet:** *"Built an e-commerce website using MERN stack with cart functionality."*
- ✅ **Google X-Y-Z Bullet:** *"Engineered a full-stack e-commerce store using Next.js & Stripe, reducing checkout load time by 38% through client-side state caching for 500+ simulated users."*

- ❌ **Weak Data Bullet:** *"Worked with SQL queries and Snowflake to generate reports."*
- ✅ **Google X-Y-Z Bullet:** *"Automated 15+ analytical SQL pipelines in Snowflake, reducing daily batch processing time from 3.5 hours to 22 minutes using clustering keys."*

#### 3. Standard System Typography & Safe Formats
- Fonts: Arial, Calibri, Helvetica, or Inter.
- Font sizing: Name 18–20pt Bold, Section Headings 12–14pt Bold UPPERCASE, Body Text 10–11pt Regular.
- Margins: 0.5 to 0.75 inches on all four sides.
- Export format: Standard text-based PDF (not scanned image or PNG export).

#### 4. Strictly 1 Page
Unless you have 5+ years of full-time engineering experience, any 2-page fresher resume signals poor prioritization and gets deprioritized by recruiters scanning in 6 seconds.

#### 5. Clickable Hyperlinks for Verification
Recruiters and engineers love verification. Every project listed should have a clickable **[GitHub]** repository and **[Live Demo]** link.`,
  },
  {
    id: "b2",
    slug: "linkedin-cold-dm-template-freshers",
    title: "Cold DM Framework That Gets 40%+ Response Rates from Tech Recruiters",
    excerpt:
      "Stop messaging 'Hi Sir, please give me job'. Use this concise, respectful 3-sentence outreach framework tailored for engineering managers and alumni.",
    category: "Cold Email",
    readTime: "3 min read",
    date: "Nov 23, 2026",
    tags: ["LinkedIn", "Cold Outreach", "Referrals", "Networking"],
    content: `### Why 95% of Fresher Cold Messages Get Ignored
Engineers and recruiters receive dozens of DMs every week saying:
- *"Hi sir, please refer me for any job."*
- *"I am looking for job, please review my attached 3-page PDF."*

These messages fail because they create **unnecessary work** for the recipient. The recipient does not know who you are, what role you want, or whether you meet the basic batch eligibility criteria.

---

### The 3-Sentence High-Conversion Cold Outreach Formula

#### Framework Structure:
1. **Sentence 1 (The Hook & Commonality):** Who you are + shared connection or admiration for their team.
2. **Sentence 2 (The Proof of Work & Exact Job ID):** Specific project matching their stack + the exact Job ID you applied for.
3. **Sentence 3 (The Low-Friction Ask):** A polite, 60-second request with zero obligation.

---

### Verified Template 1: For College Alumni at Target Companies
> **Subject / Note:** *Fellow [Your University] graduate • Quick question regarding [Company] SDE role*
>
> *"Hi [Alum Name],*
>
> *I hope you're having a productive week! I came across your profile and noticed you also graduated from [Your University/College] and are now working on [Team/Domain] at [Company].*
>
> *I’m a 2025/2026 graduate passionate about cloud systems and recently deployed a distributed pipeline using Python & Snowflake ([Live Link]). I’ve officially submitted my application for the SDE-1 opening (Job ID: #[XXXXX]).*
>
> *If you have 60 seconds, I’d be immensely grateful if you could consider my 1-page resume for an internal referral: [Google Drive Link with View Access]. Either way, thank you for your time and inspiring juniors like me!*
>
> *Warm regards,*  
> *[Your Name] • [LinkedIn / GitHub]"*

---

### Verified Template 2: For Technical Recruiters & Talent Acquisition
> *"Hi [Recruiter Name],*
>
> *Hope your week is going well! I saw [Company] is actively hiring freshers for the [Role Name] role (Job ID: #[XXXXX]).*
>
> *I meet all eligibility criteria (Batch 2025/2026, [Degree], 8.4 CGPA) and have built production-grade projects using [Key Tech 1] and [Key Tech 2].*
>
> *Here is my 1-page ATS-optimized resume: [Google Drive Link]. I’ve already submitted the official application and would love to be considered for the online assessment round.*
>
> *Thank you for your time and consideration!"*

---

### 3 Crucial Rules for Cold Outreach
1. **Never attach a heavy PDF directly in the chat:** Many corporate LinkedIn accounts block unsolicited attachments. Share a clean Google Drive link with "Anyone with the link can view" permission.
2. **Always include the exact Job ID:** Never ask a recruiter *"Is there any vacancy for me?"* Find the job on the company career portal first, apply, and provide the exact requisition number.
3. **Follow up once after 5 business days:** A gentle, polite follow-up (*"Just wanted to gently follow up in case this got buried in your inbox"*) converts an additional 20% of responses.`,
  },
  {
    id: "b3",
    slug: "top-technical-questions-fresher-drives",
    title: "Top 20 Core CS & DSA Questions Asked in 2025/2026 Off-Campus Drives",
    excerpt:
      "The exact questions asked repeatedly across product startups, Amazon, Google OA, TCS Prime, and off-campus technical rounds.",
    category: "Interview Prep",
    readTime: "5 min read",
    date: "Nov 20, 2026",
    tags: ["Interview", "DSA", "DBMS", "OS", "OOP", "SQL"],
    content: `### 1. Data Structures & Algorithms (Core Patterns)
Off-campus online assessments rarely test obscure algorithms. 85% of questions belong to these 5 standard patterns:
1. **Two Pointers & Sliding Window:** Maximum sum subarray of size K, Longest substring without repeating characters, 3Sum.
2. **Fast & Slow Pointers:** Detect cycle in a linked list, Find the middle node of a linked list.
3. **Monotonic Stack:** Next Greater Element, Daily Temperatures.
4. **BFS / DFS on Graphs & Trees:** Number of Islands, Binary Tree Level Order Traversal, Lowest Common Ancestor.
5. **Top K Elements (Heap):** Kth largest element in an array, Merge K sorted lists.

---

### 2. Object-Oriented Programming (OOP)
1. **4 Pillars with Production Code Examples:**
   - *Encapsulation:* Bundling data and methods into a single class with access modifiers (\`private\`, \`protected\`).
   - *Abstraction:* Hiding implementation details via Interfaces and Abstract Classes.
   - *Inheritance:* Code reusability (is-a relationship).
   - *Polymorphism:* Compile-time (Method Overloading) vs Runtime (Method Overriding using \`virtual\` functions).
2. **Pure Virtual Functions & Abstract Classes:** Why can't we instantiate an abstract class? What is the difference between an Interface and an Abstract Class?
3. **Diamond Problem in Multiple Inheritance:** How is it resolved in C++ (Virtual Inheritance) vs Java (Interfaces with default methods)?

---

### 3. Database Management Systems (DBMS) & SQL
1. **ACID Properties Explained:**
   - *Atomicity:* All or nothing (Bank transaction rollback).
   - *Consistency:* Database remains in a valid state before and after transaction.
   - *Isolation:* Concurrent transactions don't interfere (Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable).
   - *Durability:* Once committed, data persists even in power failure (Write-Ahead Logging).
2. **Normalization (1NF, 2NF, 3NF, BCNF):** Removing insertion, deletion, and update anomalies.
3. **SQL Queries Asked in 90% of Drives:**
   - Find the 2nd highest salary: \`SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;\` or using \`DENSE_RANK()\`.
   - Find duplicate records: \`SELECT email, COUNT(*) FROM Users GROUP BY email HAVING COUNT(*) > 1;\`
   - Difference between \`DELETE\` (DML, can rollback), \`TRUNCATE\` (DDL, fast, resets identity), and \`DROP\` (removes table completely).

---

### 4. Operating Systems & Computer Networks
1. **Process vs Thread:** Processes have separate virtual memory spaces; threads within the same process share heap, data, and code segments, but have independent stacks.
2. **What is a Deadlock?** What are the 4 Coffman conditions? (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait).
3. **What happens when you type \`https://google.com\` in browser?**
   - DNS Resolution (Browser cache → OS cache → Router → Recursive Resolver → Root → TLD → Authoritative).
   - TCP 3-Way Handshake (SYN → SYN-ACK → ACK).
   - TLS Handshake (Certificate verification & symmetric session key generation).
   - HTTP GET Request and Server Response (HTML/CSS/JS parsing & DOM rendering).
4. **TCP vs UDP:** TCP is connection-oriented, reliable, with flow & congestion control (used for HTTP, SSH). UDP is connectionless, fast, lightweight (used for DNS, live video streaming, multiplayer games).`,
  },
];
