import * as React from "react";
import styled from "styled-components";
import {Example} from "../../models";
import {margins, paddings} from "../../styles/theme";

interface Props {
  example: Example;
}

const StyledExample = styled.div`
  padding: ${paddings.medium};
  margin-right: ${margins.medium};
  border: 1px solid ${props => props.theme.colors.fg};
  border-radius: 4px;
`;

const JsxContainer = styled.div`
  background-color: white;
  color: black;
`;

const Title = styled.div`
  font-size: ${props => props.theme.fontSizes.subtitle};
  margin-bottom: ${margins.small};
`;

export default (props: Props) => (
  <StyledExample>
    <Title className="example-title">{props.example.name}</Title>
    <JsxContainer>{props.example.jsx}</JsxContainer>
  </StyledExample>
);
