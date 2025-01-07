// src/components/DraggableItem.tsx
"use client";

import { useDraggable } from "@dnd-kit/core";

interface DraggableItemProps {
  id: string;
  x: number;
  y: number;
}

export default function DraggableItem({ x, y, id }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    "--x": `${x}px`,
    "--y": `${y}px`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      className="draggable-item bg-blue-500 w-20 h-20 cursor-move rounded-lg flex items-center justify-center text-white"
      style={style}
      {...listeners}
      {...attributes}
    >
      Item {id}
    </div>
  );
}
