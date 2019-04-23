import * as React from "react";
import styled from "styled-components";
import {Component, Example as ExampleModel} from "../../models";
import Example from "../Example";

const StyledComponent = styled.div`
  margin: 1rem;
  padding: 1rem;
  border: solid 1px black;
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
      {examples && examples.length > 0 ? (
        examples.map(example => (
          <Example key={example.name} example={example} />
        ))
      ) : (
        <Example example={{name: "Default", jsx: <Comp />}} />
      )}
    </StyledComponent>
  );
};

export default Component;
