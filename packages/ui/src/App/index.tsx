import {WebSocketEvents} from "@prodo-ai/snoopy-api";
import {createBrowserHistory} from "history";
import * as React from "react";
import {Provider} from "react-redux";
import {Route, RouteComponentProps, Router, Switch} from "react-router-dom";
import styled, {ThemeProvider} from "styled-components";
import {StyledPage, StyledPageContents} from "../components/Page";
import {NarrowScreen} from "../components/Responsive";
import Sidebar, {ConnectedSidebarToggle} from "../components/Sidebar";
import HomePage from "../routes/HomePage";
import NotFoundPage from "../routes/NotFoundPage";
import createStore from "../store";
import {paddings} from "../styles";
import {darkTheme} from "../styles/theme";
import {context} from "./context";

import "./index.css";

const history = createBrowserHistory();

const store = createStore(context);

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

const WithContextProvider = <Props extends {}>(
  ComponentNeedingContext: React.ComponentType<Props>,
) => (props: Props) => (
  <Provider store={store}>
    <ComponentNeedingContext {...props} />
  </Provider>
);

const AppPage = WithContextProvider(() => (
  <StyledPage>
    <Route
      path="/:path*"
      exact
      component={({match}: RouteComponentProps<{path: string}>) => (
        <>
          <Sidebar />

          <ContentContainer>
            <HeaderContainer>
              <NarrowScreen>
                <ConnectedSidebarToggle />
              </NarrowScreen>
              {match.params.path || "Snoopy, by Prodo"}
            </HeaderContainer>

            <StyledPageContents>
              <Switch>
                <Route path="/" exact component={HomePage} />
                <Route path="*" component={NotFoundPage} />
              </Switch>
            </StyledPageContents>
          </ContentContainer>
        </>
      )}
    />
  </StyledPage>
));

const App = () => {
  return (
    <Router history={history}>
      <ThemeProvider theme={darkTheme}>
        <AppPage />
      </ThemeProvider>
    </Router>
  );
};

const ContentContainer = styled.div`
  width: 100%;
`;

const HeaderContainer = styled.div`
  padding: ${paddings.medium} ${paddings.large};
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.theme.colors.fg};

  .sidebar-toggle {
    margin-left: 0;
  }
`;

// @snoopy:ignore
export default App;
