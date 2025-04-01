import { createReactBlockSpec } from "@blocknote/react";

export const AdditionalResources = createReactBlockSpec(
  {
    type: "additionalResources",
    propSchema: {
      type: {
        default: "additionalResources",
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      return <AdditionalResourcesBlockComponent {...props} />;
    },
  }
);

const AdditionalResourcesBlockComponent = (props) => {
  return (
    <div className="mt-3 w-full p-3 text-sm text-slate-600 rounded-md bg-[#2A2D3E]">
      <h3 className="font-bold text-[#FF7AC6]">Additional Resources</h3>
      <div>{props.children}</div>
    </div>
  );
};