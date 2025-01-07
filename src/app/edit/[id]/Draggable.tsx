"use client";
import { useDraggable } from "@dnd-kit/core";
import React, { PropsWithChildren } from "react";

interface DraggableProps extends PropsWithChildren {
  position: {
    x: number;
    y: number;
    z: number;
  };
  id: string;
}

const Draggable: React.FC<DraggableProps> = ({ children, id, position }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    "--x": `${position.x}px`,
    "--y": `${position.y}px`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  } as React.CSSProperties;

  return (
    <button
      ref={setNodeRef}
      className="draggable-item"
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </button>
  );
};

export default Draggable;
