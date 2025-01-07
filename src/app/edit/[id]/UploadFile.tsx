"use client";
import { UploadMetadata } from "@/lib/types";
import React, { useCallback, useState } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";

const UploadFile = ({ page }: { page: string }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (
    file: File,
    position: { x: number; y: number }
  ) => {
    try {
      const metadata: UploadMetadata = {
        editId: page,
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
      console.log("Upload succeeded:", await response.text());
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => {
      console.log(event);
      const file = acceptedFiles[0];
      if (file) {
        const position = {
          // @ts-ignore
          x: event.pageX,
          // @ts-ignore
          y: event.pageY,
        };
        console.log("Uploading file:", file, "at position:", position);
        handleFileUpload(file, position);
      }
      setIsDragging(false);
    },
    [page]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, // Prevents clicking to open file dialog
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <>
      <div
        {...getRootProps()}
        className="fixed inset-0 z-50 pointer-events-auto"
        style={{
          cursor: isDragging ? "copy" : "default",
          pointerEvents: isDragging ? "auto" : "none", // Only capture events when dragging
        }}
      >
        <input {...getInputProps()} />
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
            <div className="text-2xl text-white bg-blue-500 p-4 rounded-lg">
              Drop files here
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadFile;
