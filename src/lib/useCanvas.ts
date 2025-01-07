import { create } from "zustand";
import { CanvasElement, CanvasPosition } from "./types";

type CanvasState = {
  elements: Record<string, CanvasElement>;
  addElement: (params: CanvasElement) => void;
  addElements: (elements: CanvasElement[]) => void;
  updateElementPosition: (id: string, position: CanvasPosition) => void;
  removeElement: (id: string) => void;
  setElementSelected: (id: string, isSelected: boolean) => void;
  setElementEditing: (id: string, isEditing: boolean) => void;
};

const useCanvasStore = create<CanvasState>()((set) => ({
  elements: {},
  addElement: (element) =>
    set((state) => ({
      elements: {
        ...state.elements,
        [element.id]: element,
      },
    })),
  addElements: (newElements) =>
    set((state) => ({
      elements: {
        ...state.elements,
        ...newElements.reduce(
          (acc, element) => ({
            ...acc,
            [element.id]: {
              ...element,
              isSelected: element.isSelected ?? true,
              isEditing: element.isEditing ?? false,
              content: element.content ?? "",
              url: element.url ?? "",
            },
          }),
          {}
        ),
      },
    })),
  updateElementPosition: (id, position) =>
    set((state) => ({
      elements: {
        ...state.elements,
        [id]: {
          ...state.elements[id],
          position,
        },
      },
    })),
  removeElement: (id) =>
    set((state) => {
      const newElements = { ...state.elements };
      delete newElements[id];
      return { elements: newElements };
    }),
  setElementSelected: (id, isSelected) =>
    set((state) => ({
      elements: {
        ...state.elements,
        [id]: {
          ...state.elements[id],
          isSelected,
        },
      },
    })),
  setElementEditing: (id, isEditing) =>
    set((state) => ({
      elements: {
        ...state.elements,
        [id]: {
          ...state.elements[id],
          isEditing,
        },
      },
    })),
}));

export default useCanvasStore;
