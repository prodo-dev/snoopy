import * as React from "react";
import styled from "styled-components";
import {
  Component as ComponentModel,
  Example as ExampleModel,
} from "../../models";
import {paddings} from "../../styles";
import Example from "../Example";

const StyledComponent = styled.div`
  padding-top: ${paddings.medium};
`;

const ExamplesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

interface Props {
  component: ComponentModel;
}

const Component = (props: Props) => {
  const examples: ExampleModel[] | undefined = (props.component
    .component as any).examples;

  const Comp = props.component.component;
  return (
    <StyledComponent>
      <ExamplesContainer>
        {examples && examples.length > 0 ? (
          examples.map(example => (
            <Example key={example.name} example={example} />
          ))
        ) : (
          <Example example={{name: "Default", jsx: <Comp />}} />
        )}
      </ExamplesContainer>
    </StyledComponent>
  );
};

const Hello = ({name}: {name?: string}) => (
  <div style={{color: "red"}}>Hello {name}</div>
);
Hello.examples = [{name: "Default", jsx: <Hello />}];
const ExampleModel: ComponentModel = {
  name: "Hello",
  component: Hello,
};

const Simple = ({name}: {name?: string}) => (
  <div style={{color: "red"}}>Hello {name}</div>
);
Simple.examples = [
  {name: "Example 1", jsx: <Simple name="Jake" />},
  {name: "Example 2", jsx: <Simple name="Andreja" />},
];
const SimpleModel: ComponentModel = {
  name: "SimpleComponent",
  component: Simple,
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
Counter.examples = [{name: "Counter", jsx: <Counter />}];
const CounterModel: ComponentModel = {
  name: "Counter",
  component: Counter,
};

Component.examples = [
  {
    name: "Default",
    jsx: <Component component={ExampleModel} />,
  },
  {
    name: "Examples Provided",
    jsx: <Component component={SimpleModel} />,
  },
  {
    name: "With React State",
    jsx: <Component component={CounterModel} />,
  },
];

// @prodo
export default Component;
