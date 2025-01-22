"use client";

import { useSync } from "@tldraw/sync";
import {
  ArrowShapeTool,
  AssetToolbarItem,
  BreakPointProvider,
  DefaultToolbar,
  DrawToolbarItem,
  EllipseToolbarItem,
  RectangleToolbarItem,
  SelectToolbarItem,
  TextToolbarItem,
  TLComponents,
  Tldraw,
  TriangleToolbarItem,
  DiamondToolbarItem,
  HexagonToolbarItem,
  OvalToolbarItem,
  RhombusToolbarItem,
  StarToolbarItem,
  CloudToolbarItem,
  XBoxToolbarItem,
  DefaultBackground,
} from "tldraw";
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

  const components: TLComponents = {
    Toolbar: () => (
      <DefaultToolbar>
        <div className="flex flex-col">
          <div className="flex">
            <SelectToolbarItem />
            <TextToolbarItem />
            <DrawToolbarItem />
            <AssetToolbarItem />
          </div>
          <div className="flex">
            <RectangleToolbarItem />
            <EllipseToolbarItem />
            <TriangleToolbarItem />
            <StarToolbarItem />
          </div>
        </div>
      </DefaultToolbar>
    ),
    Background: () => <div className="w-full h-full bg-[#fffaef]"></div>,
  };

  return (
    <Tldraw
      // we can pass the connected store into the Tldraw component which will handle
      // loading states & enable multiplayer UX like cursors & a presence menu
      components={components}
      options={{ maxPages: 1 }}
      store={store}
      onMount={(editor) => {
        // when the editor is ready, we need to register our bookmark unfurling service
        editor.registerExternalAssetHandler("url", getBookmarkPreview);
      }}
    >
      {/* <DefaultBackground  /> */}
      <BreakPointProvider>
        {/* <div className="fixed left-[calc(50%-288px)] top-0 w-[576px] h-screen bg-[#0001]"></div> */}
        <CustomTldrawCamera />
      </BreakPointProvider>
    </Tldraw>
  );
};

export default TldrawCanvas;
