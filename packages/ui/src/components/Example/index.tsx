import * as React from "react";
import styled from "styled-components";
import {renderExample} from "../../App/context";
import backgroundImage from "../../media/transparent_background.png";
import {Example as ExampleModel} from "../../models";
import {margins, paddings} from "../../styles";
import Highlighter from "../Highlighter";

interface Props {
  example: ExampleModel;
  userTheme?: any;
  allStyles?: string;
}

const StyledExample = styled.div`
  padding: ${paddings.medium};
  margin: ${margins.none} ${margins.medium} ${margins.medium} ${margins.none};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  height: 100%;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.normal};
`;

const Title = styled.div`
  font-size: ${props => props.theme.fontSizes.subtitle};
  margin-bottom: ${margins.small};
  color: ${props => props.theme.colors.text};
`;

const CodeContainer = styled.div``;

const DarkerJsxContainer = styled.div`
  background: linear-gradient(
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.2)
    ),
    url(${backgroundImage}) repeat;
  margin: 0 auto
  padding: ${paddings.medium};
  width: fit-content;
`;

const JsxContainer = styled.div`
  background: linear-gradient(
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 0.7)
    ),
    url(${backgroundImage}) repeat;
`;

const randId = () =>
  Math.random()
    .toString(36)
    .substr(2, 9);

class UserComponentContainer extends React.Component<Props> {
  private id: string = `example-${randId()}`;

  public componentDidMount() {
    renderExample(
      this.props.example,
      this.props.userTheme,
      this.id,
      this.props.allStyles || "",
    );
  }

  public componentDidUpdate() {
    renderExample(
      this.props.example,
      this.props.userTheme,
      this.id,
      this.props.allStyles || "",
    );
  }

  public render() {
    return <div id={this.id} />;
  }
}

const Example = (props: Props) => (
  <StyledExample>
    <Title className="example-title">{props.example.title}</Title>
    <DarkerJsxContainer>
      <JsxContainer>
        <UserComponentContainer {...props} />
      </JsxContainer>
    </DarkerJsxContainer>
    {props.example.source != null && (
      <CodeContainer>
        <Highlighter className="language-jsx">
          {props.example.source}
        </Highlighter>
      </CodeContainer>
    )}
  </StyledExample>
);

export default Example;
