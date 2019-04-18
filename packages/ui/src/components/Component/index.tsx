import * as React from "react";
import styled from "styled-components";

const StyledComponent = styled.div`
  border: solid 1px black;
`;

interface Props {
  component: React.ReactNode;
}

const Component = (props: Props) => {
  const C: any = props.component;

  return (
    <StyledComponent>
      <C />
    </StyledComponent>
  );
};

export default Component;
