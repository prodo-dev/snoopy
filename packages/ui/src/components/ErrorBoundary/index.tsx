import * as React from "react";
import styled from "styled-components";
import {paddings} from "../../styles";
import {darkTheme} from "../../styles/theme";

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
  errorInfo?: any;
}

const StyledError = styled.div`
  color: ${darkTheme.colors.error};
  background-color: ${darkTheme.colors.errorBg};
  padding: ${paddings.small};
`;

const renderError = (error: Error) => (
  <StyledError>
    Error: {error && error.message && error.message.split("\n")[0]}
  </StyledError>
);

class ErrorBoundary extends React.Component<Props> {
  public state: State = {error: null};

  public componentWillReceiveProps() {
    this.setState({error: null, errorInfo: undefined});
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    this.setState({error, errorInfo});
  }

  public render() {
    if (this.state.error) {
      return renderError(this.state.error);
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
