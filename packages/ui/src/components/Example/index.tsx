import {faSync} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import styled from "styled-components";
import {renderExample} from "../../App/context";
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

const ReloadButton = styled.div`
  background-color: #efefef99;
  position: absolute;
  top: 0;
  right: 0;
  border: 1px solid ${props => props.theme.colors.unselected};
  border-radius: 4px;
  padding: ${paddings.small};
  margin: ${margins.small};

  &:hover {
    cursor: pointer;
    background-color: #ec696999;
    border: 1px solid ${props => props.theme.colors.selected};
    svg {
      color: ${props => props.theme.colors.selected};
    }
  }

  &:active {
    box-shadow: inset 0px 0px 5px #808080;
  }
`;

const CodeContainer = styled.div``;

const randId = () =>
  Math.random()
    .toString(36)
    .substr(2, 9);

class UserComponentContainer extends React.Component<Props> {
  private id: string = `example-${randId()}`;

  public componentDidMount() {
    this.rerender();
  }

  public componentDidUpdate() {
    this.rerender();
  }

  public render() {
    return (
      <div style={{position: "relative"}}>
        <div id={this.id} />
        <ReloadButton onClick={this.onClickReload}>
          <Icon icon={faSync} color={"grey"} />
        </ReloadButton>
      </div>
    );
  }

  private onClickReload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.rerender();
  };

  private rerender() {
    renderExample(
      this.props.example,
      this.props.userTheme,
      this.id,
      this.props.allStyles || "",
    );
  }
}

const Example = (props: Props) => (
  <StyledExample>
    <Title className="example-title">{props.example.title}</Title>
    <UserComponentContainer {...props} />
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
