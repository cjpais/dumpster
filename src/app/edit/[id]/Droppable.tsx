"use client";
import { useDroppable } from "@dnd-kit/core";
import React, { PropsWithChildren } from "react";

interface DroppableProps extends PropsWithChildren {
  id: string;
  className?: string;
}

const Droppable: React.FC<DroppableProps> = ({ children, id, className }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className={`${className}`}>
      {children}
    </div>
  );
};

export default Droppable;
