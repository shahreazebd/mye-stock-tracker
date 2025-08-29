"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { stores } from "@/lib/db/schema";

export async function getStores() {
  try {
    const result = await db.select().from(stores);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching stores:", error);
    return { success: false, error: "Failed to fetch stores", data: [] };
  }
}

export async function getStoreById(id: string) {
  try {
    const result = await db.select().from(stores).where(eq(stores.id, id));
    return { success: true, data: result[0] || null };
  } catch (error) {
    console.error("Error fetching store:", error);
    return { success: false, error: "Failed to fetch store", data: null };
  }
}

export async function upsertStore(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const platform = formData.get("platform") as string;
    const description = formData.get("description") as string;

    revalidatePath("/stores");
    return {
      success: true,
      data: { id: id || "new-id", name, url, platform, description },
    };
  } catch (error) {
    console.error("Error upserting store:", error);
    return {
      success: false,
      error: "Failed to save store",
    };
  }
}

export async function deleteStore(id: string) {
  try {
    // Replace with your actual database operation
    console.log("Deleting store:", id);

    revalidatePath("/stores");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting store:", error);
    return {
      success: false,
      error: "Failed to delete store",
    };
  }
}
