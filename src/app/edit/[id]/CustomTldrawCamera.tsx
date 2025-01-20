"use client";

import React, { useEffect } from "react";
import { TLCameraOptions, useBreakpoint, useEditor } from "tldraw";

const cameraOptions: TLCameraOptions = {
  isLocked: false,
  wheelBehavior: "pan",
  panSpeed: 1,
  zoomSpeed: 1,
  zoomSteps: [0.1, 0.25, 0.5, 1, 2, 4, 8],
  constraints: {
    initialZoom: "fit-x",
    baseZoom: "default",
    bounds: {
      x: 0,
      y: 0,
      w: 500,
      h: 100000,
    },
    behavior: { x: "fixed", y: "contain" },
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
      editor.setCamera(
        { ...editor.getCamera(), z: 1.0 },
        {
          immediate: true,
        }
      );
      //   editor.zoomToFit();
      //   editor.resetZoom();

      //   if (breakpoint > 4) {
      //     editor.zoomToBounds({ x: 0, y: 0, w: 0, h: 0 }, { targetZoom: 2 });
      //   }
    });
  }, [editor, cameraOptions]);

  return <div></div>;
};

export default CustomTldrawCamera;
