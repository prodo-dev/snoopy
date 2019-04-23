import * as React from "react";
import styled from "styled-components";
import {Example} from "../../models";

interface Props {
  example: Example;
}

const StyledExample = styled.div``;

const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.subtitle};
`;

export default (props: Props) => (
  <StyledExample>
    <Title>{props.example.name}</Title>
    {props.example.jsx}
  </StyledExample>
);
