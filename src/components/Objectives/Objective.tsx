import { createReactBlockSpec } from "@blocknote/react";
import { useState } from "react";

export const Objective = createReactBlockSpec(
  {
    type: "objective",
    propSchema: {
      type: {
        default: "objective",
      },
      key: { default: "", type: "string" },
      name: { default: "", type: "string" },
    },
    content: "none",
  },
  {
    render: (props) => {
      return <ObjectiveBlockComponent {...props} />;
    },
  }
);

const ObjectiveBlockComponent = (props) => {
  const [key, setKey] = useState(props.block.props.key);
  const [name, setName] = useState(props.block.props.name);

  const handleKeyChange = (e) => {
    const value = e.target.value;
    if (value.includes(' ')) return;
    setKey(value);

    props.editor.updateBlock(props.block, {
      props: { key: value },
    })
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    props.editor.updateBlock(props.block, {
      props: { name: e.target.value },
    })
  };

  return (
    <div className="mt-3 w-full p-3 text-sm text-slate-600 rounded-md bg-[#2A2D3E]">
      <div className="objective-key">
        <h3 className="font-bold text-[#FF7AC6]">Objective</h3>
        <input
          type="text"
          value={key}
          onChange={handleKeyChange}
          placeholder="Enter key"
          className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2 mr-2"
        />
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter name"
          className="bg-[#252836] py-1 px-2 rounded text-[#D1D5DB] mb-2"
        />
      </div>
    </div>
  );
};