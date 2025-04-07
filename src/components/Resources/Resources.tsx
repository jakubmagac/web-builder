import { createReactBlockSpec } from "@blocknote/react";

export const Resource = createReactBlockSpec(
  {
    type: "resource",
    propSchema: {
      type: {
        default: "resource",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      return <ResourceBlockComponent {...props} />;
    },
  }
);

const ResourceBlockComponent = (props) => {
  return (
    <div className="mt-3 w-full p-3 text-sm text-slate-600 rounded-md bg-[#2A2D3E]">
      <h3 className="font-bold text-[#FF7AC6]">Resources</h3>
      <div>{props.children}</div>
    </div>
  );
};