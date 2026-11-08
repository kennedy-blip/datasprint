import { format } from "date-fns";

export interface Milestone {
  id: string;
  title: string;
  project: string;
  category: string;
  status: "planned" | "in-progress" | "completed" | "at-risk";
  dueDate: string; // ISO date string
  progress: number; // 0-100
  owner: string;
  description: string;
}

const now = new Date();
const offsetDays = (days: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const adjectives = [
  "Q4 Launch", "Alpha", "Beta", "Redesign", "Migration", "Audit", "Sprint",
  "Onboarding", "Checkout", "Notifications", "Analytics", "API",
];
const nouns = [
  "Milestone", "Release", "Phase", "Feature", "Module", "Integration",
  "Dashboard", "Portal", "Workflow", "Report", "Sync", "Review",
];

function randomItem<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomProgress() {
  return Math.floor(Math.random() * 101);
}

export const MOCK_MILESTONES: Milestone[] = Array.from({ length: 24 }).map(
  (_, i) => {
    const category = randomItem([
      "Product",
      "Engineering",
      "Design",
      "Marketing",
      "Operations",
      "Research",
    ]);
    const status: Milestone["status"] = randomItem([
      "planned",
      "in-progress",
      "completed",
      "at-risk",
    ]);
    const due = offsetDays(Math.floor(Math.random() * 60) - 30);
    return {
      id: `MS-${1000 + i}`,
      title: `${randomItem(adjectives)} ${randomItem(nouns)}`,
      project: randomItem([
        "Atlas", "Nebula", "Orion", "Polaris", "Zenith", "Vertex", "Apex",
      ]),
      category,
      status,
      dueDate: due,
      progress: randomProgress(),
      owner: randomItem([
        "Alex Rivera", "Sam Chen", "Jordan Lee", "Mira Patel", "Obi Okoro",
        "Leila Hassan", "Diego Mendez", "Sofia Novak",
      ]),
      description: `Kickoff and delivery for the ${category.toLowerCase()} track of the ${randomItem(nouns).toLowerCase()} initiative. Covers scoping, execution, review, and handoff.`,
    };
  }
);

// Ensure a few overdue completed/in-progress items exist for chart variety.
MOCK_MILESTONES[0].status = "completed";
MOCK_MILESTONES[0].progress = 100;
MOCK_MILESTONES[1].status = "in-progress";
MOCK_MILESTONES[1].progress = 65;
MOCK_MILESTONES[2].status = "at-risk";
MOCK_MILESTONES[2].progress = 40;

export function emptyMilestone(): Milestone {
  return {
    id: "",
    title: "",
    project: "",
    category: "Product",
    status: "planned",
    dueDate: now.toISOString(),
    progress: 0,
    owner: "",
    description: "",
  };
}
