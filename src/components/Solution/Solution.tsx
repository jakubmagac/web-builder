import { createReactBlockSpec } from "@blocknote/react";
import { FormControlLabel, Switch } from "@mui/material";
import { useState } from "react";

export const Solution = createReactBlockSpec(
  {
    type: "solution",
    propSchema: {
      type: {
        default: "solution",
      },
      defaultHiddenValue: { default: false, type: "boolean" },
    },
    content: "none",
  },
  {
    render: (props) => {
      return <SolutionBlockComponent {...props} />;
    },
  }
);

const SolutionBlockComponent = (props: any) => {
  const [hidden, setHiden] = useState(props.block.props.defaultHiddenValue)
  return (
    <div className="mt-3 w-full p-3 text-sm text-slate-600 rounded-md bg-[#2A2D3E]">
      <FormControlLabel
          control={
            <Switch 
              checked={hidden} 
              onChange={() => setHiden(!hidden)} 
              color="primary"
            />
          }
          label="Hide"
      />
      <h3 className="font-bold text-[#FF7AC6]">Solution</h3>
      <div>{props.children}</div>
    </div>
  );
};