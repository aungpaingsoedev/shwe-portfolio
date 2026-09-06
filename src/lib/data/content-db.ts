import type {
  BlogCategory,
  BlogPost,
  CaseStudy,
  ContactMessage,
  DashboardStats,
  Education,
  Experience,
  MediaItem,
  Profile,
  Project,
  ProjectImage,
  SiteCopy,
  SiteSettings,
  Skill,
  SkillCategory,
} from "@/types";
import { siteCopy as seedSiteCopy } from "@/lib/data/seed";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import type {
  BlogPost as DbBlogPost,
  BlogCategory as DbBlogCategory,
  CaseStudy as DbCaseStudy,
  ContactMessage as DbContactMessage,
  Education as DbEducation,
  Experience as DbExperience,
  Media as DbMedia,
  Profile as DbProfile,
  Project as DbProject,
  ProjectImage as DbProjectImage,
  SiteSettings as DbSiteSettings,
  Skill as DbSkill,
  SkillCategory as DbSkillCategory,
} from "@prisma/client";

export { isDatabaseConfigured };

function iso(d: Date | null | undefined): string | null {
  if (!d) return null;
  return d.toISOString();
}

function dateOnly(d: Date | null | undefined): string | null {
  if (!d) return null;
  return d.toISOString().slice(0, 10);
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );
}

function ensureUuid(id: string): string {
  return isUuid(id) ? id : crypto.randomUUID();
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapProfile(row: DbProfile): Profile {
  return {
    id: row.id,
    full_name: row.fullName,
    role: row.role,
    tagline: row.tagline ?? "",
    headline: row.headline ?? "",
    bio: row.bio ?? "",
    about_title_lines: row.aboutTitleLines,
    status_text: row.statusText ?? "",
    email: row.email ?? "",
    location: row.location ?? "",
    resume_url: row.resumeUrl,
    avatar_url: row.avatarUrl,
    years_it: row.yearsIt,
    years_dev: row.yearsDev,
    years_pm: row.yearsPm,
    industry_focus: row.industryFocus ?? "",
    updated_at: iso(row.updatedAt)!,
  };
}

function mapExperience(row: DbExperience): Experience {
  return {
    id: row.id,
    company: row.company,
    position: row.position,
    location: row.location,
    start_date: dateOnly(row.startDate)!,
    end_date: dateOnly(row.endDate),
    is_current: row.isCurrent,
    summary: row.summary ?? "",
    responsibilities: row.responsibilities,
    achievements: row.achievements,
    technologies: row.technologies,
    sort_order: row.sortOrder,
    created_at: iso(row.createdAt)!,
    updated_at: iso(row.updatedAt)!,
  };
}

function mapEducation(row: DbEducation): Education {
  return {
    id: row.id,
    school: row.school,
    degree: row.degree,
    field: row.field,
    location: row.location,
    start_year: row.startYear,
    end_year: row.endYear,
    note: row.note,
    sort_order: row.sortOrder,
  };
}

function mapSkillCategory(row: DbSkillCategory): SkillCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sort_order: row.sortOrder,
  };
}

function mapSkill(row: DbSkill): Skill {
  return {
    id: row.id,
    category_id: row.categoryId ?? "",
    name: row.name,
    proficiency: row.proficiency,
    sort_order: row.sortOrder,
  };
}

function mapCaseStudy(row: DbCaseStudy): CaseStudy {
  return {
    id: row.id,
    project_id: row.projectId,
    challenge: row.challenge ?? "",
    discovery: row.discovery ?? "",
    requirements: row.requirements ?? "",
    strategy: row.strategy ?? "",
    execution: row.execution ?? "",
    collaboration: row.collaboration ?? "",
    solution: row.solution ?? "",
    results: row.results ?? "",
    lessons_learned: row.lessonsLearned ?? "",
    lifecycle_stages: row.lifecycleStages,
  };
}

function mapProjectImage(row: DbProjectImage): ProjectImage {
  return {
    id: row.id,
    project_id: row.projectId,
    url: row.url,
    alt: row.alt,
    sort_order: row.sortOrder,
  };
}

type ProjectWithRelations = DbProject & {
  categoryLinks?: { category: { name: string } }[];
  images?: DbProjectImage[];
  caseStudy?: DbCaseStudy | null;
};

function mapProject(row: ProjectWithRelations): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    short_description: row.shortDescription ?? "",
    role: row.role ?? "",
    industry: row.industry ?? "",
    cover_image: row.coverImage,
    external_url: row.externalUrl,
    technologies: row.technologies,
    responsibilities: row.responsibilities,
    achievements: row.achievements,
    categories: (row.categoryLinks ?? []).map((l) => l.category.name),
    status: row.status === "published" ? "published" : "draft",
    featured: row.featured,
    sort_order: row.sortOrder,
    published_at: iso(row.publishedAt),
    created_at: iso(row.createdAt)!,
    updated_at: iso(row.updatedAt)!,
    images: (row.images ?? []).map(mapProjectImage),
    case_study: row.caseStudy ? mapCaseStudy(row.caseStudy) : null,
  };
}

type PostWithRelations = DbBlogPost & {
  category?: DbBlogCategory | null;
  tags?: { tag: { name: string } }[];
};

function mapPost(row: PostWithRelations): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    content: row.content ?? "",
    cover_image: row.coverImage,
    category_id: row.categoryId,
    category: row.category
      ? { id: row.category.id, name: row.category.name, slug: row.category.slug }
      : null,
    tags: (row.tags ?? []).map((t) => t.tag.name),
    reading_time: row.readingTime,
    status: row.status === "published" ? "published" : "draft",
    seo_title: row.seoTitle,
    seo_description: row.seoDescription,
    published_at: iso(row.publishedAt),
    created_at: iso(row.createdAt)!,
    updated_at: iso(row.updatedAt)!,
    views: row.views,
  };
}

function mapMessage(row: DbContactMessage): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    status:
      row.status === "read"
        ? "read"
        : row.status === "archived"
          ? "archived"
          : "unread",
    created_at: iso(row.createdAt)!,
  };
}

function mapMedia(row: DbMedia): MediaItem {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    path: row.path,
    mime_type: row.mimeType ?? "application/octet-stream",
    size: Number(row.size),
    alt: row.alt,
    created_at: iso(row.createdAt)!,
  };
}

function mapSettings(row: DbSiteSettings): SiteSettings {
  return {
    id: row.id,
    site_title: row.siteTitle ?? "",
    site_description: row.siteDescription ?? "",
    og_image: row.ogImage,
    twitter_handle: row.twitterHandle,
    contact_email: row.contactEmail ?? "",
    linkedin_url: row.linkedinUrl,
    github_url: row.githubUrl,
    show_admin_link: row.showAdminLink,
  };
}

const projectInclude = {
  categoryLinks: { include: { category: true } },
  images: { orderBy: { sortOrder: "asc" as const } },
  caseStudy: true,
};

const postInclude = {
  category: true,
  tags: { include: { tag: true } },
};

export async function dbGetProfile(): Promise<Profile> {
  const row = await prisma.profile.findFirst({ orderBy: { updatedAt: "desc" } });
  if (!row) throw new Error("No profile in database. Run: npm run db:seed");
  return mapProfile(row);
}

export async function dbGetExperiences(): Promise<Experience[]> {
  const rows = await prisma.experience.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map(mapExperience);
}

export async function dbGetEducations(): Promise<Education[]> {
  const rows = await prisma.education.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map(mapEducation);
}

export async function dbGetPublishedProjects(filter?: string): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { status: "published" },
    include: projectInclude,
    orderBy: { sortOrder: "asc" },
  });
  let list = rows.map(mapProject);
  if (filter && filter !== "All") {
    list = list.filter((p) => p.categories.includes(filter));
  }
  return list;
}

export async function dbGetAllProjects(): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    include: projectInclude,
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(mapProject);
}

export async function dbGetProjectBySlug(slug: string): Promise<Project | null> {
  const row = await prisma.project.findFirst({
    where: { slug, status: "published" },
    include: projectInclude,
  });
  return row ? mapProject(row) : null;
}

export async function dbGetProjectById(id: string): Promise<Project | null> {
  const row = await prisma.project.findUnique({
    where: { id },
    include: projectInclude,
  });
  return row ? mapProject(row) : null;
}

export async function dbGetPublishedPosts(): Promise<BlogPost[]> {
  const rows = await prisma.blogPost.findMany({
    where: { status: "published" },
    include: postInclude,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(mapPost);
}

export async function dbGetAllPosts(): Promise<BlogPost[]> {
  const rows = await prisma.blogPost.findMany({
    include: postInclude,
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(mapPost);
}

export async function dbGetBlogCategories(): Promise<BlogCategory[]> {
  const rows = await prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
  return rows.map((r) => ({ id: r.id, name: r.name, slug: r.slug }));
}

export async function dbGetPostBySlug(slug: string): Promise<BlogPost | null> {
  const row = await prisma.blogPost.findFirst({
    where: { slug, status: "published" },
    include: postInclude,
  });
  return row ? mapPost(row) : null;
}

export async function dbGetPostById(id: string): Promise<BlogPost | null> {
  const row = await prisma.blogPost.findUnique({
    where: { id },
    include: postInclude,
  });
  return row ? mapPost(row) : null;
}

export async function dbGetRelatedPosts(
  post: BlogPost,
  limit = 3,
): Promise<BlogPost[]> {
  const posts = await dbGetPublishedPosts();
  return posts
    .filter((p) => p.id !== post.id)
    .filter(
      (p) =>
        p.category_id === post.category_id ||
        p.tags.some((t) => post.tags.includes(t)),
    )
    .slice(0, limit);
}

export async function dbGetSkills(): Promise<{
  categories: SkillCategory[];
  skills: Skill[];
}> {
  const [categories, skills] = await Promise.all([
    prisma.skillCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.skill.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return {
    categories: categories.map(mapSkillCategory),
    skills: skills.map(mapSkill),
  };
}

export async function dbGetMessages(): Promise<ContactMessage[]> {
  const rows = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapMessage);
}

export async function dbGetMedia(): Promise<MediaItem[]> {
  const rows = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(mapMedia);
}

export async function dbGetSettings(): Promise<SiteSettings> {
  const row = await prisma.siteSettings.findFirst();
  if (!row) throw new Error("No site settings. Run: npm run db:seed");
  return mapSettings(row);
}

export async function dbGetSiteCopy(): Promise<SiteCopy> {
  const row = await prisma.siteCopyRow.findFirst({ orderBy: { updatedAt: "desc" } });
  if (!row) return seedSiteCopy;
  return { ...seedSiteCopy, ...(row.data as Partial<SiteCopy>) };
}

export async function dbGetDashboardStats(): Promise<DashboardStats> {
  const [
    totalProjects,
    publishedProjects,
    totalPosts,
    publishedPosts,
    contactMessages,
    unreadMessages,
    viewsAgg,
    mediaCount,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "published" } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: "published" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: "unread" } }),
    prisma.blogPost.aggregate({ _sum: { views: true } }),
    prisma.media.count(),
  ]);

  return {
    totalProjects,
    publishedProjects,
    totalPosts,
    publishedPosts,
    contactMessages,
    unreadMessages,
    totalViews: viewsAgg._sum.views ?? 0,
    mediaCount,
  };
}

export async function dbCreateContactMessage(
  input: Omit<ContactMessage, "id" | "status" | "created_at">,
): Promise<ContactMessage> {
  const row = await prisma.contactMessage.create({
    data: {
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      status: "unread",
    },
  });
  return mapMessage(row);
}

async function syncProjectCategories(projectId: string, names: string[]) {
  await prisma.projectCategoryLink.deleteMany({ where: { projectId } });
  for (const name of names) {
    const slug = slugify(name);
    const category = await prisma.projectCategory.upsert({
      where: { slug },
      create: { name, slug },
      update: { name },
    });
    await prisma.projectCategoryLink.create({
      data: { projectId, categoryId: category.id },
    });
  }
}

async function syncPostTags(postId: string, names: string[]) {
  await prisma.blogPostTag.deleteMany({ where: { postId } });
  for (const name of names) {
    const slug = slugify(name);
    const tag = await prisma.blogTag.upsert({
      where: { slug },
      create: { name, slug },
      update: { name },
    });
    await prisma.blogPostTag.create({
      data: { postId, tagId: tag.id },
    });
  }
}

export async function dbSaveProject(project: Project): Promise<Project> {
  const id = ensureUuid(project.id);
  const data = {
    title: project.title,
    slug: project.slug,
    shortDescription: project.short_description,
    role: project.role,
    industry: project.industry,
    coverImage: project.cover_image,
    externalUrl: project.external_url,
    technologies: project.technologies,
    responsibilities: project.responsibilities,
    achievements: project.achievements,
    status: project.status,
    featured: project.featured,
    sortOrder: project.sort_order,
    publishedAt: parseDate(project.published_at),
  };

  await prisma.project.upsert({
    where: { id },
    create: { id, ...data },
    update: data,
  });

  await syncProjectCategories(id, project.categories);

  await prisma.projectImage.deleteMany({ where: { projectId: id } });
  if (project.images?.length) {
    await prisma.projectImage.createMany({
      data: project.images.map((img, index) => ({
        id: ensureUuid(img.id),
        projectId: id,
        url: img.url,
        alt: img.alt,
        sortOrder: img.sort_order ?? index,
      })),
    });
  }

  if (project.case_study) {
    const cs = project.case_study;
    await prisma.caseStudy.upsert({
      where: { projectId: id },
      create: {
        id: ensureUuid(cs.id),
        projectId: id,
        challenge: cs.challenge,
        discovery: cs.discovery,
        requirements: cs.requirements,
        strategy: cs.strategy,
        execution: cs.execution,
        collaboration: cs.collaboration,
        solution: cs.solution,
        results: cs.results,
        lessonsLearned: cs.lessons_learned,
        lifecycleStages: cs.lifecycle_stages,
      },
      update: {
        challenge: cs.challenge,
        discovery: cs.discovery,
        requirements: cs.requirements,
        strategy: cs.strategy,
        execution: cs.execution,
        collaboration: cs.collaboration,
        solution: cs.solution,
        results: cs.results,
        lessonsLearned: cs.lessons_learned,
        lifecycleStages: cs.lifecycle_stages,
      },
    });
  }

  return (await dbGetProjectById(id))!;
}

export async function dbDeleteProject(id: string): Promise<void> {
  await prisma.project.delete({ where: { id } });
}

export async function dbSavePost(post: BlogPost): Promise<BlogPost> {
  const id = ensureUuid(post.id);
  let categoryId = post.category_id;
  if (categoryId && !isUuid(categoryId)) categoryId = null;

  const data = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.cover_image,
    categoryId,
    readingTime: post.reading_time,
    status: post.status,
    seoTitle: post.seo_title,
    seoDescription: post.seo_description,
    publishedAt: parseDate(post.published_at),
    views: post.views,
  };

  await prisma.blogPost.upsert({
    where: { id },
    create: { id, ...data },
    update: data,
  });

  await syncPostTags(id, post.tags);
  return (await dbGetPostById(id))!;
}

export async function dbDeletePost(id: string): Promise<void> {
  await prisma.blogPost.delete({ where: { id } });
}

export async function dbSaveExperience(exp: Experience): Promise<Experience> {
  const id = ensureUuid(exp.id);
  const start = parseDate(exp.start_date);
  if (!start) throw new Error("Invalid start_date");

  const data = {
    company: exp.company,
    position: exp.position,
    location: exp.location,
    startDate: start,
    endDate: parseDate(exp.end_date),
    isCurrent: exp.is_current,
    summary: exp.summary,
    responsibilities: exp.responsibilities,
    achievements: exp.achievements,
    technologies: exp.technologies,
    sortOrder: exp.sort_order,
  };

  const row = await prisma.experience.upsert({
    where: { id },
    create: { id, ...data },
    update: data,
  });
  return mapExperience(row);
}

export async function dbDeleteExperience(id: string): Promise<void> {
  await prisma.experience.delete({ where: { id } });
}

export async function dbSaveEducations(items: Education[]): Promise<Education[]> {
  await prisma.$transaction(async (tx) => {
    await tx.education.deleteMany();
    if (items.length) {
      await tx.education.createMany({
        data: items.map((e) => ({
          id: ensureUuid(e.id),
          school: e.school,
          degree: e.degree,
          field: e.field,
          location: e.location,
          startYear: e.start_year,
          endYear: e.end_year,
          note: e.note,
          sortOrder: e.sort_order,
        })),
      });
    }
  });
  return dbGetEducations();
}

export async function dbSaveSkill(skill: Skill): Promise<Skill> {
  const id = ensureUuid(skill.id);
  const categoryId = isUuid(skill.category_id) ? skill.category_id : null;
  const row = await prisma.skill.upsert({
    where: { id },
    create: {
      id,
      categoryId,
      name: skill.name,
      proficiency: skill.proficiency,
      sortOrder: skill.sort_order,
    },
    update: {
      categoryId,
      name: skill.name,
      proficiency: skill.proficiency,
      sortOrder: skill.sort_order,
    },
  });
  return mapSkill(row);
}

export async function dbDeleteSkill(id: string): Promise<void> {
  await prisma.skill.delete({ where: { id } });
}

export async function dbUpdateMessageStatus(
  id: string,
  status: ContactMessage["status"],
): Promise<void> {
  await prisma.contactMessage.update({ where: { id }, data: { status } });
}

export async function dbSaveMedia(item: MediaItem): Promise<MediaItem> {
  const id = ensureUuid(item.id);
  const row = await prisma.media.upsert({
    where: { id },
    create: {
      id,
      name: item.name,
      url: item.url,
      path: item.path,
      mimeType: item.mime_type,
      size: BigInt(item.size || 0),
      alt: item.alt,
    },
    update: {
      name: item.name,
      url: item.url,
      path: item.path,
      mimeType: item.mime_type,
      size: BigInt(item.size || 0),
      alt: item.alt,
    },
  });
  return mapMedia(row);
}

export async function dbDeleteMedia(id: string): Promise<void> {
  await prisma.media.delete({ where: { id } });
}

export async function dbDeleteMessage(id: string): Promise<void> {
  await prisma.contactMessage.delete({ where: { id } });
}

export async function dbSaveSettings(settings: SiteSettings): Promise<SiteSettings> {
  const id = ensureUuid(settings.id);
  const data = {
    siteTitle: settings.site_title,
    siteDescription: settings.site_description,
    ogImage: settings.og_image,
    twitterHandle: settings.twitter_handle,
    contactEmail: settings.contact_email,
    linkedinUrl: settings.linkedin_url,
    githubUrl: settings.github_url,
    showAdminLink: settings.show_admin_link,
  };
  const row = await prisma.siteSettings.upsert({
    where: { id },
    create: { id, ...data },
    update: data,
  });
  return mapSettings(row);
}

export async function dbSaveProfile(next: Profile): Promise<Profile> {
  const id = ensureUuid(next.id);
  const data = {
    fullName: next.full_name,
    role: next.role,
    tagline: next.tagline,
    headline: next.headline,
    bio: next.bio,
    aboutTitleLines: next.about_title_lines,
    statusText: next.status_text,
    email: next.email,
    location: next.location,
    resumeUrl: next.resume_url,
    avatarUrl: next.avatar_url,
    yearsIt: next.years_it,
    yearsDev: next.years_dev,
    yearsPm: next.years_pm,
    industryFocus: next.industry_focus,
  };
  const row = await prisma.profile.upsert({
    where: { id },
    create: { id, ...data },
    update: data,
  });
  return mapProfile(row);
}

export async function dbSaveSiteCopy(next: SiteCopy): Promise<SiteCopy> {
  const existing = await prisma.siteCopyRow.findFirst({ orderBy: { updatedAt: "desc" } });
  const payload = next as unknown as object;
  if (existing) {
    await prisma.siteCopyRow.update({
      where: { id: existing.id },
      data: { data: payload },
    });
  } else {
    await prisma.siteCopyRow.create({ data: { data: payload } });
  }
  return next;
}
