"use client";

import { CanvasElement } from "@/lib/types";
import useCanvasStore from "@/lib/useCanvas";
import React, { ReactNode } from "react";

interface CanvasProviderProps {
  children: ReactNode;
  data: CanvasElement[];
}

const CanvasProvider = ({ children, data }: CanvasProviderProps) => {
  const { addElements } = useCanvasStore();

  React.useEffect(() => {
    addElements(data);
  }, []);

  return <div>{children}</div>;
};

export default CanvasProvider;
