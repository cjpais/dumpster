"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Draggable } from "./Draggable";

interface ImageSidebarProps {
  onImageUpload: (file: File) => Promise<string>;
}

interface UploadedImage {
  id: string;
  url: string;
}

export const ImageSidebar = ({ onImageUpload }: ImageSidebarProps) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      for (const file of acceptedFiles) {
        const imageUrl = await onImageUpload(file);
        setUploadedImages(prev => [...prev, {
          id: `image-${Date.now()}-${Math.random()}`,
          url: imageUrl
        }]);
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsUploading(false);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    }
  });

  return (
    <div className="w-64 h-screen bg-gray-100 p-4 flex flex-col gap-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p>Uploading...</p>
        ) : isDragActive ? (
          <p>Drop the images here...</p>
        ) : (
          <p>Drag & drop images here, or click to select</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {uploadedImages.map((image) => (
            <Draggable
              key={image.id}
              id={image.id}
              data={{ type: 'image', url: image.url }}
            >
              <div className="aspect-square relative group cursor-move">
                <img
                  src={image.url}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg" />
              </div>
            </Draggable>
          ))}
        </div>
      </div>
    </div>
  );
};