import { BlogPost } from "@/types";

export interface BlogSection {
  heading?: string;
  subheading?: string;
  paragraphs?: string[];
  bullets?: string[];
  comparison?: {
    badLabel: string;
    badText: string;
    goodLabel: string;
    goodText: string;
  }[];
  callout?: {
    title: string;
    text: string;
  };
  codeBlock?: {
    language: string;
    code: string;
  };
}

export interface DetailedBlogPost extends BlogPost {
  sections: BlogSection[];
}

export const DETAILED_BLOG_POSTS: DetailedBlogPost[] = [
  {
    id: "b1",
    slug: "fresher-resume-blueprint-beat-ats",
    title: "The Zero-Experience Fresher Resume Blueprint (ATS 90+ Score)",
    excerpt:
      "Most fresher resumes fail parsing before a human recruiter even sees them. Here is the verified single-column framework based on Google and Tier-1 tech recruiting standards.",
    category: "Resume Tips",
    readTime: "5 min read",
    date: "Nov 25, 2026",
    tags: ["Resume", "ATS", "Google X-Y-Z", "Freshers", "Engineering"],
    content: "",
    sections: [
      {
        heading: "How Modern ATS Parsers Actually Work",
        paragraphs: [
          "A common misconception among college students is that Applicant Tracking Systems (ATS) like Workday, Greenhouse, Taleo, and Lever use artificial intelligence to automatically reject candidates.",
          "In reality, ATS software uses deterministic document parsers. These parsers scan the document line-by-line from top to bottom, stripping styling and converting text into structured database fields: Name, Contact Information, Degree, Graduation Year, Skills, and Work Experience.",
          "When candidates use two-column layouts, graphics, tables, or progress bars, the text extraction engine reads horizontally across column dividers. This scrambles your project descriptions with your education details, creating an unreadable profile on the recruiter's screen."
        ],
        callout: {
          title: "Key Recruiter Fact",
          text: "Recruiters spend an average of 6 to 8 seconds on initial resume triage. If your contact details or project impact are not parseable in the standard single-column format, your application is deprioritized automatically."
        }
      },
      {
        heading: "The 6 Essential Sections in Sequential Order",
        paragraphs: [
          "To achieve maximum text parsing accuracy across enterprise ATS platforms, arrange your resume in this clean top-to-bottom hierarchy:"
        ],
        bullets: [
          "1. Header: Full Name, Professional Email, Phone Number, City, LinkedIn URL, GitHub URL, and Portfolio Link.",
          "2. Education: Degree Name, Major, University/College, Batch and Graduation Year (e.g. 2025, 2026), and CGPA.",
          "3. Technical Skills: Grouped into Languages (Python, Java, C++, TypeScript), Frameworks (React, Next.js, Spring Boot), Cloud & Databases (Snowflake, AWS, SQL, Docker), and Core Fundamentals (DSA, DBMS, OS, OOP).",
          "4. Key Projects: 2 to 3 substantial, deployed projects featuring live links, GitHub source repositories, and quantifiable impact.",
          "5. Experience / Internships: Full-time or virtual engineering internships highlighting ownership and measurable team impact.",
          "6. Certifications & Achievements: Competitive programming milestones (LeetCode problem count, hackathons, academic honors)."
        ]
      },
      {
        heading: "Google X-Y-Z Formula for Resume Bullet Points",
        paragraphs: [
          "Pioneered by Google's former Senior Vice President of People Operations, Laszlo Bock, the X-Y-Z formula is the undisputed standard for engineering bullets:",
          "Formula: Accomplished [X], as measured by [Y], by doing [Z]."
        ],
        comparison: [
          {
            badLabel: "Weak Fresher Bullet (Unquantified)",
            badText: "Built an e-commerce website using MERN stack with authentication and payment cart.",
            goodLabel: "Google X-Y-Z Bullet (Quantified & Defendable)",
            goodText: "Engineered full-stack e-commerce application using Next.js and Stripe, reducing checkout latency by 38% for 500+ simulated users through client-side state memoization."
          },
          {
            badLabel: "Weak Data Engineering Bullet",
            badText: "Worked on SQL queries and Snowflake to generate reports for the team.",
            goodLabel: "Google X-Y-Z Bullet",
            goodText: "Automated 15 analytical SQL data pipelines in Snowflake, reducing daily batch runtimes from 3.5 hours to 22 minutes using clustering keys and partition pruning."
          },
          {
            badLabel: "Weak Cloud / DevOps Bullet",
            badText: "Deployed microservices on AWS and used Docker containers.",
            goodLabel: "Google X-Y-Z Bullet",
            goodText: "Containerized 4 backend microservices using Docker, establishing automated CI/CD deployment pipelines on AWS that decreased production deployment cycle times by 65%."
          }
        ]
      },
      {
        heading: "Formatting and Typographic Guardrails",
        paragraphs: [
          "Follow these clean typographic standards to ensure your PDF is machine-readable and easy on recruiter eyes:"
        ],
        bullets: [
          "Strict Single Page Rule: Freshers with 0 to 2 years of experience must never exceed one page. Extra pages signal poor ability to prioritize information.",
          "Standard System Typography: Use clean sans-serif fonts such as Inter, Arial, Calibri, or Helvetica. Never use custom script or decorative fonts.",
          "Font Scale Hierarchy: Candidate Name (18 to 20pt Bold), Section Headers (12 to 14pt Bold UPPERCASE), Body Bullet Points (10 to 11pt Regular).",
          "Balanced Margins: Set page margins strictly between 0.5 inches and 0.75 inches on all sides to maximize usable content space.",
          "Format Export: Always export directly as a vector, text-based PDF. Never scan a printed document or save as an image, as OCR scanners introduce character errors."
        ]
      }
    ]
  },
  {
    id: "b2",
    slug: "linkedin-cold-dm-template-freshers",
    title: "Cold Outreach Framework That Gets 40%+ Response Rates from Tech Recruiters",
    excerpt:
      "Stop messaging 'Hi Sir, please give me a job'. Use this concise, respectful 3-sentence outreach framework tailored for engineering managers and alumni.",
    category: "Cold Email",
    readTime: "4 min read",
    date: "Nov 23, 2026",
    tags: ["LinkedIn", "Cold Outreach", "Referrals", "Networking", "Career"],
    content: "",
    sections: [
      {
        heading: "Why 95% of Fresher Cold Messages Get Ignored",
        paragraphs: [
          "Software engineers and talent acquisition teams receive dozens of LinkedIn messages every week. The vast majority read:",
          "Example of what fails: 'Hi Sir, I am looking for a job. Please check my resume and give me a referral.'",
          "These messages fail because they transfer all cognitive load to the recipient. The engineer has no idea who you are, what opening you qualify for, or whether you meet basic graduation batch criteria."
        ],
        callout: {
          title: "The Golden Rule of Cold Outreach",
          text: "Never ask someone to search for job openings on your behalf. Find the exact requisition number on the official company careers portal first, submit your application, and then reach out with a specific, frictionless request."
        }
      },
      {
        heading: "The 3-Sentence High-Conversion Formula",
        paragraphs: [
          "Every high-converting cold outreach message follows a concise 3-part psychological structure:"
        ],
        bullets: [
          "Sentence 1 (The Commonality Hook): Establish who you are and state a genuine connection (shared university, tech interest, or admiring a specific blog post or product update).",
          "Sentence 2 (Proof of Work and Requisition ID): Mention a relevant deployed project that matches their stack, and provide the exact Job ID you already applied for.",
          "Sentence 3 (Low-Friction Polite Ask): Request a brief resume review or internal referral with zero entitlement and an easy exit."
        ]
      },
      {
        heading: "Template 1: For College Alumni at Target Companies",
        paragraphs: [
          "Alumni are 4x more likely to refer you than strangers because of your shared background. Use this template:"
        ],
        callout: {
          title: "Alumni Referral Template",
          text: "Hi [Alum Name],\n\nHope your week is going well! I noticed you also graduated from [Your University] and are now working on [Team/Domain] at [Company].\n\nI am a 2025/2026 graduate passionate about cloud infrastructure and recently deployed a distributed pipeline using Python and Snowflake ([Live Link]). I have officially applied for the SDE-1 opening (Job ID: #[XXXXX]).\n\nIf you have 60 seconds, I would be deeply grateful if you could consider my 1-page resume for an internal referral: [Google Drive Link with View Access]. Either way, thank you for your time and inspiring juniors from our campus!\n\nWarm regards,\n[Your Name] | [LinkedIn/GitHub Link]"
        }
      },
      {
        heading: "Template 2: For Technical Recruiters and Talent Acquisition",
        paragraphs: [
          "Recruiters evaluate candidates based on matching batch criteria and specific technology keywords. Keep it brief and objective:"
        ],
        callout: {
          title: "Technical Recruiter Template",
          text: "Hi [Recruiter Name],\n\nHope you are having a productive week! I saw that [Company] is actively hiring freshers for the [Role Name] position (Job ID: #[XXXXX]).\n\nI meet all batch criteria (Batch 2025/2026, Computer Science, 8.4 CGPA) and have built production-grade projects using [Key Tech 1] and [Key Tech 2].\n\nHere is my 1-page ATS-optimized resume: [Google Drive Link]. I have already submitted the official portal application and would love to be considered for the online assessment round.\n\nThank you for your time and consideration!"
        }
      },
      {
        heading: "3 Crucial Cold Outreach Guidelines",
        paragraphs: [
          "Avoid these common mistakes that immediately kill conversion rates:"
        ],
        bullets: [
          "1. Never attach a heavy PDF directly in the message: Corporate security firewalls and spam filters frequently block unsolicited email attachments. Use a clean Google Drive link set to 'Anyone with the link can view'.",
          "2. Always apply on the official portal first: Recruiters respect candidates who take initiative. Having an application number already in the system makes routing your profile effortless.",
          "3. Follow up once after 5 business days: If you receive no reply, send a polite one-line follow-up: 'Just wanted to gently follow up on this note in case it slipped down your inbox. Thank you again for your time!' This recovers up to 25% of missed responses."
        ]
      }
    ]
  },
  {
    id: "b3",
    slug: "top-technical-questions-fresher-drives",
    title: "Top 20 Core CS and DSA Questions Asked in 2025/2026 Off-Campus Drives",
    excerpt:
      "The exact questions asked repeatedly across product startups, Tier-1 online assessments, and off-campus technical rounds.",
    category: "Interview Prep",
    readTime: "6 min read",
    date: "Nov 20, 2026",
    tags: ["Interview", "DSA", "DBMS", "OS", "OOP", "SQL"],
    content: "",
    sections: [
      {
        heading: "1. Data Structures and Algorithms (5 Core Patterns)",
        paragraphs: [
          "Off-campus online assessments rarely test esoteric algorithms. Over 85% of interview questions fall under five fundamental patterns:"
        ],
        bullets: [
          "Two Pointers & Sliding Window: Finding maximum sum subarray of size K, Longest substring without repeating characters, and 3Sum. Time complexity: O(N), Space complexity: O(1).",
          "Fast and Slow Pointers (Floyd's Cycle Detection): Detecting cycles in a singly linked list and finding the middle node in a single pass.",
          "Monotonic Stack: Finding Next Greater Element and calculating daily temperature intervals in O(N) linear time.",
          "Tree and Graph Traversals: Binary Tree Level Order Traversal (BFS), Lowest Common Ancestor (DFS), and Number of Islands using Breadth-First Search on a grid.",
          "Heaps and Top K Elements: Finding the Kth largest element in an unsorted array using a min-heap in O(N log K) time."
        ]
      },
      {
        heading: "2. Object-Oriented Programming (OOP) Fundamentals",
        paragraphs: [
          "Interviewers test whether you understand real-world architectural design, not just definitions:"
        ],
        bullets: [
          "The 4 Pillars in Production Code: Encapsulation (data hiding via private/protected access modifiers), Abstraction (exposing clean interfaces while hiding complex internal implementations), Inheritance (code reuse via is-a relationships), and Polymorphism (compile-time method overloading vs runtime method overriding).",
          "Abstract Classes vs Interfaces: When should you use an interface instead of an abstract class? (Use interfaces for defining capabilities across unrelated classes; use abstract classes for sharing core implementation among closely related subclasses).",
          "The Diamond Problem in Multiple Inheritance: How is multiple inheritance ambiguity resolved in C++ using virtual inheritance versus Java using interfaces with default methods?"
        ]
      },
      {
        heading: "3. Database Management Systems (DBMS) and SQL",
        paragraphs: [
          "Every technical interview includes at least one live SQL query and questions on relational database integrity:"
        ],
        bullets: [
          "ACID Properties with Bank Scenario: Atomicity (the entire funds transfer completes or completely rolls back), Consistency (account balances cannot drop below configured minimum rules), Isolation (concurrent withdrawals do not read uncommitted balances), and Durability (transactions survive power failure via write-ahead logging).",
          "Database Normalization: Reducing insertion, deletion, and update anomalies through 1NF (atomic values), 2NF (removal of partial dependencies), 3NF (removal of transitive dependencies), and BCNF.",
          "Top Live SQL Queries: Writing queries for the 2nd highest salary using DENSE_RANK() or LIMIT/OFFSET, identifying duplicate records using GROUP BY and HAVING COUNT(*) > 1, and explaining the architectural differences between DELETE, TRUNCATE, and DROP."
        ]
      },
      {
        heading: "4. Operating Systems and Computer Networks",
        paragraphs: [
          "Engineers value freshers who understand how code runs on real hardware and communicates across networks:"
        ],
        bullets: [
          "Process versus Thread: A process is an independent execution unit with its own private virtual memory space. Threads exist within a process and share the heap, data, and code segments, but maintain independent stacks and registers.",
          "Deadlock and the 4 Coffman Conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Breaking any one condition prevents system deadlock.",
          "What Happens When You Type a URL in a Browser: DNS resolution through browser, OS, and recursive resolvers; TCP 3-way handshake (SYN, SYN-ACK, ACK); TLS handshake for cryptographic key exchange; and HTTP request/response parsing with DOM tree construction.",
          "TCP versus UDP: TCP is connection-oriented, reliable, and features flow and congestion control (used for HTTP, database connections, and SSH). UDP is connectionless and low-latency (used for DNS lookups, video streaming, and multiplayer gaming)."
        ]
      }
    ]
  }
];

export const BLOG_POSTS: BlogPost[] = DETAILED_BLOG_POSTS;
