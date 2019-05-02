// tslint:disable:no-submodule-imports
import Component from "@prodo/snoopy-ui/src/components/Component";
import {Component as ComponentModel} from "@prodo/snoopy-ui/src/models";
import {darkTheme} from "@prodo/snoopy-ui/src/styles/theme";
// tslint:enable

import {storiesOf} from "@storybook/react";
import * as React from "react";
import {ThemeProvider} from "styled-components";

const Counter = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div
      style={{backgroundColor: "snow", color: "violet", padding: "2rem"}}
      onClick={() => setCount(count + 1)}
    >
      <h2>{count}</h2>
    </div>
  );
};

Counter.examples = [{name: "Counter", jsx: <Counter />}];

const CounterModel: ComponentModel = {
  path: "foo/bar",
  name: "Counter",
  component: Counter,
};

const Simple = ({name}: {name: string}) => (
  <div style={{color: "red"}}>Hello {name}</div>
);

Simple.examples = [];

const SimpleModel: ComponentModel = {
  path: "foo/bar",
  name: "SimpleComponent",
  component: Simple,
};

storiesOf("Component", module)
  .addDecorator((storyFn: any) => (
    <ThemeProvider theme={darkTheme}>{storyFn()}</ThemeProvider>
  ))
  .add("default example", () => {
    Simple.examples = [];

    return <Component component={SimpleModel} />;
  })
  .add("examples provided", () => {
    Simple.examples = [
      {name: "Example 1", jsx: <Simple name="Jake" />},
      {name: "Example 2", jsx: <Simple name="Andreja" />},
    ];

    return <Component component={SimpleModel} />;
  })
  .add("with react state", () => <Component component={CounterModel} />);
