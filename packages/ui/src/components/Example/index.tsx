import * as React from "react";
import styled, {ThemeProvider} from "styled-components";
import backgroundImage from "../../media/transparent_background.png";
import {Example} from "../../models";
import {margins, paddings} from "../../styles";
import ErrorBoundary from "../ErrorBoundary";

interface Props {
  example: Example;
  userTheme?: any;
}

const StyledExample = styled.div`
  padding: ${paddings.medium};
  margin: ${margins.none} ${margins.medium} ${margins.medium} ${margins.none};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
`;

const Container = styled.div`
  background: linear-gradient(
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.2)
    ),
    url(${backgroundImage}) repeat;
  padding: ${paddings.medium};
`;

const JsxContainer = styled.div`
  background: linear-gradient(
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 0.7)
    ),
    url(${backgroundImage}) repeat;
`;

const Title = styled.div`
  font-size: ${props => props.theme.fontSizes.subtitle};
  margin-bottom: ${margins.small};
  color: ${props => props.theme.colors.text};
`;

const ExampleError = styled.div`
  color: ${props => props.theme.colors.error};
`;

const renderExampleError = (error: Error) => (
  <ExampleError>
    Error: {error && error.message && error.message.split("\n")[0]}
  </ExampleError>
);

export default (props: Props) => (
  <StyledExample>
    <Title className="example-title">{props.example.name}</Title>
    {props.userTheme ? (
      <ErrorBoundary renderError={renderExampleError}>
        <ThemeProvider theme={props.userTheme}>
          <Container>
            <JsxContainer className="example-contents">
              {props.example.jsx}
            </JsxContainer>
          </Container>
        </ThemeProvider>
      </ErrorBoundary>
    ) : (
      <ErrorBoundary renderError={renderExampleError}>
        <Container>
          <JsxContainer className="example-contents">
            {props.example.jsx}
          </JsxContainer>
        </Container>
      </ErrorBoundary>
    )}
  </StyledExample>
);
