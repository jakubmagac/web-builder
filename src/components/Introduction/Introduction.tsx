import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import "./styles.css";

export const Introduction = createReactBlockSpec(
  {
    type: "introduction",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "introduction",
      },
    },
    content: "none",
    children: [],
  },
  {
    render: (props) => {
      return (
        <div className="introduction" data-introduction-type={props.block.props.type}>
          <div><h3>Introduction</h3></div>
        </div>
      );
    },
  }
);