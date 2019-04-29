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

const ExampleComponent = () => <div>Hello World</div>;
ExampleComponent.examples = [{name: "Default", jsx: <ExampleComponent />}];
const exampleComponent: ComponentModel = {
  name: "Hello World",
  component: ExampleComponent,
};

Component.examples = [
  {
    name: "Basic",
    jsx: <Component component={exampleComponent} />,
  },
];

// @prodo
export default Component;
