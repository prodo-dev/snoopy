import * as React from "react";

import "./index.css";

interface Props {
  onClick: () => any;
  children: React.ReactNode;
}

// @prodo
export default (props: Props) => (
  <button
    onClick={event => {
      event.stopPropagation();
      props.onClick();
    }}
  >
    {props.children}
  </button>
);
