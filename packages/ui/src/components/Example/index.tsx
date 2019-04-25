import * as React from "react";
import styled from "styled-components";
import {Example} from "../../models";
import {margins, paddings} from "../../styles";

interface Props {
  example: Example;
}

const StyledExample = styled.div`
  padding: ${paddings.medium};
  margin: ${margins.none} ${margins.medium} ${margins.medium} ${margins.none};
  border: 1px solid ${props => props.theme.colors.border};
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
    <JsxContainer className="example-contents">
      {props.example.jsx}
    </JsxContainer>
  </StyledExample>
);
