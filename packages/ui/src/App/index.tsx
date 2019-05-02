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

import "./index.css";

const ComponentPageWithProps = (
  props: {components: Component[]; themes: Theme[]} & RouteComponentProps<{
    name: string;
  }>,
) => {
  const component = props.components.filter(
    c => c.name.toLowerCase() === props.match.params.name.toLowerCase(),
  )[0];
  return <ComponentPage component={component} {...props} />;
};

// tslint:disable-next-line:no-shadowed-variable
const WithComponents = (Component: React.ComponentType<any>) => (
  props: any,
) => {
  const {components, themes} = require(process.env.PRODO_COMPONENTS_FILE!);
  return <Component components={components} themes={themes} {...props} />;
};

const App = () => (
  <ThemeProvider theme={darkTheme}>
    <Router>
      <Switch>
        <Route path="/" exact component={WithComponents(HomePage)} />
        <Route
          path="/:name"
          exact
          component={WithComponents(ComponentPageWithProps)}
        />
      </Switch>
    </Router>
  </ThemeProvider>
);

export default App;
