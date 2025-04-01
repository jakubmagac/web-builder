import { createReactBlockSpec } from "@blocknote/react";

export const Warning = createReactBlockSpec(
  {
    type: "warning",
    propSchema: {
      type: {
        default: "warning",
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      return <WarningBlockComponent {...props} />;
    },
  }
);

const WarningBlockComponent = (props: any) => {
  return (
    <div className="mt-3 w-full p-3 flex text-sm text-slate-600 rounded-md bg-[#2A2D3E]">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#FFD700" className="h-5 w-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path></svg>
      <h3 className="text-[#FFD700]">Warning</h3>
      <div>{props.children}</div>
    </div>
  )
};