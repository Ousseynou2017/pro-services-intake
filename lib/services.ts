export type Question = {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  options?: string[];
};

export type Service = {
  name: string;
  summary: string;
  points: string[];
  questions: Question[];
};

/** Single source of truth: the landing page and the intake form both read this. */
export const services: Service[] = [
  {
    name: "Operations Audit",
    summary:
      "We map how work actually moves through your company, then remove the steps that cost you time and margin.",
    points: ["Process mapping", "Tooling review", "90-day fix plan"],
    questions: [
      {
        id: "teamSize",
        label: "How many people does the process involve?",
        type: "select",
        options: ["Under 10", "10 to 50", "50 to 200", "Over 200"],
      },
      {
        id: "bottleneck",
        label: "Where does work get stuck today?",
        type: "textarea",
      },
      {
        id: "tools",
        label: "Which tools does the team run on?",
        type: "text",
      },
    ],
  },
  {
    name: "Financial Planning",
    summary:
      "Forecasts you can defend in a board meeting, built on your real numbers rather than a template.",
    points: ["Cash-flow modelling", "Pricing review", "Scenario planning"],
    questions: [
      {
        id: "revenueRange",
        label: "Annual revenue range",
        type: "select",
        options: [
          "Under $500k",
          "$500k to $2M",
          "$2M to $10M",
          "Over $10M",
          "Prefer not to say",
        ],
      },
      {
        id: "forecastStatus",
        label: "Do you have a financial forecast today?",
        type: "select",
        options: ["Yes, and we trust it", "Yes, but it is out of date", "No"],
      },
      {
        id: "financialConcern",
        label: "Which financial question matters most right now?",
        type: "textarea",
      },
    ],
  },
  {
    name: "Growth Strategy",
    summary:
      "A focused plan for the next twelve months, sized to the team and budget you actually have.",
    points: ["Market positioning", "Channel selection", "Quarterly roadmap"],
    questions: [
      {
        id: "channels",
        label: "Which channels bring you customers today?",
        type: "text",
      },
      {
        id: "target",
        label: "What growth are you aiming for over 12 months?",
        type: "select",
        options: [
          "Hold steady, improve margin",
          "Grow up to 25%",
          "Grow 25% to 100%",
          "More than double",
        ],
      },
      {
        id: "blocker",
        label: "What has stopped you reaching that so far?",
        type: "textarea",
      },
    ],
  },
];

export function findService(name: string): Service | undefined {
  return services.find((s) => s.name === name);
}
