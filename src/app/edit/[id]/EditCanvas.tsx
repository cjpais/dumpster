"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import React from "react";
import Draggable from "./Draggable";
import useCanvasStore from "@/lib/useCanvas";
import MediaElement from "./Blocks";

const EditCanvas = () => {
  const { elements, updateElementPosition } = useCanvasStore();

  function getRelativePosition(absoluteX: number, absoluteY: number) {
    // Calculate position relative to vertical center line
    const relativeX = absoluteX - window.innerWidth / 2;
    const relativeY = absoluteY;

    return { x: relativeX, y: relativeY };
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const position = elements[active.id].position;

    // Get and log relative position
    if (!active.rect.current.translated) return;
    const relativePos = getRelativePosition(
      active.rect.current.translated.left,
      active.rect.current.translated.top
    );
    console.log("Relative position:", relativePos);

    updateElementPosition(active.id as string, {
      x: position.x + delta.x,
      y: position.y + delta.y,
      z: position.z,
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="relative min-h-screen w-full">
        <div className="absolute inset-0">
          {Object.entries(elements).map(([id, element]) => (
            <Draggable key={id} position={element.position} id={id}>
              <MediaElement canvasElement={element} />
            </Draggable>
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default EditCanvas;
