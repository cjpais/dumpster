"use client";
import { UploadMetadata } from "@/lib/types";
import React from "react";

const UploadFile = ({ page }: { page: string }) => {
  const handleFileUpload = async (file: File) => {
    try {
      const metadata: UploadMetadata = {
        editId: page,
        position: null,
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

  return (
    <input
      type="file"
      className="mb-4"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          handleFileUpload(file);
        }
      }}
    />
  );
};

export default UploadFile;
