import { CanvasElement } from "@/lib/types";

const ImageComponent: React.FC<{ element: CanvasElement }> = ({ element }) => (
  <img src={element.url} alt="" className="max-w-[200px]" />
);

const VideoComponent: React.FC<{ element: CanvasElement }> = ({ element }) => (
  <video src={element.url} controls />
);

const AudioComponent: React.FC<{ element: CanvasElement }> = ({ element }) => (
  <audio src={element.url} controls />
);

const TextComponent: React.FC<{ element: CanvasElement }> = ({ element }) => (
  <p>{element.content}</p>
);

const HTMLComponent: React.FC<{ element: CanvasElement }> = ({ element }) => (
  <div dangerouslySetInnerHTML={{ __html: element.content! }} />
);

const MediaElement: React.FC<{ canvasElement: CanvasElement }> = ({
  canvasElement,
}) => {
  console.log("canvasElement", canvasElement);
  switch (canvasElement.type) {
    case "image":
      return <ImageComponent element={canvasElement} />;
    case "video":
      return <VideoComponent element={canvasElement} />;
    case "audio":
      return <AudioComponent element={canvasElement} />;
    case "text":
      return <TextComponent element={canvasElement} />;
    case "html":
      return <HTMLComponent element={canvasElement} />;
    default:
      return null;
  }
};

export default MediaElement;
