import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import {ThemeProvider} from "styled-components";
import {Context} from "../models";
import ComponentPage from "../routes/ComponentPage";
import HomePage from "../routes/HomePage";
import {darkTheme} from "../styles/theme";
import {context} from "./context";

import "./index.css";

const ComponentPageWithProps = (
  props: {context: Context} & RouteComponentProps<{
    path: string;
  }>,
) => {
  const components = props.context.components.filter(
    c => c.path === props.match.params.path,
  );
  return (
    <ComponentPage
      path={props.match.params.path}
      components={components}
      {...props}
    />
  );
};

const WithContext = <Props extends {}>(
  // tslint:disable-next-line:no-shadowed-variable
  Component: React.ComponentType<Props>,
) => (props: Props) => {
  return <Component context={context} {...props} />;
};

const App = () => (
  <ThemeProvider theme={darkTheme}>
    <Router>
      <Switch>
        <Route path="/" exact component={WithContext(HomePage)} />
        <Route
          path="/:path+"
          exact
          component={WithContext(ComponentPageWithProps)}
        />
      </Switch>
    </Router>
  </ThemeProvider>
);

export default App;
