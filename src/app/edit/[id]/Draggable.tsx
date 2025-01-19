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
  selected: boolean;
}

const Draggable: React.FC<DraggableProps> = ({
  children,
  id,
  position,
  selected,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    "--x": `${position.x}px`,
    "--y": `${position.y}px`,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    position: "relative",
  } as React.CSSProperties;

  const resizeHandleStyle = {
    position: "absolute",
    width: "10px",
    height: "10px",
    background: "#0066ff",
    border: "1px solid white",
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
      {selected && (
        <>
          <div
            style={{
              ...resizeHandleStyle,
              top: -5,
              left: -5,
              cursor: "nw-resize",
            }}
          />
          <div
            style={{
              ...resizeHandleStyle,
              top: -5,
              right: -5,
              cursor: "ne-resize",
            }}
          />
          <div
            style={{
              ...resizeHandleStyle,
              bottom: -5,
              left: -5,
              cursor: "sw-resize",
            }}
          />
          <div
            style={{
              ...resizeHandleStyle,
              bottom: -5,
              right: -5,
              cursor: "se-resize",
            }}
          />
          <div
            style={{
              ...resizeHandleStyle,
              top: -5,
              left: "50%",
              transform: "translateX(-50%)",
              cursor: "n-resize",
            }}
          />
          <div
            style={{
              ...resizeHandleStyle,
              bottom: -5,
              left: "50%",
              transform: "translateX(-50%)",
              cursor: "s-resize",
            }}
          />
          <div
            style={{
              ...resizeHandleStyle,
              left: -5,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "w-resize",
            }}
          />
          <div
            style={{
              ...resizeHandleStyle,
              right: -5,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "e-resize",
            }}
          />
        </>
      )}
    </button>
  );
};

export default Draggable;
