export interface VerifiedResource {
  id: string;
  title: string;
  category: "Resume & ATS" | "DSA & Coding" | "Interview Prep" | "Cold Outreach";
  source: string;
  description: string;
  url: string;
  badge: "Official" | "Gold Standard" | "Recommended" | "Free Tool";
}

export const VERIFIED_RESOURCES: VerifiedResource[] = [
  {
    id: "r1",
    title: "Jake's Resume Template (LaTeX / Overleaf)",
    category: "Resume & ATS",
    source: "Overleaf & r/EngineeringResumes",
    description:
      "The undisputed #1 ATS-tested single-column layout. Engineered to pass Workday, Taleo, and Greenhouse with a 100% parsing success rate.",
    url: "https://www.overleaf.com/latex/templates/jakes-resume/syzsqbzwjvdq",
    badge: "Gold Standard",
  },
  {
    id: "r2",
    title: "Harvard Office of Career Services Action Verbs",
    category: "Resume & ATS",
    source: "Harvard University OCS",
    description:
      "Official list of 180+ verified high-impact power action verbs categorized by technical execution, problem solving, and leadership.",
    url: "https://careerservices.fas.harvard.edu/resources/bullet-point-verb-list/",
    badge: "Official",
  },
  {
    id: "r3",
    title: "Google's X-Y-Z Resume Bullet Formula",
    category: "Resume & ATS",
    source: "Google People Operations",
    description:
      "Official framework recommended by Google technical recruiters: 'Accomplished [X] as measured by [Y], by doing [Z]' with real engineering examples.",
    url: "https://www.inc.com/bill-murphy-jr/google-recruiters-say-these-5-resume-tips-including-xyz-formula-will-get-you-hired-at-google.html",
    badge: "Official",
  },
  {
    id: "r4",
    title: "Striver's SDE Sheet (Top 191 Problems)",
    category: "DSA & Coding",
    source: "takeUforward by Raj Vikramaditya",
    description:
      "The definitive fresher interview roadmap covering core DSA patterns tested in online assessments (OA) for Amazon, Google, and TCS Digital.",
    url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/",
    badge: "Gold Standard",
  },
  {
    id: "r5",
    title: "NeetCode 150 Coding Roadmap",
    category: "DSA & Coding",
    source: "NeetCode.io",
    description:
      "Interactive visual flowchart of 150 essential LeetCode problems categorized from Arrays to Dynamic Programming with free video breakdowns.",
    url: "https://neetcode.io/roadmap",
    badge: "Recommended",
  },
  {
    id: "r6",
    title: "CS50: Introduction to Computer Science",
    category: "Interview Prep",
    source: "Harvard University & edX",
    description:
      "Free university curriculum covering algorithms, data structures, memory management, SQL, and web systems from first principles.",
    url: "https://cs50.harvard.edu/x/",
    badge: "Official",
  },
];
