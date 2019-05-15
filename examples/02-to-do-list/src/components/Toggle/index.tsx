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

Toggle.examples = [
  {name: "not done", jsx: <Toggle done={false} toggle={() => undefined} />},
  {name: "done", jsx: <Toggle done={true} toggle={() => undefined} />},
];

// @prodo
export default Toggle;
