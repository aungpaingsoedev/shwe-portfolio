export type PublishStatus = "draft" | "published";

export interface Profile {
  id: string;
  full_name: string;
  role: string;
  tagline: string;
  headline: string;
  bio: string;
  about_title_lines: string[];
  status_text: string;
  email: string;
  location: string;
  resume_url: string | null;
  avatar_url: string | null;
  years_it: number;
  years_dev: number;
  years_pm: number;
  industry_focus: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  summary: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string | null;
  location: string | null;
  start_year: string;
  end_year: string | null;
  note: string | null;
  sort_order: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface Skill {
  id: string;
  category_id: string;
  name: string;
  proficiency: number | null;
  sort_order: number;
  category?: SkillCategory;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  role: string;
  industry: string;
  cover_image: string | null;
  external_url: string | null;
  technologies: string[];
  responsibilities: string[];
  achievements: string[];
  categories: string[];
  status: PublishStatus;
  featured: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
  case_study?: CaseStudy | null;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
}

export interface CaseStudy {
  id: string;
  project_id: string;
  challenge: string;
  discovery: string;
  requirements: string;
  strategy: string;
  execution: string;
  collaboration: string;
  solution: string;
  results: string;
  lessons_learned: string;
  lifecycle_stages: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category_id: string | null;
  category?: BlogCategory | null;
  tags: string[];
  reading_time: number;
  status: PublishStatus;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  views: number;
}

export type MessageStatus = "unread" | "read" | "archived";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  created_at: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  path: string;
  mime_type: string;
  size: number;
  alt: string | null;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_title: string;
  site_description: string;
  og_image: string | null;
  twitter_handle: string | null;
  contact_email: string;
  linkedin_url: string | null;
  github_url: string | null;
  show_admin_link: boolean;
}

export type SectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
  margin_note: string;
  view_all_label?: string;
};

/** All marketing / page chrome copy editable from Admin → Content */
export interface SiteCopy {
  hero_eyebrow: string;
  hero_subcopy: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  hero_sticky_note: string;
  lifecycle_label: string;
  lifecycle_stages: string[];
  about: SectionCopy;
  about_bridge_labels: string[];
  education_eyebrow: string;
  experience: SectionCopy;
  skills: SectionCopy;
  projects: SectionCopy;
  blog: SectionCopy;
  cta_eyebrow: string;
  cta_title: string;
  cta_description: string;
  cta_button_label: string;
  cta_sticky_note: string;
  contact: SectionCopy;
  projects_page: SectionCopy;
  blog_page: SectionCopy;
  footer_sticky_note: string;
  stats_labels: {
    years_it: string;
    years_dev: string;
    years_pm: string;
    industry: string;
  };
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalPosts: number;
  publishedPosts: number;
  contactMessages: number;
  unreadMessages: number;
  totalViews: number;
  mediaCount: number;
}
