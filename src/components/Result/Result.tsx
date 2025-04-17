import { createReactBlockSpec, useBlockNoteEditor } from "@blocknote/react";
import { useState } from "react";
import { FormControlLabel, Switch } from "@mui/material";

export const Result = createReactBlockSpec(
  {
    type: "result",
    propSchema: {
      type: {
        default: "result",
      },
      defaultHiddenValue: { default: false, type: "boolean" },
    },
    content: "none",
  },
  {
    render: (props) => {
      return <ResultBlockComponent {...props} />;
    },
  }
);

const ResultBlockComponent = (props: any) => {
  const [hidden, setHidden] = useState(props.block.props.defaultHiddenValue)
  const editor = useBlockNoteEditor();

  const toggleHidden = () => {
    const newValue = !hidden;
    setHidden(newValue);

    editor.updateBlock(props.block, {
      props: {
        ...props.block.props,
        defaultHiddenValue: newValue,
      },
    });
  };
  
  return (
    <div className="mt-3 w-full p-3 text-sm text-slate-600 rounded-md bg-[#2A2D3E]">
      <FormControlLabel
          control={
            <Switch 
              checked={hidden} 
              onChange={toggleHidden} 
              color="primary"
            />
          }
          label="Hide"
      />
      <h3 className="font-bold text-[#FF7AC6]">Result</h3>
      <div>{props.children}</div>
    </div>
  );
};