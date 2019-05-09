import * as React from "react";
import styled from "styled-components";
import {CounterExample, HelloWorldExample} from "../../../test/fixtures";
import {renderExample} from "../../App/context";
import {Example as ExampleModel} from "../../models";
import {margins, paddings} from "../../styles";

interface Props {
  example: ExampleModel;
  userTheme?: any;
}

const StyledExample = styled.div`
  padding: ${paddings.medium};
  margin: ${margins.none} ${margins.medium} ${margins.medium} ${margins.none};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  height: 100%;
`;

const Title = styled.div`
  font-size: ${props => props.theme.fontSizes.subtitle};
  margin-bottom: ${margins.small};
  color: ${props => props.theme.colors.text};
`;

const randId = () =>
  Math.random()
    .toString(36)
    .substr(2, 9);

class NoUpdate extends React.Component<Props> {
  private id: string = `example-${randId()}`;

  public componentDidMount() {
    renderExample(this.props.example, this.props.userTheme, this.id);
  }

  public componentDidUpdate() {
    renderExample(this.props.example, this.props.userTheme, this.id);
  }

  public shouldComponentUpdate(nextProps: Props) {
    return this.props.userTheme !== nextProps.userTheme;
  }

  public render() {
    return <div id={this.id} />;
  }
}

const Example = (props: Props) => (
  <StyledExample>
    <Title className="example-title">{props.example.name}</Title>
    <NoUpdate {...props} />
  </StyledExample>
);

Example.examples = [HelloWorldExample, CounterExample];

// @prodo
export default Example;
