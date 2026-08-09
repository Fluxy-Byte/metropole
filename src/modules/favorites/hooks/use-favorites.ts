"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite as toggleFavoriteAction } from "@/store/slices/favorites-slice";

export function useFavorites() {
  const dispatch = useAppDispatch();
  const houseIds = useAppSelector((state) => state.favorites.houseIds);

  const isFavorite = useCallback((houseId: string) => houseIds.includes(houseId), [houseIds]);
  const toggle = useCallback(
    (houseId: string) => dispatch(toggleFavoriteAction(houseId)),
    [dispatch],
  );

  return { houseIds, isFavorite, toggle, count: houseIds.length };
}
