import * as React from "react";
import styled from "styled-components";
import {Example as ExampleModel} from "../../models";
import {margins, paddings} from "../../styles";

interface Props {
  example: ExampleModel;
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

const Example = (props: Props) => (
  <StyledExample>
    <Title className="example-title">{props.example.name}</Title>
    <JsxContainer className="example-contents">
      {props.example.jsx}
    </JsxContainer>
  </StyledExample>
);

Example.examples = [
  {
    name: "Basic",
    jsx: <Example example={{name: "Title", jsx: <div>Hello World</div>}} />,
  },
];

// @prodo
export default Example;
