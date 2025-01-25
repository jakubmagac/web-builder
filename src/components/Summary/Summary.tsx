import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

export const Summary = createReactBlockSpec(
  {
    type: "summary",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "summary",
      },
    },
    content: "none",
    children: [],
  },
  {
    render: (props) => {
      return (
        <div className="summary" data-introduction-type={props.block.props.type}>
          <div><h3>Summary</h3></div>
        </div>
      );
    },
  }
);