"use server";

import { revalidatePath } from "next/cache";
import {
  deleteExperience,
  deleteMedia,
  deleteMessage,
  deletePost,
  deleteProject,
  deleteSkill,
  getMedia,
  saveExperience,
  saveMedia,
  savePost,
  saveProfile,
  saveProject,
  saveSettings,
  saveSkill,
  saveEducations,
  saveSiteCopy,
  updateMessageStatus,
} from "@/lib/data/content";
import {
  deleteFromMediaBucket,
  isSupabaseStorageConfigured,
} from "@/lib/supabase/storage";
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
} from "@/types";

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/experience");
  revalidatePath("/admin/skills");
  revalidatePath("/admin/messages");
  revalidatePath("/admin/media");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/blog");
  revalidatePath("/contact");
}

export async function upsertProjectAction(project: Project) {
  const saved = await saveProject(project);
  revalidateAdmin();
  return saved;
}

export async function deleteProjectAction(id: string) {
  await deleteProject(id);
  revalidateAdmin();
}

export async function upsertPostAction(post: BlogPost) {
  const saved = await savePost(post);
  revalidateAdmin();
  return saved;
}

export async function deletePostAction(id: string) {
  await deletePost(id);
  revalidateAdmin();
}

export async function upsertExperienceAction(exp: Experience) {
  const saved = await saveExperience(exp);
  revalidateAdmin();
  return saved;
}

export async function deleteExperienceAction(id: string) {
  await deleteExperience(id);
  revalidateAdmin();
}

export async function upsertSkillAction(skill: Skill) {
  const saved = await saveSkill(skill);
  revalidateAdmin();
  return saved;
}

export async function deleteSkillAction(id: string) {
  await deleteSkill(id);
  revalidateAdmin();
}

export async function updateMessageStatusAction(
  id: string,
  status: ContactMessage["status"],
) {
  await updateMessageStatus(id, status);
  revalidateAdmin();
}

export async function deleteMessageAction(id: string) {
  await deleteMessage(id);
  revalidateAdmin();
}

export async function upsertMediaAction(item: MediaItem) {
  const saved = await saveMedia(item);
  revalidateAdmin();
  return saved;
}

export async function deleteMediaAction(id: string) {
  if (isSupabaseStorageConfigured()) {
    const items = await getMedia();
    const item = items.find((m) => m.id === id);
    if (item?.path) {
      try {
        await deleteFromMediaBucket(item.path);
      } catch {
        // Row still removed even if storage object is already gone
      }
    }
  }
  await deleteMedia(id);
  revalidateAdmin();
}

export async function saveSettingsAction(settings: SiteSettings) {
  const saved = await saveSettings(settings);
  revalidateAdmin();
  return saved;
}

export async function saveProfileAction(profile: Profile) {
  const saved = await saveProfile(profile);
  revalidateAdmin();
  return saved;
}

export async function saveEducationsAction(items: Education[]) {
  const saved = await saveEducations(items);
  revalidateAdmin();
  return saved;
}

export async function saveSiteCopyAction(copy: SiteCopy) {
  const saved = await saveSiteCopy(copy);
  revalidateAdmin();
  return saved;
}
