import * as React from "react";

interface Props {
  renderError?: (error: Error, errorInfo: any) => React.ReactNode;
}

interface State {
  error: Error | null;
  errorInfo?: any;
}

class ErrorBoundary extends React.Component<Props> {
  public state: State = {error: null};

  public componentWillReceiveProps() {
    this.setState({error: null, errorInfo: undefined});
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    this.setState({error, errorInfo});
  }

  public render() {
    if (this.state.error && this.props.renderError) {
      return this.props.renderError(this.state.error, this.state.errorInfo);
    } else {
      return this.props.children;
    }
  }
}

(ErrorBoundary as any).examples = [
  {
    name: "No error",
    jsx: (
      <ErrorBoundary>
        <div>Hello world</div>
      </ErrorBoundary>
    ),
  },
];

// @prodo
export default ErrorBoundary;
