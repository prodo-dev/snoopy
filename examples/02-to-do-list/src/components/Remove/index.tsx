import * as React from "react";

import "./index.css";

export interface Props {
  remove: () => void;
}

const Remove = ({remove}: Props) => (
  <button className="remove" onClick={() => remove()}>
    ×
  </button>
);

// @prodo
export default Remove;
