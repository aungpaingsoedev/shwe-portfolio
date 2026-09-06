import { readStore, updateStore } from "@/lib/data/local-store";
import * as db from "@/lib/data/content-db";
import { isDatabaseConfigured } from "@/lib/db";
import type {
  BlogCategory,
  BlogPost,
  ContactMessage,
  DashboardStats,
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

export { usingLocalData } from "@/lib/utils";
export { isDatabaseConfigured };

function useDb() {
  return isDatabaseConfigured();
}

export async function getProfile(): Promise<Profile> {
  if (useDb()) return db.dbGetProfile();
  const store = await readStore();
  return store.profile;
}

export async function getExperiences(): Promise<Experience[]> {
  if (useDb()) return db.dbGetExperiences();
  const store = await readStore();
  return [...store.experiences].sort((a, b) => a.sort_order - b.sort_order);
}

export async function getEducations(): Promise<Education[]> {
  if (useDb()) return db.dbGetEducations();
  const store = await readStore();
  return [...(store.educations ?? [])].sort((a, b) => a.sort_order - b.sort_order);
}

export async function getPublishedProjects(filter?: string): Promise<Project[]> {
  if (useDb()) return db.dbGetPublishedProjects(filter);
  const store = await readStore();
  let list = store.projects.filter((p) => p.status === "published");
  if (filter && filter !== "All") {
    list = list.filter((p) => p.categories.includes(filter));
  }
  return list.sort((a, b) => a.sort_order - b.sort_order);
}

export async function getAllProjects(): Promise<Project[]> {
  if (useDb()) return db.dbGetAllProjects();
  const store = await readStore();
  return [...store.projects].sort((a, b) => a.sort_order - b.sort_order);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (useDb()) return db.dbGetProjectBySlug(slug);
  const store = await readStore();
  return store.projects.find((p) => p.slug === slug && p.status === "published") ?? null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (useDb()) return db.dbGetProjectById(id);
  const store = await readStore();
  return store.projects.find((p) => p.id === id) ?? null;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  if (useDb()) return db.dbGetPublishedPosts();
  const store = await readStore();
  return store.blogPosts
    .filter((p) => p.status === "published")
    .sort(
      (a, b) =>
        new Date(b.published_at || b.created_at).getTime() -
        new Date(a.published_at || a.created_at).getTime(),
    );
}

export async function getAllPosts(): Promise<BlogPost[]> {
  if (useDb()) return db.dbGetAllPosts();
  const store = await readStore();
  return [...store.blogPosts].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  if (useDb()) return db.dbGetBlogCategories();
  const store = await readStore();
  return [...store.blogCategories];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (useDb()) return db.dbGetPostBySlug(slug);
  const store = await readStore();
  return (
    store.blogPosts.find((p) => p.slug === slug && p.status === "published") ??
    null
  );
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  if (useDb()) return db.dbGetPostById(id);
  const store = await readStore();
  return store.blogPosts.find((p) => p.id === id) ?? null;
}

export async function getRelatedPosts(
  post: BlogPost,
  limit = 3,
): Promise<BlogPost[]> {
  if (useDb()) return db.dbGetRelatedPosts(post, limit);
  const posts = await getPublishedPosts();
  return posts
    .filter((p) => p.id !== post.id)
    .filter(
      (p) =>
        p.category_id === post.category_id ||
        p.tags.some((t) => post.tags.includes(t)),
    )
    .slice(0, limit);
}

export async function getSkills(): Promise<{
  categories: SkillCategory[];
  skills: Skill[];
}> {
  if (useDb()) return db.dbGetSkills();
  const store = await readStore();
  return {
    categories: [...store.skillCategories].sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
    skills: [...store.skills].sort((a, b) => a.sort_order - b.sort_order),
  };
}

export async function getMessages(): Promise<ContactMessage[]> {
  if (useDb()) return db.dbGetMessages();
  const store = await readStore();
  return [...store.contactMessages].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export async function getMedia(): Promise<MediaItem[]> {
  if (useDb()) return db.dbGetMedia();
  const store = await readStore();
  return [...store.mediaItems].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export async function getSettings(): Promise<SiteSettings> {
  if (useDb()) return db.dbGetSettings();
  const store = await readStore();
  return store.siteSettings;
}

export async function getSiteCopy(): Promise<SiteCopy> {
  if (useDb()) return db.dbGetSiteCopy();
  const store = await readStore();
  return store.siteCopy;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (useDb()) return db.dbGetDashboardStats();
  const store = await readStore();
  const publishedProjects = store.projects.filter((p) => p.status === "published");
  const publishedPosts = store.blogPosts.filter((p) => p.status === "published");
  return {
    totalProjects: store.projects.length,
    publishedProjects: publishedProjects.length,
    totalPosts: store.blogPosts.length,
    publishedPosts: publishedPosts.length,
    contactMessages: store.contactMessages.length,
    unreadMessages: store.contactMessages.filter((m) => m.status === "unread")
      .length,
    totalViews: store.blogPosts.reduce((sum, p) => sum + (p.views || 0), 0),
    mediaCount: store.mediaItems.length,
  };
}

export async function createContactMessage(
  input: Omit<ContactMessage, "id" | "status" | "created_at">,
): Promise<ContactMessage> {
  if (useDb()) return db.dbCreateContactMessage(input);
  const message: ContactMessage = {
    ...input,
    id: `msg-${crypto.randomUUID()}`,
    status: "unread",
    created_at: new Date().toISOString(),
  };

  await updateStore((store) => {
    store.contactMessages.unshift(message);
    return store;
  });

  return message;
}

export async function saveProject(project: Project): Promise<Project> {
  if (useDb()) return db.dbSaveProject(project);
  await updateStore((store) => {
    const idx = store.projects.findIndex((p) => p.id === project.id);
    if (idx >= 0) store.projects[idx] = project;
    else store.projects.unshift(project);
    return store;
  });
  return project;
}

export async function deleteProject(id: string): Promise<void> {
  if (useDb()) return db.dbDeleteProject(id);
  await updateStore((store) => {
    store.projects = store.projects.filter((p) => p.id !== id);
    return store;
  });
}

export async function savePost(post: BlogPost): Promise<BlogPost> {
  if (useDb()) return db.dbSavePost(post);
  await updateStore((store) => {
    const idx = store.blogPosts.findIndex((p) => p.id === post.id);
    if (idx >= 0) store.blogPosts[idx] = post;
    else store.blogPosts.unshift(post);
    return store;
  });
  return post;
}

export async function deletePost(id: string): Promise<void> {
  if (useDb()) return db.dbDeletePost(id);
  await updateStore((store) => {
    store.blogPosts = store.blogPosts.filter((p) => p.id !== id);
    return store;
  });
}

export async function saveExperience(exp: Experience): Promise<Experience> {
  if (useDb()) return db.dbSaveExperience(exp);
  await updateStore((store) => {
    const idx = store.experiences.findIndex((e) => e.id === exp.id);
    if (idx >= 0) store.experiences[idx] = exp;
    else store.experiences.push(exp);
    store.experiences.sort((a, b) => a.sort_order - b.sort_order);
    return store;
  });
  return exp;
}

export async function deleteExperience(id: string): Promise<void> {
  if (useDb()) return db.dbDeleteExperience(id);
  await updateStore((store) => {
    store.experiences = store.experiences.filter((e) => e.id !== id);
    return store;
  });
}

export async function saveEducations(items: Education[]): Promise<Education[]> {
  if (useDb()) return db.dbSaveEducations(items);
  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);
  await updateStore((store) => {
    store.educations = sorted;
    return store;
  });
  return sorted;
}

export async function saveSkill(skill: Skill): Promise<Skill> {
  if (useDb()) return db.dbSaveSkill(skill);
  await updateStore((store) => {
    const idx = store.skills.findIndex((s) => s.id === skill.id);
    if (idx >= 0) store.skills[idx] = skill;
    else store.skills.push(skill);
    return store;
  });
  return skill;
}

export async function deleteSkill(id: string): Promise<void> {
  if (useDb()) return db.dbDeleteSkill(id);
  await updateStore((store) => {
    store.skills = store.skills.filter((s) => s.id !== id);
    return store;
  });
}

export async function updateMessageStatus(
  id: string,
  status: ContactMessage["status"],
): Promise<void> {
  if (useDb()) return db.dbUpdateMessageStatus(id, status);
  await updateStore((store) => {
    store.contactMessages = store.contactMessages.map((m) =>
      m.id === id ? { ...m, status } : m,
    );
    return store;
  });
}

export async function saveMedia(item: MediaItem): Promise<MediaItem> {
  if (useDb()) return db.dbSaveMedia(item);
  await updateStore((store) => {
    store.mediaItems.unshift(item);
    return store;
  });
  return item;
}

export async function deleteMedia(id: string): Promise<void> {
  if (useDb()) return db.dbDeleteMedia(id);
  await updateStore((store) => {
    store.mediaItems = store.mediaItems.filter((m) => m.id !== id);
    return store;
  });
}

export async function deleteMessage(id: string): Promise<void> {
  if (useDb()) return db.dbDeleteMessage(id);
  await updateStore((store) => {
    store.contactMessages = store.contactMessages.filter((m) => m.id !== id);
    return store;
  });
}

export async function saveSettings(settings: SiteSettings): Promise<SiteSettings> {
  if (useDb()) return db.dbSaveSettings(settings);
  await updateStore((store) => {
    store.siteSettings = settings;
    return store;
  });
  return settings;
}

export async function saveProfile(next: Profile): Promise<Profile> {
  if (useDb()) return db.dbSaveProfile(next);
  await updateStore((store) => {
    store.profile = next;
    return store;
  });
  return next;
}

export async function saveSiteCopy(next: SiteCopy): Promise<SiteCopy> {
  if (useDb()) return db.dbSaveSiteCopy(next);
  await updateStore((store) => {
    store.siteCopy = next;
    return store;
  });
  return next;
}
