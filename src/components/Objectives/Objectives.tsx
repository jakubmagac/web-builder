import { createReactBlockSpec } from "@blocknote/react";
import { useState } from "react";
import "./styles.css";

export const Objectives = createReactBlockSpec(
  {
    type: "objectives",
    propSchema: {
      type: {
        default: "objectives",
      },
      key: { default: "", type: "string" },
    },
    content: "inline",
  },
  {
    render: (props) => {
      return <ObjectiveBlockComponent {...props} />;
    },
  }
);

const ObjectiveBlockComponent = (props) => {
  const [key, setKey] = useState(props.block.props.key);

  const handleKeyChange = (e) => {
    setKey(e.target.value);
    props.editor.updateBlock(props.block, {
      props: { key: e.target.value },
    })
  };

  return (
    <div className="objective-block">
      <div className="objective-key">
        <h3>Objective</h3>
        <strong>Key:</strong>
        <input
          type="text"
          value={key}
          onChange={handleKeyChange}
          placeholder="Enter key"
        />
      </div>
      <div ref={props.contentRef} />
    </div>
  );
};