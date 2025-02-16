"use client";

import React, { useEffect } from "react";
import { TLCameraOptions, useBreakpoint, useEditor } from "tldraw";

const cameraOptions: TLCameraOptions = {
  isLocked: false,
  wheelBehavior: "pan",
  panSpeed: 1,
  zoomSpeed: 1,
  zoomSteps: [0.01, 0.1, 0.25, 0.5, 1, 2, 4, 8, 16, 32],
  constraints: {
    initialZoom: "fit-x",
    baseZoom: "default",
    bounds: {
      x: 0,
      y: 0,
      w: 500,
      h: 100000,
    },
    behavior: { x: "free", y: "free" },
    padding: { x: 0, y: 0 },
    origin: { x: 0.5, y: 0 },
  },
};

const CustomTldrawCamera = () => {
  const editor = useEditor();
  const breakpoint = useBreakpoint();

  useEffect(() => {
    if (!editor) return;
    editor.run(() => {
      editor.setCameraOptions(cameraOptions);
      const camera = editor.getCamera();
      const viewportSize = editor.getViewportScreenBounds();
      const baseWidth = Math.max(576, viewportSize.width);
      const baseHeight = baseWidth / (19.5 / 9);
      const scaleFactor = Math.min(viewportSize.height / baseHeight, 1.68);
      editor.setCamera(
        {
          ...camera,
          z: scaleFactor,
        },
        {
          immediate: true,
        }
      );
      editor.zoomToFit();
      //   editor.resetZoom();

      //   if (breakpoint > 4) {
      //     editor.zoomToBounds({ x: 0, y: 0, w: 0, h: 0 }, { targetZoom: 2 });
      //   }
    });
  }, [editor, cameraOptions]);

  return <div></div>;
};

export default CustomTldrawCamera;
