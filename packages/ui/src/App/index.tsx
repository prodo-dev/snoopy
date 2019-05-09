import {WebSocketEvents} from "@prodo/snoopy-api";
import {createBrowserHistory} from "history";
import * as React from "react";
import {Route, RouteComponentProps, Router, Switch} from "react-router-dom";
import {ThemeProvider} from "styled-components";
import {Context} from "../models";
import ComponentPage from "../routes/ComponentPage";
import HomePage from "../routes/HomePage";
import {darkTheme} from "../styles/theme";
import {context} from "./context";

import "./index.css";

const history = createBrowserHistory();

const socket = new WebSocket(location.origin.replace(/^http(s?):/, "ws$1:"));
socket.addEventListener("message", event => {
  const data = JSON.parse(event.data);
  if (data.type === WebSocketEvents.OPEN_FILE) {
    const file = data.file;
    if (context.components.map(component => component.path).includes(file)) {
      history.push(`/${file}`);
    }
  }
});

const ComponentPageWithProps = (
  props: {context: Context} & RouteComponentProps<{
    path: string;
  }>,
) => {
  const components = props.context.components.filter(
    c => c.path === props.match.params.path,
  );
  console.log("HERE");
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
    <Router history={history}>
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

// @prodo
export default App;
