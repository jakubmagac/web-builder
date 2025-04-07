import { createReactBlockSpec } from "@blocknote/react";

export const Math = createReactBlockSpec(
  {
    type: "math",
    propSchema: {
      type: {
        default: "math",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      return <MathBlockComponent {...props} />;
    },
  }
);

const MathBlockComponent = (props: any) => {
  return (
    <div role="alert" className="mt-3 relative flex w-full p-3 text-sm text-slate-600 rounded-md bg-[#2A2D3E]">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#FF7AC6" className="h-5 w-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path></svg>
      <h3 className="font-bold text-[#FF7AC6]">Math</h3>
      <div>{props.children}</div>
    </div>
  )
  
};