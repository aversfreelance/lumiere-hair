import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveAdminImage, validateImageFile, type UploadFolder } from "@/lib/upload-image";

function parseFolder(value: FormDataEntryValue | null): UploadFolder {
  return value === "gallery" ? "gallery" : "stylists";
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = parseFolder(formData.get("folder"));

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const url = await saveAdminImage(file, folder);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
