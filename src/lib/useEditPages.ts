import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EditPage {
  editId: string;
  id: string;
  slug: string;
}

interface EditPageStore {
  editPageList: EditPage[];
  addEditPage: (editId: string, id: string, slug: string) => void;
  removeEditPage: (editId: string) => void;
  clearEditPages: () => void;
}

const useEditPages = create<EditPageStore>()(
  persist(
    (set) => ({
      editPageList: [],
      addEditPage: (editId, id, slug) =>
        set((state) => ({
          editPageList: [...state.editPageList, { editId, id, slug }],
        })),
      removeEditPage: (editId) =>
        set((state) => ({
          editPageList: state.editPageList.filter(
            (item) => item.editId !== editId
          ),
        })),
      clearEditPages: () => set({ editPageList: [] }),
    }),
    {
      name: "edit-pages-storage",
    }
  )
);

export default useEditPages;
