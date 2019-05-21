import * as React from "react";

import "./index.css";

interface Props {
  onClick: () => any;
  children: React.ReactNode;
}

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

export const Button = () => <div>Test</div>;

// @prodo:theme
export const MyTheme = {
  foo: "bar",
};
