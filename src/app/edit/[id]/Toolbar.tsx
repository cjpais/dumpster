"use client";

import { UploadMetadata } from "@/lib/types";
import useCanvasStore from "@/lib/useCanvas";
import React from "react";
import { v4 as uuidv4 } from "uuid";

const ToolbarButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all cursor-pointer"
    >
      {children}
    </button>
  );
};

const ToolbarFileInput = ({
  onChange,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <label className="px-4 py-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all cursor-pointer">
      Upload File
      <input type="file" className="hidden" onChange={onChange} />
    </label>
  );
};

const Toolbar = ({ editId }: { editId: string }) => {
  const { addElement, elements } = useCanvasStore();
  const handleAddText = () => {
    addElement({
      id: uuidv4(),
      contentId: uuidv4(),
      type: "text",
      position: {
        x: 50,
        y: 50,
        z: 1,
      },
      width: 200,
      height: 50,
      content: "Hello, World!",
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("No file selected");
      }
      if (e.target.files.length > 1) {
        throw new Error("Only one file can be uploaded at a time");
      }

      const file = e.target.files[0];
      const position = {
        x: 50,
        y: 50,
        z: 1,
      };

      const metadata: UploadMetadata = {
        editId,
        position: position,
      };
      const formData = new FormData();
      formData.append("file", file);
      formData.append("metadata", JSON.stringify(metadata));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();

      addElement({
        id: uuidv4(),
        contentId: data.contentId,
        type: "image",
        position,
        url: data.url,
        width: 200,
        height: 200,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSave = async () => {
    console.log("Saving page:", elements);
    try {
      const response = await fetch("/api/page/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          elements: Object.values(elements),
          editId,
        }),
      });
      if (!response.ok) throw new Error("Save failed");
    } catch (error) {
      console.error("Error saving page:", error);
    }
  };

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-pink-100 p-4 rounded-lg shadow-md flex justify-around items-center gap-2">
      <ToolbarButton onClick={handleAddText}>Add Text</ToolbarButton>
      <ToolbarFileInput onChange={handleFileUpload} />
      <ToolbarButton onClick={() => {}}>Generate Image</ToolbarButton>
      <ToolbarButton onClick={handleSave}>Save</ToolbarButton>
    </div>
  );
};

export default Toolbar;
