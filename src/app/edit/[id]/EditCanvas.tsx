"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import React, { useState, useEffect, useRef } from "react";
import Draggable from "./Draggable";
import useCanvasStore from "@/lib/useCanvas";
import MediaElement from "./Blocks";

const EditCanvas = () => {
  const { elements, updateElementPosition } = useCanvasStore();
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const canvasRef = useRef(null);

  const handleCanvasClick = (event: React.MouseEvent<HTMLElement>) => {
    const isDraggableElement = (event.target as HTMLElement).closest(
      '[data-draggable="true"]'
    );
    if (!isDraggableElement) {
      setSelectedElement(null);
    }
  };

  function getRelativePosition(absoluteX: number, absoluteY: number) {
    const relativeX = absoluteX - window.innerWidth / 2;
    const relativeY = absoluteY;
    return { x: relativeX, y: relativeY };
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const position = elements[active.id].position;

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
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={(e) => {
        console.log(e);
        setSelectedElement(e.active.id as string);
      }}
      onDragCancel={() => setSelectedElement(null)}
    >
      <div
        className="relative min-h-screen w-full"
        ref={canvasRef}
        onClick={handleCanvasClick}
      >
        <div className="absolute inset-0">
          {Object.entries(elements).map(([id, element]) => (
            <div key={id} className="relative">
              <Draggable
                position={element.position}
                id={id}
                selected={selectedElement === id}
              >
                <div
                  data-draggable="true"
                  className={`relative ${
                    selectedElement === id
                      ? "outline outline-2 outline-blue-500"
                      : ""
                  }`}
                >
                  <MediaElement canvasElement={element} />
                </div>
              </Draggable>
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default EditCanvas;
