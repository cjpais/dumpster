"use client";
import { useDraggable } from "@dnd-kit/core";
import React, { PropsWithChildren } from "react";
import { CSS } from "@dnd-kit/utilities";

interface DraggableProps extends PropsWithChildren {
  position: {
    x: number;
    y: number;
    z: number;
  };
  id: string;
  styles?: React.CSSProperties;
}

const Draggable: React.FC<DraggableProps> = ({
  children,
  id,
  position,
  styles,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        boxShadow: "0 5px 15px rgba(0,0,0,1)",
      }
    : {};

  return (
    <button
      ref={setNodeRef}
      style={{ ...style, ...styles }}
      {...listeners}
      {...attributes}
    >
      {children}
    </button>
  );
};

export default Draggable;
