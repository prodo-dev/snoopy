import * as React from "react";
import styled from "styled-components";
import {Component, Context} from "../src/models";

const Root = () => <p>I am root.</p>;
Root.examples = [{name: "Default", jsx: <Root />}];
export const RootModel: Component = {
  name: "Root",
  path: "index.tsx",
  component: Root,
};

const StyledDiv = styled.div`
  color: blue;
`;
const HelloWorld = () => <StyledDiv>Hello world</StyledDiv>;
export const HelloWorldExample = {name: "Default", jsx: <HelloWorld />};
HelloWorld.examples = [HelloWorldExample];
export const HelloWorldModel: Component = {
  name: "HelloWorld",
  path: "HelloWorld.tsx",
  component: HelloWorld,
};

const HelloName = ({name}: {name?: string}) => (
  <div style={{color: "pink"}}>Hello {name}</div>
);
HelloName.examples = [
  {name: "Example 1", jsx: <HelloName name="Jake" />},
  {name: "Example 2", jsx: <HelloName name="Andreja" />},
];
export const HelloNameModel: Component = {
  name: "HelloName",
  path: "HelloName.tsx",
  component: HelloName,
};

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
export const CounterExample = {name: "Counter", jsx: <Counter />};
Counter.examples = [CounterExample];
export const CounterModel: Component = {
  name: "Counter",
  path: "Counter/index.tsx",
  component: Counter,
};

export const testComponents = [
  RootModel,
  HelloWorldModel,
  HelloNameModel,
  CounterModel,
];

export const testThemes = [
  {name: "darkTheme", theme: {}},
  {name: "lightTheme", theme: {}},
];

export const testStyles = [
  {
    name: "testStyles",
    path: "index.css",
    style: `
/* @prodo:styles */
body {
  font-style: italic;
}
`,
  },
];

export const emptyContext: Context = {
  components: [],
  themes: [],
  styles: [],
  errors: [],
};

export const testContext: Context = {
  components: testComponents,
  themes: testThemes,
  styles: testStyles,
  errors: [],
};
