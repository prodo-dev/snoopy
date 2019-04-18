import * as React from "react";
import styled from "styled-components";

const StyledComponent = styled.div`
  margin: 1rem;
  padding: 1rem;
  border: solid 1px black;
`;

interface Props {
  name: string;
  component: React.ComponentType<any>;
}

const Component = (props: Props) => {
  const UserComponent = props.component;

  return (
    <StyledComponent>
      <h2>{props.name}</h2>
      <UserComponent />
    </StyledComponent>
  );
};

export default Component;
