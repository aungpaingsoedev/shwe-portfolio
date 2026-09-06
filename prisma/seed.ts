import { PrismaClient } from "@prisma/client";
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
} from "../src/lib/data/seed";

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function main() {
  console.log("Seeding Supabase via Prisma…");

  // Clear in FK-safe order
  await prisma.blogPostTag.deleteMany();
  await prisma.projectCategoryLink.deleteMany();
  await prisma.projectImage.deleteMany();
  await prisma.caseStudy.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.blogTag.deleteMany();
  await prisma.blogCategory.deleteMany();
  await prisma.project.deleteMany();
  await prisma.projectCategory.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.media.deleteMany();
  await prisma.siteCopyRow.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.profile.deleteMany();

  const categoryIdMap = new Map<string, string>();
  for (const cat of skillCategories) {
    const row = await prisma.skillCategory.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sort_order,
      },
    });
    categoryIdMap.set(cat.id, row.id);
  }

  for (const skill of skills) {
    await prisma.skill.create({
      data: {
        name: skill.name,
        proficiency: skill.proficiency,
        sortOrder: skill.sort_order,
        categoryId: categoryIdMap.get(skill.category_id) ?? null,
      },
    });
  }

  await prisma.profile.create({
    data: {
      fullName: profile.full_name,
      role: profile.role,
      tagline: profile.tagline,
      headline: profile.headline,
      bio: profile.bio,
      aboutTitleLines: profile.about_title_lines,
      statusText: profile.status_text,
      email: profile.email,
      location: profile.location,
      resumeUrl: profile.resume_url,
      avatarUrl: profile.avatar_url,
      yearsIt: profile.years_it,
      yearsDev: profile.years_dev,
      yearsPm: profile.years_pm,
      industryFocus: profile.industry_focus,
    },
  });

  for (const exp of experiences) {
    const start = parseDate(exp.start_date);
    if (!start) continue;
    await prisma.experience.create({
      data: {
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
      },
    });
  }

  for (const edu of educations) {
    await prisma.education.create({
      data: {
        school: edu.school,
        degree: edu.degree,
        field: edu.field,
        location: edu.location,
        startYear: edu.start_year,
        endYear: edu.end_year,
        note: edu.note,
        sortOrder: edu.sort_order,
      },
    });
  }

  for (const project of projects) {
    const row = await prisma.project.create({
      data: {
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
      },
    });

    for (const name of project.categories) {
      const slug = slugify(name);
      const category = await prisma.projectCategory.upsert({
        where: { slug },
        create: { name, slug },
        update: { name },
      });
      await prisma.projectCategoryLink.create({
        data: { projectId: row.id, categoryId: category.id },
      });
    }

    if (project.images?.length) {
      await prisma.projectImage.createMany({
        data: project.images.map((img, index) => ({
          projectId: row.id,
          url: img.url,
          alt: img.alt,
          sortOrder: img.sort_order ?? index,
        })),
      });
    }

    if (project.case_study) {
      const cs = project.case_study;
      await prisma.caseStudy.create({
        data: {
          projectId: row.id,
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
  }

  const blogCatMap = new Map<string, string>();
  for (const cat of blogCategories) {
    const row = await prisma.blogCategory.create({
      data: { name: cat.name, slug: cat.slug },
    });
    blogCatMap.set(cat.id, row.id);
  }

  for (const post of blogPosts) {
    const row = await prisma.blogPost.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.cover_image,
        categoryId: post.category_id
          ? (blogCatMap.get(post.category_id) ?? null)
          : null,
        readingTime: post.reading_time,
        status: post.status,
        seoTitle: post.seo_title,
        seoDescription: post.seo_description,
        publishedAt: parseDate(post.published_at),
        views: post.views,
      },
    });

    for (const name of post.tags) {
      const slug = slugify(name);
      const tag = await prisma.blogTag.upsert({
        where: { slug },
        create: { name, slug },
        update: { name },
      });
      await prisma.blogPostTag.create({
        data: { postId: row.id, tagId: tag.id },
      });
    }
  }

  for (const msg of contactMessages) {
    await prisma.contactMessage.create({
      data: {
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        status: msg.status,
        createdAt: parseDate(msg.created_at) ?? new Date(),
      },
    });
  }

  for (const item of mediaItems) {
    await prisma.media.create({
      data: {
        name: item.name,
        url: item.url,
        path: item.path,
        mimeType: item.mime_type,
        size: BigInt(item.size || 0),
        alt: item.alt,
      },
    });
  }

  await prisma.siteSettings.create({
    data: {
      siteTitle: siteSettings.site_title,
      siteDescription: siteSettings.site_description,
      ogImage: siteSettings.og_image,
      twitterHandle: siteSettings.twitter_handle,
      contactEmail: siteSettings.contact_email,
      linkedinUrl: siteSettings.linkedin_url,
      githubUrl: siteSettings.github_url,
      showAdminLink: siteSettings.show_admin_link,
    },
  });

  await prisma.siteCopyRow.create({
    data: { data: siteCopy as object },
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
