import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

export const Summary = createReactBlockSpec(
  {
    type: "summary",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "summary",
      },
    },
    content: "none",
    children: [],
  },
  {
    render: (props) => {
      return (
        <div className="mt-3 w-full p-3 text-sm text-slate-600 rounded-md bg-[#2A2D3E]">
          <h3 className="font-bold text-[#FF7AC6]">Summary</h3>
        </div>
      );
    },
  }
);