import { createReactBlockSpec } from "@blocknote/react";
import { useState } from "react";
import { Switch, FormControlLabel } from "@mui/material";

export const Metadata = createReactBlockSpec(
  {
    type: "metadata",
    propSchema: {
      type: {
        default: "metadata",
      },
      title: { default: "", type: "string" },
      subtitle: { default: "", type: "string" },
      week: { default: '', type: "number" },
      publicationWeek: { default: '', type: "number" },
      validation: { default: false, type: "boolean" },
    },
    content: "none",
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
    <div role="alert" className="mt-3 w-full p-3 text-sm text-slate-600 rounded-md bg-[#2A2D3E]">
      <h3 className="font-bold text-[#FF7AC6]">Metadata</h3>
      <div>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter Title"
          className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2"
        />
      </div>
      <div>
        <input
          type="text"
          value={subtitle}
          onChange={handleSubtitleChange}
          placeholder="Enter Subtitle"
          className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2"
        />
      </div>
      <div>
        <input
          type="number"
          value={week}
          onChange={handleWeekChange}
          placeholder="Enter Week"
          className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2"
        />
      </div>
      <div>
        <input
          type="number"
          value={publicationWeek}
          onChange={handlePublicationWeekChange}
          placeholder="Enter Publication Week"
          className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2"
        />
      </div>
      <FormControlLabel
          control={
            <Switch 
              checked={validation} 
              onChange={() => handleValidationChange()} 
              color="primary"
            />
          }
          label="Validation"
      />
      
    </div>
  );
};