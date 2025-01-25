import { createReactBlockSpec } from "@blocknote/react";
import { useState } from "react";
import "./styles.css";

export const Metadata = createReactBlockSpec(
  {
    type: "metadata",
    propSchema: {
      type: {
        default: "metadata",
      },
      title: { default: "", type: "string" },
      subtitle: { default: "", type: "string" },
      week: { default: 0, type: "number" },
      publicationWeek: { default: 0, type: "number" },
      validation: { default: false, type: "boolean" },
    },
    content: "inline",
  },
  {
    render: (props) => {
      return <MetadataBlockComponent {...props} />;
    },
  }
);

const MetadataBlockComponent = (props) => {
  const [title, setTitle] = useState(props.block.props.title);
  const [subtitle, setSubtitle] = useState(props.block.props.subtitle);
  const [week, setWeek] = useState(props.block.props.week);
  const [publicationWeek, setPublicationWeek] = useState(props.block.props.publicationWeek);
  const [validation, setValidation] = useState(props.block.props.validation);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    props.editor.updateBlock(props.block, {
      props: { title: e.target.value },
    })
  };

  const handleSubtitleChange = (e) => {
    setSubtitle(e.target.value);
    props.editor.updateBlock(props.block, {
      props: { subtitle: e.target.value },
    })
  };

  const handleWeekChange = (e) => {
    setWeek(e.target.value);
    props.editor.updateBlock(props.block, {
      props: { week: e.target.value },
    })
  };

  const handlePublicationWeekChange = (e) => {
    setPublicationWeek(e.target.value);
    props.editor.updateBlock(props.block, {
      props: { publicationWeek: e.target.value },
    })
  };

  const handleValidationChange = () => {
    setValidation(!validation);
    props.editor.updateBlock(props.block, {
      props: { validation: !validation },
    })
  };

  return (
    <div className="metadata-block">
      <h3>Metadata</h3>
      <div>
        <strong>Title:</strong>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter Title"
        />
      </div>
      <div>
        <strong>Subtitle:</strong>
        <input
          type="text"
          value={subtitle}
          onChange={handleSubtitleChange}
          placeholder="Enter Subtitle"
        />
      </div>
      <div>
        <strong>Week:</strong>
        <input
          type="number"
          value={week}
          onChange={handleWeekChange}
          placeholder="Enter Week"
        />
      </div>
      <div>
        <strong>Publication Week:</strong>
        <input
          type="number"
          value={publicationWeek}
          onChange={handlePublicationWeekChange}
          placeholder="Enter Publication Week"
        />
      </div>
      <div>
        <strong>Validation:</strong>
        <input
          type="checkbox"
          checked={validation}
          onChange={handleValidationChange}
        />
      </div>
    </div>
  );
};