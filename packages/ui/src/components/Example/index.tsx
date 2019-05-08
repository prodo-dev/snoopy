import * as React from "react";
import styled from "styled-components";
import {renderExample} from "../../App/context";
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
  height: 100%;
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
  background-color: ${props => props.theme.colors.errorBg};
  padding: ${paddings.small};
`;

const renderExampleError = (error: Error) => (
  <ExampleError>
    Error: {error && error.message && error.message.split("\n")[0]}
  </ExampleError>
);

const randId = () =>
  Math.random()
    .toString(36)
    .substr(2, 9);

class NoUpdate extends React.Component<Props> {
  private id: string = `example-${randId()}`;

  public componentDidMount() {
    renderExample(this.props.example, this.props.userTheme, this.id);
  }

  public shouldComponentUpdate() {
    return false;
  }

  public render() {
    return <div id={this.id} />;
  }
}

export default (props: Props) => (
  <StyledExample>
    <Title className="example-title">{props.example.name}</Title>
    <Container>
      <ErrorBoundary renderError={renderExampleError}>
        <JsxContainer className="example-contents">
          <NoUpdate {...props} />
        </JsxContainer>
      </ErrorBoundary>
    </Container>
  </StyledExample>
);
