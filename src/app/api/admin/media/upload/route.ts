import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-auth";
import { saveMedia } from "@/lib/data/content";
import {
  isSupabaseStorageConfigured,
  uploadToMediaBucket,
} from "@/lib/supabase/storage";

export async function POST(request: Request) {
  if (!(await requireAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const name = String(form.get("name") || "");
  const alt = String(form.get("alt") || "");
  const folder = String(form.get("folder") || "uploads").replace(/[^a-z0-9/_-]/gi, "");
  const saveToLibrary = String(form.get("library") || "1") !== "0";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: "File too large (max 10MB)" },
      { status: 400 },
    );
  }

  try {
    let url: string;
    let path: string;

    if (isSupabaseStorageConfigured()) {
      const uploaded = await uploadToMediaBucket(
        file,
        file.name,
        file.type,
        folder || "uploads",
      );
      url = uploaded.url;
      path = uploaded.path;
    } else {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      url = `data:${file.type || "application/octet-stream"};base64,${base64}`;
      path = file.name;
    }

    let item = null;
    if (saveToLibrary) {
      item = await saveMedia({
        id: crypto.randomUUID(),
        name: name.trim() || file.name,
        url,
        path,
        mime_type: file.type || "application/octet-stream",
        size: file.size,
        alt: alt.trim() || null,
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ url, path, item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
