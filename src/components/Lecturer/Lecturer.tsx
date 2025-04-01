import { createReactBlockSpec } from "@blocknote/react";

export const Lecturer = createReactBlockSpec(
  {
    type: "lecturer",
    propSchema: {
      type: {
        default: "lecturer",
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      return <LecturerBlockComponent {...props} />;
    },
  }
);

const LecturerBlockComponent = (props: any) => {
  return (
    <div className="mt-3 w-full p-3 text-sm text-slate-600 rounded-md bg-[#2A2D3E]">
      <h3 className="font-bold text-[#FF7AC6]">Lecturer</h3>
      <div>{props.children}</div>
    </div>
  )
  
};