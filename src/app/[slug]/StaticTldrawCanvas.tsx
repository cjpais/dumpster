"use client";

import { useSync } from "@tldraw/sync";
import {
  BreakPointProvider,
  createTLStore,
  getSnapshot,
  Tldraw,
  TLUiComponents,
  useEditor,
} from "tldraw";
import { multiplayerAssetStore } from "@/lib/multiplayerAssetStore";
import { getBookmarkPreview } from "@/lib/getBookmarkPreview";
import CustomTldrawCamera from "@/app/edit/[id]/CustomTldrawCamera";

const components: Required<TLUiComponents> = {
  ContextMenu: null,
  ActionsMenu: null,
  HelpMenu: null,
  ZoomMenu: null,
  MainMenu: null,
  Minimap: null,
  StylePanel: null,
  PageMenu: null,
  NavigationPanel: null,
  Toolbar: null,
  KeyboardShortcutsDialog: null,
  QuickActions: null,
  HelperButtons: null,
  DebugPanel: null,
  DebugMenu: null,
  SharePanel: null,
  MenuPanel: null,
  TopPanel: null,
  CursorChatBubble: null,
};

const StaticTldrawCanvas = ({ snapshot }: { snapshot: any }) => {
  //   const store = useSync({
  //     // We need to know the websockets URI...
  //     uri: `${process.env.NEXT_PUBLIC_TLDRAW_WORKER_URL}/connect/${roomId}`,
  //     // ...and how to handle static assets like images & videos
  //     assets: multiplayerAssetStore,
  //   });

  //   console.log(snapshot);

  //   const store = createTLStore({
  //     initialData: snapshot,
  //     id: "static",
  //   });

  const ss = {
    schema: snapshot.schema,
    store: Object.fromEntries(
      snapshot.documents.map((doc: any) => [doc.state.id, doc.state])
    ) as any,
  };

  return (
    <Tldraw
      // we can pass the connected store into the Tldraw component which will handle
      // loading states & enable multiplayer UX like cursors & a presence menu
      options={{ maxPages: 1 }}
      //   store={store}
      snapshot={ss}
      onUiEvent={() => {}}
      //   components={components}
      //   persistenceKey="my-persistence-key"
      hideUi
      onMount={(editor) => {
        console.log("Editor store state:", getSnapshot(editor.store));
        // when the editor is ready, we need to register our bookmark unfurling service
        // editor.registerExternalAssetHandler("url", getBookmarkPreview);
        editor.updateInstanceState({ isReadonly: true });
        // editor.setCurrentTool("hand");
      }}
    >
      <BreakPointProvider>
        <CustomTldrawCamera />
      </BreakPointProvider>
    </Tldraw>
  );
};

export default StaticTldrawCanvas;
