"use client";

import { DndContext } from "@dnd-kit/core";
import React, { useState } from "react";
import Draggable from "./Draggable";
import Droppable from "./Droppable";
import { ImageSidebar } from "./ImageSidebar";
import { useImageUpload } from "@/hooks/useImageUpload";

interface DraggableItem {
  id: string;
  x: number;
  y: number;
  type: "image";
  url: string;
}

const EditCanvas = ({ pageId }: { pageId: string }) => {
  const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([]);
  const { uploadImage } = useImageUpload(pageId);

  const handleDragEnd = (event: any) => {
    const { active, delta, over } = event;
    
    if (over?.id === "canvas") {
      // If it's a new image from the sidebar
      if (active.data?.current?.type === "image" && !draggableItems.find(item => item.id === active.id)) {
        setDraggableItems(items => [...items, {
          id: active.id,
          x: event.over.rect.left + delta.x,
          y: event.over.rect.top + delta.y,
          type: "image",
          url: active.data.current.url
        }]);
      } else {
        // Update position of existing item
        setDraggableItems((items) =>
          items.map((item) =>
            item.id === active.id
              ? {
                  ...item,
                  x: item.x + delta.x,
                  y: item.y + delta.y,
                }
              : item
          )
        );
      }
    }
  };

  return (
    <div className="flex">
      <DndContext onDragEnd={handleDragEnd}>
        <ImageSidebar onImageUpload={uploadImage} />
        
        {draggableItems.map((item) => (
          <Draggable
            key={item.id}
            id={item.id}
            data={{ type: item.type, url: item.url }}
            styles={{
              position: "absolute",
              left: item.x,
              top: item.y,
              zIndex: 10,
            }}
          >
            <img
              src={item.url}
              alt=""
              className="w-24 h-24 object-cover rounded-lg shadow-lg"
            />
          </Draggable>
        ))}
        
        <Droppable
          id="canvas"
          className="flex-1 h-screen bg-slate-700 relative"
        />
      </DndContext>
    </div>
  );
};

export default EditCanvas;
