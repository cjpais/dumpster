"use client";

import { DndContext } from "@dnd-kit/core";
import React, { useEffect, useState } from "react";
import Draggable from "./Draggable";
import Droppable from "./Droppable";

const EditCanvas = () => {
  const [draggablePositions, setDraggablePositions] = useState<any[]>([]);

  useEffect(() => {
    // Generate random positions only on the client side
    const initialPositions = [
      { id: "1", x: Math.random() * 300, y: Math.random() * 300, z: 1 },
      { id: "2", x: Math.random() * 300, y: Math.random() * 300, z: 1 },
      { id: "3", x: Math.random() * 300, y: Math.random() * 300, z: 1 },
    ];
    setDraggablePositions(initialPositions);
  }, []);

  const handleDragEnd = (event: any) => {
    console.log(event);
    const { active, delta, over } = event;
    if (over) {
      setDraggablePositions((positions) =>
        positions.map((pos) =>
          pos.id === active.id
            ? {
                ...pos,
                x: pos.x + delta.x,
                y: pos.y + delta.y,
              }
            : pos
        )
      );
    }
  };

  return (
    <div className="flex">
      <DndContext onDragEnd={handleDragEnd} id="context">
        {draggablePositions.map((position, i) => (
          <Draggable
            key={position.id}
            position={position}
            id={position.id}
            styles={{
              position: "absolute",
              left: position.x,
              top: position.y,
            }}
          >
            <img
              height={100}
              width={100}
              src={`https://cappy.space/cappy/cappy${i + 1}.jpeg`}
            />
          </Draggable>
        ))}
        <Droppable
          id="palette"
          className="w-96 h-screen bg-pink-300"
        ></Droppable>
        <Droppable id="canvas" className="w-full h-screen bg-slate-700" />
      </DndContext>
    </div>
  );
};

export default EditCanvas;
