import type { Place, UserPlace } from "@prisma/client";

export type PlaceWithStatus = Place & {
  userStatus?: "wishlist" | "visited" | null;
};

export type UserPlaceWithPlace = UserPlace & {
  place: Place;
};

export type UserStats = {
  totalPlaces: number;
  visited: number;
  wishlist: number;
  progressPercent: number;
};
