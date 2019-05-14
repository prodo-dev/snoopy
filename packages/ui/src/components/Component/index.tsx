import * as React from "react";
import styled from "styled-components";
import {
  CounterModel,
  HelloNameModel,
  HelloWorldModel,
} from "../../../test/fixtures";
import {
  Component as ComponentModel,
  Example as ExampleModel,
} from "../../models";
import {paddings} from "../../styles";
import {StyledError} from "../ErrorBoundary";
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
  userTheme?: any;
  allStyles?: string;
}

const Component = (props: Props) => {
  const examples = props.component.examples;

  const Comp =
    props.component.component ||
    (() => <StyledError>props.component.component is undefined</StyledError>);
  return (
    <StyledComponent>
      <ExamplesContainer>
        {examples && examples.length > 0 ? (
          examples.map(example => (
            <Example
              key={example.title}
              userTheme={props.userTheme}
              example={example}
              allStyles={props.allStyles}
            />
          ))
        ) : (
          <Example
            userTheme={props.userTheme}
            example={{name: "Default", component: () => <Comp />}}
            allStyles={props.allStyles}
          />
        )}
      </ExamplesContainer>
    </StyledComponent>
  );
};

Component.examples = [
  {
    name: "Default",
    jsx: <Component component={HelloWorldModel} />,
  },
  {
    name: "Examples provided",
    jsx: <Component component={HelloNameModel} />,
  },
  {
    name: "With React state",
    jsx: <Component component={CounterModel} />,
  },
];

// @prodo
export default Component;
