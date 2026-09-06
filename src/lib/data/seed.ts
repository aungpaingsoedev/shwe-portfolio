import type {
  BlogCategory,
  BlogPost,
  CaseStudy,
  ContactMessage,
  Education,
  Experience,
  MediaItem,
  Profile,
  Project,
  SiteCopy,
  SiteSettings,
  Skill,
  SkillCategory,
} from "@/types";

export const profile: Profile = {
  id: "profile-1",
  full_name: "Shwe Yi Mon",
  role: "IT Project Manager / Product Owner",
  tagline: "Bridging Business Strategy, Technology & Product Delivery.",
  headline: "Turning Complex Ideas Into Products That Work.",
  bio: "Results-driven IT professional with over 7 years of experience, including 4 years in software development and more than 3 years as an IT Project Manager & Product Owner in the banking sector. Experienced in managing the full project lifecycle, ensuring alignment with business goals, regulatory standards, and stakeholder expectations. Proficient in Agile and Waterfall methodologies, with strong expertise in user story development, requirements analysis, and process workflow design.",
  about_title_lines: [
    "Business mindset.",
    "Technical foundation.",
    "Product thinking.",
  ],
  status_text: "Currently driving digital transformation",
  email: "engr.shweyimonn@gmail.com",
  location: "Yangon, Myanmar",
  resume_url: "/resume.pdf",
  avatar_url: "/images/shwe-yi-mon.jpg",
  years_it: 7,
  years_dev: 4,
  years_pm: 3,
  industry_focus: "Banking",
  updated_at: new Date().toISOString(),
};

export const educations: Education[] = [
  {
    id: "edu-1",
    school: "Lincoln University",
    degree: "Master of Business Administration (MBA)",
    field: "Business Administration",
    location: null,
    start_year: "",
    end_year: null,
    note: null,
    sort_order: 1,
  },
  {
    id: "edu-2",
    school: "Strategy First University",
    degree: "Postgraduate Diploma in Project Management",
    field: "Project Management",
    location: null,
    start_year: "",
    end_year: null,
    note: null,
    sort_order: 2,
  },
  {
    id: "edu-3",
    school: "Technological University (Thanlyin)",
    degree: "Bachelor Degree of Information Technology",
    field: "Information Technology",
    location: "Thanlyin, Myanmar",
    start_year: "",
    end_year: null,
    note: null,
    sort_order: 3,
  },
];

export const experiences: Experience[] = [
  {
    id: "exp-1",
    company: "AYA Bank Co., Ltd.",
    position: "Manager — Project Management Office (PMO)",
    location: "Yangon",
    start_date: "2025-11-01",
    end_date: null,
    is_current: true,
    summary:
      "Partnered with the Bank’s Strategy Office to lead high-priority business and technology projects, directly supporting organizational growth and digital transformation goals.",
    responsibilities: [
      "Managed full project lifecycle including initiation, planning, execution, monitoring, and closure",
      "Collaborated with cross-functional teams across business units and IT to define requirements, milestones, and deliverables",
      "Translated complex business needs into actionable project plans",
      "Proactively identified, tracked, and mitigated project risks, issues, and dependencies",
      "Delivered clear updates to senior stakeholders through structured reporting and dashboards",
      "Championed collaboration across departments and agile ways of working",
      "Contributed to strengthening PMO maturity through standards, templates, and digital tools",
    ],
    achievements: [
      "Delivered high-priority business and technology projects on time and within scope",
      "Improved project delivery efficiency through structured planning and proactive monitoring",
      "Strengthened stakeholder satisfaction with clear updates, dashboards, and timely escalation",
      "Reduced project risks and delays through proactive dependency and issue management",
      "Enhanced PMO maturity by standardizing processes, templates, and reporting practices",
    ],
    technologies: ["Jira", "Confluence", "MS Project", "Power BI"],
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "exp-2",
    company: "KBZ Bank Co., Ltd.",
    position: "Project Manager — Software & Data Analytics",
    location: "Yangon",
    start_date: "2024-01-01",
    end_date: "2025-10-31",
    is_current: false,
    summary:
      "Gathered and analyzed detailed requirements; developed technical documents and project plans while managing the full software and data analytics delivery lifecycle.",
    responsibilities: [
      "Managed full project lifecycle: design, analysis, testing, and implementation",
      "Communicated expectations clearly to teams and stakeholders",
      "Maintained relationships with clients, vendors, and partners",
      "Identified and managed dependencies, critical paths, and risks",
      "Reported progress and escalated issues to senior management",
      "Provided technical guidance bridging business and technical teams",
      "Oversaw daily project operations and collaborated with technical leaders",
    ],
    achievements: [
      "Reduced project delays by 30% through proactive risk management",
      "Improved stakeholder satisfaction by 20%, increasing feedback scores from 75% to 90%",
      "Achieved 10% cost savings through effective vendor and partner coordination",
    ],
    technologies: ["Agile", "Scrum", "SQL", "Tableau", "Azure DevOps"],
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "exp-3",
    company: "Meglio Futuro Co., Ltd.",
    position: "Senior Project Coordinator",
    location: "Yangon / Remote",
    start_date: "2022-05-01",
    end_date: "2023-12-31",
    is_current: false,
    summary:
      "Collaborated with Japanese, Indian, and Myanmar teams to ensure seamless communication and smooth project delivery for corporate clients.",
    responsibilities: [
      "Cross-border collaboration across Japanese, Indian, and Myanmar teams",
      "Reviewed system architecture and codebase with actionable recommendations",
      "Executed complex design projects for prestigious corporate clients",
      "Partnered with product managers, UX/UI designers, and engineers on technical specifications",
    ],
    achievements: [
      "Improved cross-team collaboration by 25%, accelerating project timelines",
      "Delivered 3 major projects on time with full client satisfaction",
    ],
    technologies: ["Agile", "Figma", "Jira", "Slack"],
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "exp-4",
    company: "Myanmar Solution Co., Ltd.",
    position: "Senior Software Engineer",
    location: "Yangon",
    start_date: "2021-02-01",
    end_date: "2022-04-30",
    is_current: false,
    summary:
      "Built dynamic React/Redux web applications and real-time experiences such as messenger and Zoom-like products, with strong SQL and MongoDB data work.",
    responsibilities: [
      "Developed React and Redux applications for production systems",
      "Designed and optimized real-time messaging and collaboration experiences",
      "Worked with SQL and MongoDB for data extraction and manipulation",
      "Used Git workflows and batch programming for deployment and data processing",
    ],
    achievements: [
      "Delivered production-ready real-time communication features",
      "Supported concept design, wireframing, and performance optimization",
    ],
    technologies: ["React", "Redux", "SQL", "MongoDB", "Git"],
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "exp-5",
    company: "Meta Team Co., Ltd. (former Seattle Consulting Myanmar)",
    position: "Junior to Senior Web Developer",
    location: "Yangon",
    start_date: "2018-12-01",
    end_date: "2021-01-31",
    is_current: false,
    summary:
      "Developed web applications using PHP (Laravel), JavaScript, React.js, and Vue.js in collaboration with designers and delivery leaders.",
    responsibilities: [
      "Built and maintained Laravel and modern JavaScript web applications",
      "Collaborated with designers on clean, intuitive user interfaces",
      "Developed project concepts and maintained delivery workflows",
      "Coordinated with BSE and team leaders on large corporate design projects",
    ],
    achievements: [
      "Delivered multiple client web applications end-to-end over two years",
    ],
    technologies: ["PHP", "Laravel", "JavaScript", "React", "Vue.js"],
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const skillCategories: SkillCategory[] = [
  { id: "sc-1", name: "Project Management", slug: "project-management", sort_order: 1 },
  { id: "sc-2", name: "Product Management", slug: "product-management", sort_order: 2 },
  { id: "sc-3", name: "Technical", slug: "technical", sort_order: 3 },
  { id: "sc-4", name: "Data", slug: "data", sort_order: 4 },
  { id: "sc-5", name: "Tools", slug: "tools", sort_order: 5 },
  { id: "sc-6", name: "Soft Skills", slug: "soft-skills", sort_order: 6 },
];

export const skills: Skill[] = [
  { id: "sk-1", category_id: "sc-1", name: "Project Lifecycle Management", proficiency: 95, sort_order: 1 },
  { id: "sk-2", category_id: "sc-1", name: "Risk & Dependency Management", proficiency: 92, sort_order: 2 },
  { id: "sk-3", category_id: "sc-1", name: "Agile / Waterfall Delivery", proficiency: 90, sort_order: 3 },
  { id: "sk-4", category_id: "sc-1", name: "Stakeholder Management", proficiency: 94, sort_order: 4 },
  { id: "sk-5", category_id: "sc-2", name: "Product Ownership", proficiency: 88, sort_order: 1 },
  { id: "sk-6", category_id: "sc-2", name: "Requirements Management", proficiency: 93, sort_order: 2 },
  { id: "sk-7", category_id: "sc-2", name: "Business Analysis", proficiency: 90, sort_order: 3 },
  { id: "sk-8", category_id: "sc-2", name: "Roadmapping & Prioritization", proficiency: 86, sort_order: 4 },
  { id: "sk-9", category_id: "sc-3", name: "Software Development Background", proficiency: 85, sort_order: 1 },
  { id: "sk-10", category_id: "sc-3", name: "React / JavaScript", proficiency: 80, sort_order: 2 },
  { id: "sk-11", category_id: "sc-3", name: "APIs & System Thinking", proficiency: 82, sort_order: 3 },
  { id: "sk-12", category_id: "sc-4", name: "Data Analytics Projects", proficiency: 84, sort_order: 1 },
  { id: "sk-13", category_id: "sc-4", name: "SQL Fundamentals", proficiency: 78, sort_order: 2 },
  { id: "sk-14", category_id: "sc-4", name: "Reporting & Insights", proficiency: 88, sort_order: 3 },
  { id: "sk-15", category_id: "sc-5", name: "Jira / Confluence", proficiency: 92, sort_order: 1 },
  { id: "sk-16", category_id: "sc-5", name: "Azure DevOps", proficiency: 80, sort_order: 2 },
  { id: "sk-17", category_id: "sc-5", name: "Figma Collaboration", proficiency: 75, sort_order: 3 },
  { id: "sk-18", category_id: "sc-6", name: "Executive Communication", proficiency: 93, sort_order: 1 },
  { id: "sk-19", category_id: "sc-6", name: "Cross-functional Leadership", proficiency: 91, sort_order: 2 },
  { id: "sk-20", category_id: "sc-6", name: "Negotiation & Facilitation", proficiency: 89, sort_order: 3 },
];

const caseStudyBanking: CaseStudy = {
  id: "cs-1",
  project_id: "proj-1",
  challenge:
    "A multi-team banking initiative lacked a shared delivery model. Priorities shifted weekly, dependencies were invisible, and leadership needed clearer decision points without slowing execution.",
  discovery:
    "Conducted stakeholder interviews across business, compliance, engineering, and operations. Mapped value streams, friction points, and decision latency across the current operating model.",
  requirements:
    "Translated ambiguous business goals into prioritized epics, acceptance criteria, and governance checkpoints suitable for regulated banking delivery.",
  strategy:
    "Established a hybrid Agile-Waterfall cadence: discovery sprints for clarity, controlled release trains for compliance-sensitive workstreams, and a living RAID log for leadership.",
  execution:
    "Facilitated weekly delivery rituals, unblocked cross-team dependencies, and maintained executive dashboards that surfaced risk early enough to act.",
  collaboration:
    "Created a shared language between product, engineering, and business sponsors—reducing rework caused by misaligned expectations.",
  solution:
    "A governed delivery operating system with clear ownership, measurable milestones, and transparent trade-off conversations.",
  results:
    "Improved predictability of release windows, reduced late-stage scope surprises, and increased confidence in portfolio reporting to executives.",
  lessons_learned:
    "In regulated environments, clarity beats speed theater. Product thinking plus delivery discipline creates trust faster than either alone.",
  lifecycle_stages: ["Idea", "Strategy", "Requirements", "Delivery", "Impact"],
};

export const projects: Project[] = [
  {
    id: "proj-1",
    title: "Banking Digital Transformation Program",
    slug: "banking-digital-transformation",
    short_description:
      "Led cross-functional delivery for a multi-workstream digital transformation program spanning channels, data, and internal operations.",
    role: "Project Manager / Product Owner",
    industry: "Banking",
    cover_image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    external_url: null,
    technologies: ["Jira", "Confluence", "Agile", "Power BI", "Stakeholder Workshops"],
    responsibilities: [
      "Program planning and milestone ownership",
      "Requirements prioritization with business sponsors",
      "Risk and dependency management",
      "Executive reporting and governance",
    ],
    achievements: [
      "Improved delivery predictability across workstreams",
      "Reduced escalation noise through proactive RAID management",
    ],
    categories: ["Project Management", "Banking", "Digital Transformation", "Product"],
    status: "published",
    featured: true,
    sort_order: 1,
    published_at: "2024-11-01T00:00:00.000Z",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      {
        id: "pi-1",
        project_id: "proj-1",
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
        alt: "Analytics dashboard",
        sort_order: 1,
      },
    ],
    case_study: caseStudyBanking,
  },
  {
    id: "proj-2",
    title: "Data Analytics Delivery Portfolio",
    slug: "data-analytics-delivery-portfolio",
    short_description:
      "Managed software and analytics initiatives that improved stakeholder satisfaction and reduced delivery delays.",
    role: "Project Manager",
    industry: "Banking / Data",
    cover_image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
    external_url: null,
    technologies: ["SQL", "Tableau", "Azure DevOps", "Scrum"],
    responsibilities: [
      "Portfolio coordination for analytics products",
      "Vendor and internal team alignment",
      "Cost and timeline optimization",
    ],
    achievements: [
      "Reduced project delays by 30%",
      "Improved stakeholder satisfaction from 75% to 90%",
      "Achieved 10% cost savings",
    ],
    categories: ["Project Management", "Data", "Banking"],
    status: "published",
    featured: true,
    sort_order: 2,
    published_at: "2023-08-01T00:00:00.000Z",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    case_study: {
      id: "cs-2",
      project_id: "proj-2",
      challenge:
        "Analytics initiatives were chronically delayed due to unclear ownership, shifting priorities, and weak stakeholder alignment.",
      discovery:
        "Audited active initiatives, mapped request intake, and measured where cycle time was lost between ideation and delivery.",
      requirements:
        "Defined a lightweight intake model with business value scoring, data readiness checks, and explicit success metrics.",
      strategy:
        "Introduced capacity-based prioritization and a single source of truth for roadmap commitments.",
      execution:
        "Ran iterative delivery with transparent demos and early risk surfacing for executives.",
      collaboration:
        "Brought business owners, data engineers, and analysts into the same planning rhythm.",
      solution:
        "A managed analytics portfolio with clearer commitments, measurable outcomes, and healthier stakeholder trust.",
      results:
        "30% fewer delays, stakeholder satisfaction up to 90%, and 10% cost savings.",
      lessons_learned:
        "Satisfaction rises when trade-offs are explicit—and when delivery promises match real capacity.",
      lifecycle_stages: ["Idea", "Strategy", "Requirements", "Delivery", "Impact"],
    },
  },
  {
    id: "proj-3",
    title: "Realtime Collaboration Product",
    slug: "realtime-collaboration-product",
    short_description:
      "Engineering contribution to realtime messaging and collaboration experiences with React, Redux, and resilient data flows.",
    role: "Senior Software Engineer",
    industry: "Software",
    cover_image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    external_url: null,
    technologies: ["React", "Redux", "WebSockets", "MongoDB", "SQL"],
    responsibilities: [
      "Frontend architecture for realtime experiences",
      "Feature delivery with product and design partners",
      "Code quality and Git workflow discipline",
    ],
    achievements: [
      "Shipped production messaging workflows",
      "Improved collaboration between engineering and product",
    ],
    categories: ["Software", "Product"],
    status: "published",
    featured: false,
    sort_order: 3,
    published_at: "2019-05-01T00:00:00.000Z",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    case_study: {
      id: "cs-3",
      project_id: "proj-3",
      challenge:
        "Users needed low-latency collaboration features that felt reliable under imperfect network conditions.",
      discovery:
        "Partnered with product and UX to map critical user journeys and failure states.",
      requirements:
        "Broke journeys into incremental slices with clear acceptance criteria and performance expectations.",
      strategy:
        "Prioritized core messaging reliability before advanced collaboration flourishes.",
      execution:
        "Implemented React/Redux client patterns with robust state handling and iterative QA cycles.",
      collaboration:
        "Worked tightly with designers and backend engineers through shared prototypes and demos.",
      solution:
        "A realtime collaboration experience grounded in dependable messaging fundamentals.",
      results:
        "Stable feature releases and stronger product-engineering collaboration habits.",
      lessons_learned:
        "Technical credibility makes product conversations sharper—and delivery more honest.",
      lifecycle_stages: ["Idea", "Strategy", "Requirements", "Delivery", "Impact"],
    },
  },
  {
    id: "proj-4",
    title: "Corporate Web Product Delivery",
    slug: "corporate-web-product-delivery",
    short_description:
      "Coordinated international teams to deliver corporate digital products with architecture review and UX collaboration.",
    role: "Senior Project Coordinator",
    industry: "Software",
    cover_image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    external_url: null,
    technologies: ["Jira", "Figma", "Agile", "Architecture Reviews"],
    responsibilities: [
      "International delivery coordination",
      "UX and engineering collaboration support",
      "Architecture review facilitation",
    ],
    achievements: [
      "Improved cross-timezone delivery cadence",
      "Reduced design-to-engineering ambiguity",
    ],
    categories: ["Project Management", "Digital Transformation", "Software"],
    status: "published",
    featured: false,
    sort_order: 4,
    published_at: "2020-10-01T00:00:00.000Z",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const blogCategories: BlogCategory[] = [
  { id: "bc-1", name: "Project Management", slug: "project-management" },
  { id: "bc-2", name: "Product Management", slug: "product-management" },
  { id: "bc-3", name: "Leadership", slug: "leadership" },
  { id: "bc-4", name: "Digital Transformation", slug: "digital-transformation" },
  { id: "bc-5", name: "Career Lessons", slug: "career-lessons" },
  { id: "bc-6", name: "Banking Technology", slug: "banking-technology" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "bp-1",
    title: "Why Delivery Discipline Is a Product Skill",
    slug: "delivery-discipline-is-a-product-skill",
    excerpt:
      "Roadmaps fail quietly when ownership, constraints, and decision latency are ignored. Delivery discipline is not bureaucracy—it is product clarity made operational.",
    content: `## The false split

Many teams treat product thinking and delivery discipline as opposing forces. In practice, the best product outcomes come from people who can hold both: vision and operational reality.

## What discipline actually means

Discipline is not more meetings. It is:

- Explicit ownership
- Visible constraints
- Honest forecasts
- Decision records that survive memory

## In banking and regulated environments

When compliance, risk, and customer trust are non-negotiable, ambiguity becomes expensive. A product owner who understands delivery mechanics can protect both speed and integrity.

## A practical habit

Before every commitment, ask:

1. What decision are we making?
2. What must be true for this to work?
3. What will we stop doing to create capacity?

## Closing

If strategy cannot survive a RAID log, it was never strategy—it was aspiration.`,
    cover_image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
    category_id: "bc-2",
    category: blogCategories[1],
    tags: ["Product", "Delivery", "Leadership"],
    reading_time: 5,
    status: "published",
    seo_title: "Why Delivery Discipline Is a Product Skill | Shwe Yi Mon",
    seo_description:
      "How project delivery discipline strengthens product ownership in complex IT environments.",
    published_at: "2025-11-12T00:00:00.000Z",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    views: 1280,
  },
  {
    id: "bp-2",
    title: "Stakeholder Alignment Without Endless Meetings",
    slug: "stakeholder-alignment-without-endless-meetings",
    excerpt:
      "Alignment is a design problem. The goal is shared understanding with less ceremony—not more status theater.",
    content: `## The meeting trap

When trust is low, teams schedule more meetings. When meetings multiply, trust often falls further.

## Design for decisions

Replace recurring status with:

- A living decision log
- A single portfolio board
- Asynchronous updates with clear ask/decide/inform labels

## The PM's role

Project and product leaders should reduce cognitive load for executives while increasing clarity for delivery teams.

## A simple framework

Use **Inform / Consult / Decide** for every communication. If nobody needs to decide, it probably should not be a meeting.

## Closing

Alignment is not agreement on everything. It is agreement on what matters now.`,
    cover_image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80",
    category_id: "bc-1",
    category: blogCategories[0],
    tags: ["Stakeholders", "Communication", "Agile"],
    reading_time: 4,
    status: "published",
    seo_title: "Stakeholder Alignment Without Endless Meetings",
    seo_description:
      "Practical ways to create stakeholder alignment with fewer meetings and clearer decisions.",
    published_at: "2025-09-03T00:00:00.000Z",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    views: 940,
  },
  {
    id: "bp-3",
    title: "From Engineer to Product Leader: What Actually Transfers",
    slug: "from-engineer-to-product-leader",
    excerpt:
      "A software background is an advantage in product and project leadership—if you convert technical depth into better questions, not deeper implementation debates.",
    content: `## What transfers

- Systems thinking
- Respect for constraints
- Empathy for implementation risk
- Pattern recognition in architecture trade-offs

## What must evolve

Engineers are rewarded for solving. Leaders are rewarded for framing. The shift is from "I can build it" to "we can decide wisely."

## In digital transformation

Technical literacy helps you challenge vague vendor promises and protect delivery teams from impossible timelines.

## Closing

Your past as a developer is not a detour. It is part of your product operating system.`,
    cover_image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    category_id: "bc-5",
    category: blogCategories[4],
    tags: ["Career", "Engineering", "Product"],
    reading_time: 4,
    status: "published",
    seo_title: "From Engineer to Product Leader",
    seo_description:
      "Lessons on transferring software engineering experience into project and product leadership.",
    published_at: "2025-06-18T00:00:00.000Z",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    views: 1102,
  },
  {
    id: "bp-4",
    title: "Digital Transformation in Banking Needs Product Thinking",
    slug: "digital-transformation-banking-product-thinking",
    excerpt:
      "Banking transformation fails when it is treated as a technology rollout instead of a product and operating-model redesign.",
    content: `## Technology is necessary, not sufficient

Core upgrades and channel launches do not equal transformation. Customers and employees experience outcomes, not architectures.

## Where product ownership helps

- Framing problems before prescribing solutions
- Sequencing value instead of boiling the ocean
- Measuring adoption, not only go-live dates

## Governance that enables

Good governance accelerates decisions. Bad governance creates permission theater.

## Closing

The banks that win treat transformation as continuous product discovery under regulatory constraints—not as a one-time program.`,
    cover_image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=80",
    category_id: "bc-4",
    category: blogCategories[3],
    tags: ["Banking", "Transformation", "Product"],
    reading_time: 5,
    status: "published",
    seo_title: "Digital Transformation in Banking Needs Product Thinking",
    seo_description:
      "Why banking digital transformation requires product ownership, not only technology delivery.",
    published_at: "2025-03-22T00:00:00.000Z",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    views: 1560,
  },
];

export const contactMessages: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Thiri Aung",
    email: "thiri@example.com",
    subject: "Advisory conversation",
    message:
      "Would love to discuss a digital transformation initiative and your approach to stakeholder alignment.",
    status: "unread",
    created_at: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "msg-2",
    name: "James Carter",
    email: "james@example.com",
    subject: "Speaking opportunity",
    message: "Interested in having you share lessons on product ownership in banking tech.",
    status: "read",
    created_at: "2026-02-18T08:30:00.000Z",
  },
];

export const mediaItems: MediaItem[] = [
  {
    id: "media-1",
    name: "shwe-yi-mon.jpg",
    url: "/images/shwe-yi-mon.jpg",
    path: "images/shwe-yi-mon.jpg",
    mime_type: "image/jpeg",
    size: 88436,
    alt: "Shwe Yi Mon professional portrait",
    created_at: new Date().toISOString(),
  },
  {
    id: "media-2",
    name: "dashboard-cover.jpg",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    path: "portfolio/dashboard-cover.jpg",
    mime_type: "image/jpeg",
    size: 240000,
    alt: "Dashboard analytics",
    created_at: new Date().toISOString(),
  },
];

export const siteSettings: SiteSettings = {
  id: "settings-1",
  site_title: "Shwe Yi Mon — IT Project Manager & Product Owner",
  site_description:
    "Bridging business strategy, technology, and product delivery. Portfolio of Shwe Yi Mon.",
  og_image:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  twitter_handle: null,
  contact_email: "engr.shweyimonn@gmail.com",
  linkedin_url: "https://www.linkedin.com/in/shwe-yi-mon-469138298/",
  github_url: null,
  show_admin_link: true,
};

export const siteCopy: SiteCopy = {
  hero_eyebrow: "Project Manager · Product Owner",
  hero_subcopy:
    "With {years_it}+ years across development, project management, and product ownership—turning complex ideas into products that ship and create impact.",
  hero_cta_primary: "Explore My Work",
  hero_cta_secondary: "Read My Insights",
  hero_sticky_note: "note: start with the work →",
  lifecycle_label: "lifecycle",
  lifecycle_stages: ["IDEA", "STRATEGY", "REQUIREMENTS", "DELIVERY", "IMPACT"],
  about: {
    eyebrow: "About",
    title: "The bridge between vision and delivery",
    description: "A dual lens across business outcomes and technical reality.",
    margin_note: "margin · who I am",
  },
  about_bridge_labels: ["Business", "Product", "Technology"],
  education_eyebrow: "Education",
  experience: {
    eyebrow: "Experience",
    title: "Where strategy meets delivery",
    description:
      "A path from engineering into project leadership and product ownership across banking and digital programs.",
    margin_note: "timeline →",
  },
  skills: {
    eyebrow: "Skills",
    title: "Capabilities across the delivery stack",
    description:
      "Project leadership, product thinking, and a technical foundation—expressed as focused tools, not scorecards.",
    margin_note: "toolkit ·",
  },
  projects: {
    eyebrow: "Selected Work",
    title: "Products and programs delivered with clarity",
    description:
      "Editorial case studies spanning banking transformation, analytics portfolios, and software product delivery.",
    margin_note: "case studies →",
    view_all_label: "View all",
  },
  blog: {
    eyebrow: "Thinking Beyond Delivery",
    title: "Insights from the intersection of product and delivery",
    description: "",
    margin_note: "pages →",
    view_all_label: "Read all",
  },
  cta_eyebrow: "Contact",
  cta_title: "Let’s shape the next product milestone",
  cta_description:
    "Open to conversations about project leadership, product ownership, and digital transformation in complex environments.",
  cta_button_label: "Get in touch",
  cta_sticky_note: "drop a line — I’ll reply in ink",
  contact: {
    eyebrow: "Contact",
    title: "Let’s talk about delivery that creates impact",
    description:
      "Whether you need project leadership, product ownership, or a partner who can translate between business and technology—send a note.",
    margin_note: "",
  },
  projects_page: {
    eyebrow: "Projects",
    title: "Work that connects strategy to shipped outcomes",
    description:
      "Filter by discipline or industry. Every engagement is structured like a product case study—challenge through impact.",
    margin_note: "portfolio ·",
  },
  blog_page: {
    eyebrow: "Blog",
    title: "Thinking Beyond Delivery.",
    description:
      "Notes on product ownership, project leadership, banking technology, and the craft of shipping under real constraints.",
    margin_note: "notebook ·",
  },
  footer_sticky_note: "written in ink · shipped in code",
  stats_labels: {
    years_it: "Years in IT",
    years_dev: "Years development",
    years_pm: "Years PM / PO",
    industry: "Industry focus",
  },
};

export const projectFilters = [
  "All",
  "Product",
  "Project Management",
  "Software",
  "Banking",
  "Data",
  "Digital Transformation",
] as const;
