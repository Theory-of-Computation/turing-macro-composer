export interface RouteConfig {
  path: string;
  label: string;
  description: string;
  progress: number;
}

export const MODULE_ROUTES: RouteConfig[] = [
  {
    path: "/",
    label: "Home",
    description:
      "Start with an animated overview of modular Turing machines and why composition matters.",
    progress: 0
  },
  {
    path: "/concepts",
    label: "Concepts",
    description: "Explore block diagrams and pseudocode abstractions for composed Turing machines.",
    progress: 0.1
  },
  {
    path: "/visual-demo",
    label: "Visual Demo",
    description: "Experiment with a drag-and-drop composer to connect reusable machine blocks.",
    progress: 0.3
  },
  {
    path: "/macroinstructions",
    label: "Macroinstructions",
    description: "See how macroinstructions translate into concrete tape manipulations.",
    progress: 0.5
  },
  {
    path: "/examples/multiplication",
    label: "Examples",
    description: "Walk through the unary multiplication machine from Example 9.14 step by step.",
    progress: 0.7
  },
  {
    path: "/exercises",
    label: "Exercises",
    description: "Test your understanding with self-check questions and interactive challenges.",
    progress: 0.9
  },
  {
    path: "/summary",
    label: "Summary",
    description: "Review key takeaways and celebrate your progress through the module.",
    progress: 1
  }
];
