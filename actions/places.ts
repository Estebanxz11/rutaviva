"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function togglePlaceStatus(
  placeId: string,
  status: "wishlist" | "visited"
) {
  const user = await requireAuth();

  const existing = await db.userPlace.findUnique({
    where: { userId_placeId: { userId: user.id!, placeId } },
  });

  if (existing) {
    if (existing.status === status) {
      // Remove if clicking same status
      await db.userPlace.delete({ where: { id: existing.id } });
    } else {
      // Update to new status
      await db.userPlace.update({
        where: { id: existing.id },
        data: { status },
      });
    }
  } else {
    await db.userPlace.create({
      data: { userId: user.id!, placeId, status },
    });
  }

  revalidatePath("/my-places");
  revalidatePath(`/places/[slug]`, "page");
}

export async function getUserPlaces(userId: string) {
  return db.userPlace.findMany({
    where: { userId },
    include: { place: true },
    orderBy: { updatedAt: "desc" },
  });
}
