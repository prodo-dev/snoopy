import * as React from "react";

import "./index.css";

export interface Props {
  remove: () => void;
}

// @prodo
export const Remove = ({remove}: Props) => (
  <button className="remove" onClick={() => remove()}>
    ×
  </button>
);

export default Remove;
