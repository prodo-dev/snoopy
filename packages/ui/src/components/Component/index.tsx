import * as React from "react";
import styled from "styled-components";
import {Component} from "../../models";

const StyledComponent = styled.div`
  margin: 1rem;
  padding: 1rem;
  border: solid 1px black;
`;

interface Props {
  component: Component;
}

const Component = (props: Props) => {
  const UserComponent = props.component.component;

  return (
    <StyledComponent>
      <UserComponent />
    </StyledComponent>
  );
};

export default Component;
