"use client";

import { useSync } from "@tldraw/sync";
import { Tldraw, useEditor } from "tldraw";
import { multiplayerAssetStore } from "@/lib/multiplayerAssetStore";
import { getBookmarkPreview } from "@/lib/getBookmarkPreview";
import CustomTldrawCamera from "./CustomTldrawCamera";

const TldrawCanvas = ({ roomId }: { roomId: string }) => {
  const store = useSync({
    // We need to know the websockets URI...
    uri: `${process.env.NEXT_PUBLIC_TLDRAW_WORKER_URL}/connect/${roomId}`,
    // ...and how to handle static assets like images & videos
    assets: multiplayerAssetStore,
  });

  return (
    <Tldraw
      // we can pass the connected store into the Tldraw component which will handle
      // loading states & enable multiplayer UX like cursors & a presence menu
      options={{ maxPages: 1 }}
      store={store}
      onMount={(editor) => {
        // when the editor is ready, we need to register our bookmark unfurling service
        editor.registerExternalAssetHandler("url", getBookmarkPreview);
      }}
    >
      <div className="fixed left-1/2 top-0 w-[1px] h-screen bg-black"></div>
      <CustomTldrawCamera />
    </Tldraw>
  );
};

export default TldrawCanvas;
