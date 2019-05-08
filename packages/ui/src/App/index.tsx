import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import {ThemeProvider} from "styled-components";
import {Component, Theme} from "../models";
import ComponentPage from "../routes/ComponentPage";
import HomePage from "../routes/HomePage";
import {darkTheme} from "../styles/theme";
import {components, themes} from "./userImport";

import "./index.css";

const ComponentPageWithProps = (
  props: {components: Component[]; themes: Theme[]} & RouteComponentProps<{
    path: string;
    name: string;
  }>,
) => {
  const component = props.components.filter(
    c =>
      c.path === props.match.params.path && c.name === props.match.params.name,
  )[0];
  return <ComponentPage component={component} {...props} />;
};

const WithComponents = <Props extends {}>(
  // tslint:disable-next-line:no-shadowed-variable
  Component: React.ComponentType<Props>,
) => (props: Props) => {
  return <Component components={components} themes={themes} {...props} />;
};

const App = () => (
  <ThemeProvider theme={darkTheme}>
    <Router>
      <Switch>
        <Route path="/" exact component={WithComponents(HomePage)} />
        <Route
          path="/:path+/:name"
          exact
          component={WithComponents(ComponentPageWithProps)}
        />
      </Switch>
    </Router>
  </ThemeProvider>
);

export default App;
