import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FavoritesState {
  houseIds: string[];
  /** Set once the visitor's favorites have been migrated to the database. */
  migrated: boolean;
}

const initialState: FavoritesState = {
  houseIds: [],
  migrated: false,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      const id = action.payload;
      const index = state.houseIds.indexOf(id);
      if (index >= 0) {
        state.houseIds.splice(index, 1);
      } else {
        state.houseIds.push(id);
      }
    },
    addFavorite(state, action: PayloadAction<string>) {
      if (!state.houseIds.includes(action.payload)) {
        state.houseIds.push(action.payload);
      }
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.houseIds = state.houseIds.filter((id) => id !== action.payload);
    },
    clearFavorites(state) {
      state.houseIds = [];
      state.migrated = false;
    },
    markMigrated(state) {
      state.migrated = true;
    },
  },
});

export const { toggleFavorite, addFavorite, removeFavorite, clearFavorites, markMigrated } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
