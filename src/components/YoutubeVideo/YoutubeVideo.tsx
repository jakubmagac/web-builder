import { createReactBlockSpec } from "@blocknote/react";
import { useState } from "react";

export const YouTubeBlock = createReactBlockSpec(
  {
    type: "youtube",
    propSchema: {
      videoId: {
        default: "",
        type: "string",
      },
      name: {
        default: "",
        type: "string",
      },
      caption: {
        default: "",
        type: "string",
      }
    },
    content: "none",
  },
  {
    render: (props) => <YouTubeComponent {...props} />,
  }
);

// Render logic
const YouTubeComponent = ({ block, editor }) => {
  const [videoId, setVideoId] = useState(block.props.videoId);
  const [name, setName] = useState(block.props.name);
  const [caption, setCaption] = useState(block.props.caption);

  const handleChange = (e) => {
    const newId = e.target.value.trim();
    setVideoId(newId);
    editor.updateBlock(block, {
      props: { videoId: newId },
    });
  };

  const handleChangeName = (e) => {
    const newName = e.target.value.trim();
    setName(newName);
    editor.updateBlock(block, {
      props: { name: newName },
    });
  };

  const handleChangeCaption = (e) => {
    const newCaption = e.target.value.trim();
    setCaption(newCaption);
    editor.updateBlock(block, {
      props: { caption: newCaption },
    });
  };


  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <div className="my-4 bg-[#1e1e2f] rounded-md text-white w-full max-w-xl">
      <label className="block text-sm mb-2">YouTube Video ID:</label>
      <input
        type="text"
        value={videoId}
        onChange={handleChange}
        placeholder="e.g. 52El0EUI6D0"
        className="w-full px-2 py-1 rounded bg-[#2c2c3c] text-white mb-3"
      />

      <label className="block text-sm mb-2">Video name:</label>
      <input
        type="text"
        value={name}
        onChange={handleChangeName}
        placeholder="52El0EUI6D0"
        className="w-full px-2 py-1 rounded bg-[#2c2c3c] text-white mb-3"
      />

      <label className="block text-sm mb-2">Video caption:</label>
      <input
        type="text"
        value={caption}
        onChange={handleChangeCaption}
        placeholder="caption"
        className="w-full px-2 py-1 rounded bg-[#2c2c3c] text-white mb-3"
      />
      {embedUrl && (
        <iframe
          className="w-full aspect-video rounded"
          src={embedUrl}
          title="YouTube Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};
