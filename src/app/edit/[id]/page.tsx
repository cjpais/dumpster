import React from "react";
import EditCanvas from "./EditCanvas";

const EditPage = async ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <EditCanvas pageId={params.id} />
    </div>
  );
};

export default EditPage;
