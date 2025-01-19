import React from "react";
import TldrawCanvas from "./TldrawCanvas";
import "tldraw/tldraw.css";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const roomId = (await params).id;

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <TldrawCanvas roomId={roomId} />
    </div>
  );
};

export default Page;
