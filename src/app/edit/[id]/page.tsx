import React from "react";
import EditCanvas from "./EditCanvas";

const EditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  return (
    <div>
      <EditCanvas />
    </div>
  );
};

export default EditPage;
