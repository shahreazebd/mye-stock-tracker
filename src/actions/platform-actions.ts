"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { platforms } from "@/lib/db/schema";
import { uploadFileToS3 } from "./upload";

export async function getPlatforms() {
  try {
    const result = await db.select().from(platforms);
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to fetch platforms:", error);
    return { success: false, error: "Failed to fetch platforms", data: [] };
  }
}

export async function getPlatformById(id: string) {
  try {
    const result = await db.select().from(platforms).where(eq(platforms.id, id));
    return { success: true, data: result[0] || null };
  } catch (error) {
    console.error("Failed to fetch platform:", error);
    return { success: false, error: "Failed to fetch platform" };
  }
}

export async function upsertPlatform(formData: FormData) {
  try {
    const id = formData.get("id") as string | null;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const imageFile = formData.get("image") as File | null;

    // Validate required fields
    if (!name) {
      return { success: false, error: "Platform name is required" };
    }

    let imageUrl = null;

    // Upload image to S3 if provided
    if (imageFile && imageFile.size > 0) {
      const uploadResult = await uploadFileToS3({
        file: imageFile,
        path: "platforms",
      });
      imageUrl = uploadResult.url;
    }

    // check same name
    const existingPlatform = await getPlatformById(id ?? "");
    if (existingPlatform?.data?.name !== name) {
      const nameExists = await db
        .select()
        .from(platforms)
        .where(eq(platforms.name, name))
        .limit(1)
        .execute();
      if (nameExists.length > 0) {
        return { success: false, error: "Platform with this name already exists" };
      }
    }

    if (id) {
      // Update existing platform
      const updateData = {
        name,
        description,
        updatedAt: new Date(),
        ...(imageUrl && { image: imageUrl }),
      };

      const result = await db
        .update(platforms)
        .set(updateData)
        .where(eq(platforms.id, id))
        .returning();

      revalidatePath("/platforms");
      return { success: true, data: result[0] };
    }

    // Create new platform
    const result = await db
      .insert(platforms)
      .values({
        name,
        description,
        image: imageUrl ?? "",
      })
      .returning();

    revalidatePath("/platforms");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Failed to upsert platform:", error);
    return { success: false, error: "Failed to save platform" };
  }
}

export async function deletePlatform(id: string) {
  try {
    await db.delete(platforms).where(eq(platforms.id, id));
    revalidatePath("/platforms");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete platform:", error);
    return { success: false, error: "Failed to delete platform" };
  }
}
