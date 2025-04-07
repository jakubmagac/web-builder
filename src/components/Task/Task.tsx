import { createReactBlockSpec } from "@blocknote/react";

export const Task = createReactBlockSpec(
  {
    type: "task",
    propSchema: {
      type: {
        default: "task",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      return <TaskBlockComponent {...props} />;
    },
  }
);

const TaskBlockComponent = (props: any) => {
  return (
    <div className="mt-3 w-full p-3 text-sm text-slate-600 rounded-md bg-[#2A2D3E]">
      <h3 className="font-bold text-[#FF7AC6]">Task</h3>
      <div>{props.children}</div>
    </div>
  );
};