"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import DraggableItem from "./DraggableItem";

interface DraggableItemType {
  id: string;
  x: number;
  y: number;
}

export default function DragDropPage() {
  const [items, setItems] = useState<DraggableItemType[]>([
    { id: "1", x: 0, y: 0 },
    { id: "2", x: 100, y: 50 },
    { id: "3", x: 200, y: 100 },
  ]);

  function getRelativePosition(absoluteX: number, absoluteY: number) {
    const guideContainer = document.getElementById("guide-container");
    if (!guideContainer) return { x: 0, y: 0 };

    const containerRect = guideContainer.getBoundingClientRect();
    const relativeX = absoluteX - containerRect.left;
    const relativeY = absoluteY - containerRect.top;

    return { x: relativeX, y: relativeY };
  }

  function handleDragEnd(event: DragEndEvent) {
    console.log(event);
    const { active, delta } = event;

    const newItems = items.map((item) => {
      if (item.id === active.id) {
        const newX = item.x + delta.x;
        const newY = item.y + delta.y;

        // Get and log relative position
        if (!active.rect.current.translated) return item;
        const relativePos = getRelativePosition(
          active.rect.current.translated.left,
          active.rect.current.translated.top
        );
        console.log("Relative position:", relativePos);

        return {
          ...item,
          x: newX,
          y: newY,
        };
      }
      return item;
    });

    setItems(newItems);
  }

  return (
    <DndContext onDragEnd={handleDragEnd} id="context">
      <div className="drag-drop-container relative min-h-screen">
        <div
          id="guide-container"
          className="relative mx-auto w-[600px] min-h-screen border-x border-gray-300"
        >
          <div className="position-context">
            {items.map((item) => (
              <DraggableItem key={item.id} id={item.id} x={item.x} y={item.y} />
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
