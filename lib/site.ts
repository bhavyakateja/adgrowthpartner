export const SITE = {
  name: "Ad Growth Partner",
  shortName: "AGP",
  tagline: "Creative + Strategy + Technology + Performance",
  description:
    "Ad Growth Partner is a growth, creative and digital technology agency building demand systems that compound.",
  email: "growthpartnerad@gmail.com", // [EDITABLE CONTENT]
  creditUrl: "https://github.com/bhavyakateja",
} as const;

export const NAV_LINKS = [
  { to: "/", key: "nav.home" },
  { to: "/solutions", key: "nav.solutions" },
  // Work is intentionally hidden from the public launch. Keep admin work routes unchanged.
  // { to: "/work", key: "nav.work" },
  { to: "/insights", key: "nav.insights" },
  { to: "/who-we-are", key: "nav.who" },
  { to: "/careers", key: "nav.careers" },
  { to: "/contact", key: "nav.contact" },
] as const;

export const POLICY_LINKS = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-and-conditions", label: "Terms & Conditions" },
  { to: "/cookie-policy", label: "Cookie Policy" },
] as const;

export const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/ad.growthpartner" },
] as const;

export const SOLUTIONS = [
  {
    slug: "growth-strategy",
    title: "Growth Strategy",
    lead: "A demand model built on unit economics, not opinions.",
    problem:
      "Growth stalls when channel tactics run ahead of a clear position and a defensible model of who buys and why.",
    approach:
      "We map the demand landscape, define the positioning that makes you the obvious choice, and build the plan that sequences spend against it.",
    outcomes: ["A single growth model", "Channel mix with a rationale", "A roadmap you can defend"],
  },
  {
    slug: "performance-marketing",
    title: "Performance Marketing",
    lead: "Full-funnel systems held to CAC discipline.",
    problem: "Accounts optimised in isolation hit an efficiency ceiling and stop compounding.",
    approach:
      "Account structure, creative velocity and measurement run as one loop, with weekly decisions instead of monthly reports.",
    outcomes: ["Cleaner account structure", "Faster creative testing", "Decisions tied to margin"],
  },
  {
    slug: "paid-advertising",
    title: "Paid Advertising",
    lead: "Media planning and buying across search, social and programmatic.",
    problem:
      "Media that buys reach instead of buying attention from the people who can actually convert.",
    approach:
      "Audience-first planning, disciplined bidding, and creative built natively for each placement.",
    outcomes: ["Efficient reach", "Higher creative hit rate", "Transparent reporting"],
  },
  {
    slug: "social-media",
    title: "Social Media",
    lead: "Always-on presence with a point of view.",
    problem: "Calendars filled to stay visible rarely build memory or demand.",
    approach:
      "A content platform, a production rhythm, and community handling that sounds like a person.",
    outcomes: ["A recognisable voice", "Sustainable production", "Owned audience growth"],
  },
  {
    slug: "content-seo",
    title: "Content & SEO",
    lead: "Organic engines that earn the long game.",
    problem: "Content produced for volume competes on cost; content produced for intent compounds.",
    approach:
      "Topic architecture mapped to real search behaviour, then editorial craft and technical hygiene.",
    outcomes: ["Durable organic entry points", "Content with a job", "Technical health"],
  },
  {
    slug: "brand-creative",
    title: "Brand & Creative",
    lead: "Identity and campaign work that earns attention before the click.",
    problem: "Brands that look like their category get priced like their category.",
    approach:
      "One ownable idea, expressed as a system that production teams can extend without diluting.",
    outcomes: ["A distinctive identity", "A modular creative system", "Campaign platforms"],
  },
  {
    slug: "websites-digital-experiences",
    title: "Websites & Digital Experiences",
    lead: "Fast, accessible digital products that convert.",
    problem: "Beautiful sites that load slowly, or fast sites that say nothing.",
    approach:
      "Design and engineering in the same room, with performance and accessibility as design constraints.",
    outcomes: ["Sites that load fast", "Accessible by default", "Built to be edited"],
  },
  {
    slug: "analytics-conversion",
    title: "Analytics & Conversion",
    lead: "Measurement you can defend and experiments that settle arguments.",
    problem: "Dashboards that disagree with each other end every debate in a stalemate.",
    approach:
      "One definition of a conversion, consent-aware collection, and a prioritised experiment backlog.",
    outcomes: ["Trustworthy numbers", "A live experiment programme", "Faster decisions"],
  },
  {
    slug: "marketing-technology-ai",
    title: "Marketing Technology / AI",
    lead: "The stack, the data and the automation underneath it all.",
    problem: "Tooling accumulates faster than the team's ability to operate it.",
    approach:
      "Consolidate the stack, wire the data, and apply automation and AI only where it removes real work.",
    outcomes: ["A stack people use", "Connected data", "Automation with guardrails"],
  },
] as const;

export const PROCESS = [
  {
    step: "01",
    title: "Model",
    body: "We build the demand model before we build anything else — audience, economics, and the one metric that matters this quarter.",
  },
  {
    step: "02",
    title: "Make",
    body: "Positioning becomes a creative platform and a technical foundation, produced modularly so every channel gets a native version.",
  },
  {
    step: "03",
    title: "Move",
    body: "We ship into live channels with measurement wired from day one, then make weekly decisions instead of monthly excuses.",
  },
  {
    step: "04",
    title: "Multiply",
    body: "What works gets funded harder, what doesn't gets cut fast, and the reasoning is written down either way.",
  },
] as const;

export const GOALS = [
  "Grow revenue",
  "Generate more leads",
  "Build our brand",
  "Improve our digital presence",
  "Launch something new",
  "Other",
] as const;

export const SERVICES_HELP = [
  "Strategy",
  "Marketing",
  "Creative",
  "Technology",
  "Performance",
  "Not sure yet",
] as const;
