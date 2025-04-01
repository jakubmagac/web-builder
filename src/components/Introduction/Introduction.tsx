import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

export const Introduction = createReactBlockSpec(
  {
    type: "introduction",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "introduction",
      },
    },
    content: "none",
    children: [],
  },
  {
    render: (props) => {
      return (
        <div className="mt-3 w-full p-3 text-sm text-slate-600 rounded-md bg-[#2A2D3E]">
          <h3 className="font-bold text-[#FF7AC6]">Introduction</h3>
        </div>
      );
    },
  }
);