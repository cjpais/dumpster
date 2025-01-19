"use client";

import React, { useEffect } from "react";
import { TLCameraOptions, useEditor } from "tldraw";

const cameraOptions: TLCameraOptions = {
  isLocked: false,
  wheelBehavior: "pan",
  panSpeed: 0,
  zoomSpeed: 0,
  zoomSteps: [],
  constraints: {
    initialZoom: "default",
    baseZoom: "default",
    bounds: {
      x: 0,
      y: 0,
      w: 600,
      h: 10000,
    },
    behavior: { x: "contain", y: "contain" },
    padding: { x: 100, y: 100 },
    origin: { x: 0.5, y: 0 },
  },
};

const CustomTldrawCamera = () => {
  const editor = useEditor();

  useEffect(() => {
    if (!editor) return;
    editor.run(() => {
      editor.setCameraOptions(cameraOptions);
      const camera = editor.getCamera();
      console.log("Camera:", camera);
      editor.setCamera(editor.getCamera(), {
        immediate: true,
      });
    });
  }, [editor, cameraOptions]);

  return <div></div>;
};

export default CustomTldrawCamera;
