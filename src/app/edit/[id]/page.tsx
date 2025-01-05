import React from "react";
import EditCanvas from "./EditCanvas";
import UploadFile from "./UploadFile";

const EditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  return (
    <div>
      <UploadFile page={id} />
      <EditCanvas />
    </div>
  );
};

export default EditPage;
