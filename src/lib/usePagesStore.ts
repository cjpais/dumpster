import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LocalPage } from "./types";

interface PagesStore {
  pages: LocalPage[];
  upsertPage: (page: LocalPage) => void;
  deletePage: (id: number) => void;
  updateLastVisited: (id: number, time: number) => void;
}

const usePagesStore = create<PagesStore>()(
  persist(
    (set) => ({
      pages: [],
      upsertPage: (page) =>
        set((state) => ({
          pages: state.pages.some((p) => p.id === page.id)
            ? state.pages.map((p) =>
                p.id === page.id ? { ...page, lastVisited: Date.now() } : p
              )
            : [...state.pages, { ...page, lastVisited: Date.now() }],
        })),
      deletePage: (id) =>
        set((state) => ({
          pages: state.pages.filter((p) => p.id !== id),
        })),
      updateLastVisited: (id, time) =>
        set((state) => ({
          pages: state.pages.map((p) =>
            p.id === id ? { ...p, lastVisited: time } : p
          ),
        })),
    }),
    {
      name: "pages-store-v1",
    }
  )
);

export default usePagesStore;
