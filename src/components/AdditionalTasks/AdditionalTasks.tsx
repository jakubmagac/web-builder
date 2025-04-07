import { createReactBlockSpec } from "@blocknote/react";

export const AdditionalTasks = createReactBlockSpec(
  {
    type: "additionalTasks",
    propSchema: {
      type: {
        default: "additionalTasks",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      return <AdditionalTasksBlockComponent {...props} />;
    },
  }
);

const AdditionalTasksBlockComponent = (props) => {
  return (
    <div className="mt-3 w-full p-3 text-sm text-slate-600 rounded-md bg-[#2A2D3E]">
      <h3 className="font-bold text-[#FF7AC6]">Additional Tasks</h3>
      <div>{props.children}</div>
    </div>
  );
};