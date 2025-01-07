"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import React from "react";
import Draggable from "./Draggable";
import Droppable from "./Droppable";
import useCanvasStore from "@/lib/useCanvas";
import MediaElement from "./Blocks";

const EditCanvas = () => {
  const { elements, updateElementPosition } = useCanvasStore();

  function getRelativePosition(absoluteX: number, absoluteY: number) {
    const guideContainer = document.getElementById("guide-container");
    if (!guideContainer) return { x: 0, y: 0 };

    const containerRect = guideContainer.getBoundingClientRect();
    const relativeX = absoluteX - containerRect.left;
    const relativeY = absoluteY - containerRect.top;

    return { x: relativeX, y: relativeY };
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (!active) return;

    const position = elements[active.id].position;
    
    // Calculate new position using delta first
    const newX = position.x + delta.x;
    const newY = position.y + delta.y;

    // Get and log relative position
    if (!active.rect.current.translated) return;
    const relativePos = getRelativePosition(
      active.rect.current.translated.left,
      active.rect.current.translated.top
    );
    console.log("Relative position:", relativePos);

    updateElementPosition(active.id, {
      x: newX,
      y: newY,
      z: position.z,
    });
  };

  return (
    <div className="drag-drop-container relative min-h-screen">
      <DndContext onDragEnd={handleDragEnd} id="context">
        <div
          id="guide-container"
          className="relative mx-auto w-[600px] min-h-screen border-x border-gray-300"
        >
          <div className="position-context">
            {Object.entries(elements).map(([id, element]) => (
              <Draggable
                key={id}
                position={element.position}
                id={id}
                styles={{
                  position: "absolute",
                  left: element.position.x,
                  top: element.position.y,
                }}
              >
                <MediaElement canvasElement={element} />
              </Draggable>
            ))}
            <Droppable id="canvas" className="absolute inset-0" />
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default EditCanvas;
