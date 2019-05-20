import * as React from "react";

import "./index.css";

export interface Props {
  done: boolean;
  toggle: (done: boolean) => void;
}

const Toggle = ({done, toggle}: Props) => (
  <input
    className="toggle"
    type="checkbox"
    checked={done}
    onChange={event => toggle(event.target.checked)}
  />
);

// @prodo
export default Toggle;
