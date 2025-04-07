import { createReactBlockSpec } from "@blocknote/react";
import { useState } from "react";

export const WrongExample = createReactBlockSpec(
  {
    type: "wrongExample",
    propSchema: {
      type: {
        default: "wrongExample",
      },
      exampleName: { default: "", type: "string" },
    },
    content: "none",
  },
  {
    render: (props) => {
      return <WrongExampleBlockComponent {...props} />;
    },
  }
);

const WrongExampleBlockComponent = (props: any) => {
  const [exampleName, setExampleName] = useState(props.block.props.exampleName);

  const handleExampleNameChange = (e) => {
    setExampleName(e.target.value);
    props.editor.updateBlock(props.block, {
      props: { exampleName: e.target.value },
    })
  };

  return (
    <div role="alert" className="mt-3 flex items-center w-full p-3 text-sm text-slate-600 rounded-md bg-[#2A2D3E]">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#FF7AC6" className="h-5 w-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path></svg>
      <h3 className="font-bold text-[#FF7AC6]">Wrong Example</h3>
      <input
        type="text"
        value={exampleName}
        onChange={handleExampleNameChange}
        placeholder="Enter Title"
        className="bg-[#252836] py-1 px-2 ml-2 rounded text-[#D1D5DB]"
      />
      <div>{props.children}</div>
    </div>
  )
  
};