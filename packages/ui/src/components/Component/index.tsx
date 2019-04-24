import * as React from "react";
import styled from "styled-components";
import {Component, Example as ExampleModel} from "../../models";
import {paddings} from "../../styles/theme";
import Example from "../Example";

const StyledComponent = styled.div`
  padding-top: ${paddings.medium};
`;

const ExamplesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

interface Props {
  component: Component;
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

export default Component;
