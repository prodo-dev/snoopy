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

const testExample: ExampleModel = {
  name: "Example 1",
  jsx: (
    <div
      style={{backgroundColor: "peachpuff", color: "magneta", padding: "1rem"}}
    >
      <h1>This is an example</h1>
    </div>
  ),
};

Example.examples = [
  {
    name: "Basic",
    jsx: <Example example={{name: "Title", jsx: <div>Hello World</div>}} />,
  },
  testExample,
];

// @prodo
export default Example;
