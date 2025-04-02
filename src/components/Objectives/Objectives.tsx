import { createReactBlockSpec } from "@blocknote/react";
import { useState } from "react";

export const Objectives = createReactBlockSpec(
  {
    type: "objectives",
    propSchema: {
      type: {
        default: "objectives",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      return <ObjectivesBlockComponent {...props} />;
    },
  }
);

const ObjectivesBlockComponent = (props) => {
  return (
    <div className="mt-3 w-full p-3 text-sm text-slate-600 rounded-md bg-[#2A2D3E]">
      <div className="objective-key">
        <h3 className="font-bold text-[#FF7AC6]">Objectives</h3>
        {props.children}
      </div>
    </div>
  );
};