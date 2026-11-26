import { BlogPost } from "@/types";

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "b1",
    slug: "fresher-resume-blueprint-beat-ats",
    title: "The Zero-Experience Fresher Resume Blueprint (ATS 90+ Score)",
    excerpt:
      "Most fresher resumes get filtered out within 6 seconds. Here is the single-column template format that passes ATS filters with 100% certainty.",
    category: "Resume Tips",
    readTime: "4 min read",
    date: "Nov 25, 2026",
    tags: ["Resume", "ATS", "Freshers", "Template"],
    content: `
### Why Most Fresher Resumes Get Rejected
Most students use fancy Canva templates with 2 columns, skill progress bars (e.g., "Java: 80%"), and profile photos. 

**Here is the harsh reality:**
Applicant Tracking Systems (ATS) used by Google, Amazon, TCS, and Infosys cannot parse two-column layouts properly. They read across lines, mixing your project descriptions with your education details!

---

### The 5 Golden Rules of an ATS-Friendly Resume:
1. **Single-Column Layout Only:** Use clean, sequential top-to-bottom hierarchy (Header → Education → Skills → Projects → Certifications).
2. **Never Use Progress Bars or Star Ratings:** An ATS searches for keywords like \`React.js\`, \`SQL\`, \`Data Structures\`. It cannot read an 80% circle graphic.
3. **Use the 'XYZ' Bullet Formula:**
   - ❌ Bad: *"Made an e-commerce website using MERN stack."*
   - ✅ Good: *"Engineered a full-stack e-commerce store using Next.js & Stripe, cutting checkout load time by 38% for 500+ simulated users."*
4. **Hyperlink Live Demos & GitHub:** Always provide clickable links to live hosted projects and GitHub code.
5. **Keep It Strictly to 1 Page:** Unless you have 5+ years of industry experience, a 2-page resume is an automatic red flag for recruiters.

---

### Recommended Free Fonts & Sizes:
- **Font:** Inter, Arial, Calibri, or Roboto
- **Name:** 18–20pt Bold
- **Section Headers:** 12–14pt Bold UPPERCASE
- **Body Text:** 10–11pt Regular
`,
  },
  {
    id: "b2",
    slug: "linkedin-cold-dm-template-freshers",
    title: "Cold DM Template That Got Freshers 10+ Interview Calls on LinkedIn",
    excerpt:
      "Stop messaging 'Hi Sir, please give me a job'. Use this polite, high-converting cold outreach framework to reach recruiters and engineering managers.",
    category: "Cold Email",
    readTime: "3 min read",
    date: "Nov 23, 2026",
    tags: ["LinkedIn", "Cold DM", "Referral", "Networking"],
    content: `
### What NOT to Send in LinkedIn DMs:
- ❌ *"Hi sir, please check my resume and give job."*
- ❌ Sending your PDF resume without asking.
- ❌ Copy-pasting long 500-word essays that nobody has time to read.

---

### The 3-Step Cold Message Formula

#### Template 1: For Reaching Engineering Managers (High Conversion)
> *"Hi [Name],*
>
> *I saw your post regarding the open [Role Name] at [Company]. I'm a 2025/2026 CS graduate passionate about [Specific Tech e.g., Next.js & Cloud].*
>
> *Recently, I built a [Project Name: live-demo-link] solving [X Problem], utilizing [Tech Stack].*
>
> *I've submitted my application through Job ID #[XXXX]. If you have 2 minutes, I’d love to know what your team looks for in junior engineers. Thank you for your time!*
>
> *Best regards,*
> *[Your Name] | [Portfolio Link]"*

---

#### Template 2: For Reaching HR / Technical Recruiters
> *"Hi [Name],*
>
> *Hope you’re having a great week! I noticed you are hiring for the [Role Name] position at [Company].*
>
> *I meet the required batch criteria (2024/2025/2026) and have hands-on experience in [Key Skill 1] and [Key Skill 2]. Here is my 1-page resume link: [Google Drive Link].*
>
> *I’d be deeply grateful if you could consider my profile for the screening round. Thank you!"*
`,
  },
  {
    id: "b3",
    slug: "top-technical-questions-fresher-drives",
    title: "Top 20 Core CS & DSA Questions Asked in 2025/2026 Off-Campus Drives",
    excerpt:
      "The exact questions asked repeatedly across TCS Prime, Accenture, Capgemini, Cognizant, and product startups.",
    category: "Interview Prep",
    readTime: "6 min read",
    date: "Nov 20, 2026",
    tags: ["Interview", "DSA", "DBMS", "OS", "OOP"],
    content: `
### 1. Object-Oriented Programming (OOP)
- Explain the 4 pillars with real-world analogies (Encapsulation vs Abstraction).
- What is the difference between Method Overloading (Compile-time) and Method Overriding (Run-time)?
- What are pure virtual functions and abstract classes?

---

### 2. Database Management Systems (DBMS) & SQL
- What is Normalization? Explain 1NF, 2NF, 3NF, and BCNF with table examples.
- Explain ACID properties with a bank transaction scenario.
- Difference between \`DELETE\`, \`TRUNCATE\`, and \`DROP\`.
- Write a query to find the 2nd highest salary using \`DENSE_RANK()\` or \`LIMIT\`.

---

### 3. Operating Systems & Computer Networks
- Process vs Thread: Differences and memory sharing.
- What is Deadlock? What are the 4 Coffman conditions required for a deadlock?
- What happens under the hood when you type \`https://google.com\` in your browser?
- TCP vs UDP: Key differences and real-time use cases.
`,
  },
];
