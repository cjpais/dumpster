"use client";

import { DndContext } from "@dnd-kit/core";
import React from "react";
import Draggable from "./Draggable";
import Droppable from "./Droppable";
import useCanvasStore from "@/lib/useCanvas";
import MediaElement from "./Blocks";

const EditCanvas = () => {
  const { elements, updateElementPosition } = useCanvasStore();

  console.log(elements);

  const handleDragEnd = (event: any) => {
    const { active, delta, over } = event;
    if (over) {
      const position = elements[active.id].position;
      updateElementPosition(active.id, {
        x: position.x + delta.x,
        y: position.y + delta.y,
        z: position.z,
      });
    }
  };

  return (
    <div className="flex">
      <DndContext onDragEnd={handleDragEnd} id="context">
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
            {/* <div className="w-[100opx] h-[100px] bg-gray-400"></div> */}
            <MediaElement canvasElement={element} />
          </Draggable>
        ))}
        <Droppable id="canvas" className="w-full h-screen bg-slate-700" />
      </DndContext>
    </div>
  );
};

export default EditCanvas;
