import { promises as fs } from "fs";
import path from "path";
import {
  blogCategories,
  blogPosts,
  contactMessages,
  educations,
  experiences,
  mediaItems,
  profile,
  projects,
  siteCopy,
  siteSettings,
  skillCategories,
  skills,
} from "@/lib/data/seed";
import type {
  BlogPost,
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

export interface LocalStore {
  profile: Profile;
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  blogPosts: BlogPost[];
  blogCategories: typeof blogCategories;
  skills: Skill[];
  skillCategories: SkillCategory[];
  contactMessages: ContactMessage[];
  mediaItems: MediaItem[];
  siteSettings: SiteSettings;
  siteCopy: SiteCopy;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

function defaultStore(): LocalStore {
  return {
    profile: structuredClone(profile),
    experiences: structuredClone(experiences),
    educations: structuredClone(educations),
    projects: structuredClone(projects),
    blogPosts: structuredClone(blogPosts),
    blogCategories: structuredClone(blogCategories),
    skills: structuredClone(skills),
    skillCategories: structuredClone(skillCategories),
    contactMessages: structuredClone(contactMessages),
    mediaItems: structuredClone(mediaItems),
    siteSettings: structuredClone(siteSettings),
    siteCopy: structuredClone(siteCopy),
  };
}

function withDefaults(parsed: Partial<LocalStore>): LocalStore {
  const base = defaultStore();
  return {
    ...base,
    ...parsed,
    educations: Array.isArray(parsed.educations)
      ? parsed.educations
      : base.educations,
    siteCopy: {
      ...base.siteCopy,
      ...(parsed.siteCopy ?? {}),
      about: { ...base.siteCopy.about, ...(parsed.siteCopy?.about ?? {}) },
      experience: {
        ...base.siteCopy.experience,
        ...(parsed.siteCopy?.experience ?? {}),
      },
      skills: { ...base.siteCopy.skills, ...(parsed.siteCopy?.skills ?? {}) },
      projects: {
        ...base.siteCopy.projects,
        ...(parsed.siteCopy?.projects ?? {}),
      },
      blog: { ...base.siteCopy.blog, ...(parsed.siteCopy?.blog ?? {}) },
      contact: {
        ...base.siteCopy.contact,
        ...(parsed.siteCopy?.contact ?? {}),
      },
      projects_page: {
        ...base.siteCopy.projects_page,
        ...(parsed.siteCopy?.projects_page ?? {}),
      },
      blog_page: {
        ...base.siteCopy.blog_page,
        ...(parsed.siteCopy?.blog_page ?? {}),
      },
      stats_labels: {
        ...base.siteCopy.stats_labels,
        ...(parsed.siteCopy?.stats_labels ?? {}),
      },
      lifecycle_stages:
        parsed.siteCopy?.lifecycle_stages ?? base.siteCopy.lifecycle_stages,
      about_bridge_labels:
        parsed.siteCopy?.about_bridge_labels ??
        base.siteCopy.about_bridge_labels,
    },
  };
}

export async function readStore(): Promise<LocalStore> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const store = withDefaults(JSON.parse(raw) as Partial<LocalStore>);
    await writeStore(store);
    return store;
  } catch {
    const store = defaultStore();
    await writeStore(store);
    return store;
  }
}

export async function writeStore(store: LocalStore): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function updateStore(
  updater: (store: LocalStore) => LocalStore | Promise<LocalStore>,
): Promise<LocalStore> {
  const current = await readStore();
  const next = await updater(current);
  await writeStore(next);
  return next;
}
