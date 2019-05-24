import {WebSocketEvents} from "@prodo-ai/snoopy-api";
import {createBrowserHistory} from "history";
import * as React from "react";
import {Route, RouteComponentProps, Router, Switch} from "react-router-dom";
import styled, {ThemeProvider} from "styled-components";
import {StyledPage, StyledPageContents} from "../components/Page";
import {NarrowScreen} from "../components/Responsive";
import Sidebar, {SidebarToggle} from "../components/Sidebar";
import {Context} from "../models";
import ComponentPage from "../routes/ComponentPage";
import HomePage from "../routes/HomePage";
import NotFoundPage from "../routes/NotFoundPage";
import {NarrowScreenWidth, paddings} from "../styles";
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
  const matchingPath = ({path}: {path: string}) =>
    path === props.match.params.path;
  const components = props.context.components.filter(matchingPath);
  const fileError = props.context.errors.filter(matchingPath);
  const errors = fileError.length !== 0 ? fileError[0].errors : [];

  if (components.length === 0) {
    return (
      <NotFoundPage
        filepath={props.match.params.path}
        context={props.context}
      />
    );
  }

  return <ComponentPage component={components[0]} errors={errors} {...props} />;
};

const WithContext = <Props extends {}>(
  ComponentNeedingContext: React.ComponentType<Props>,
  selectedPaths?: string[],
) => (props: Props) => {
  return (
    <ComponentNeedingContext
      context={context}
      selectedPaths={selectedPaths}
      {...props}
    />
  );
};

const HomePageWithProps = (props: {
  context: Context;
  selectedPaths: string[];
}) => {
  const matchingSelectedPaths = ({path}: {path: string}) =>
    props.selectedPaths.includes(path);
  const components = props.context.components.filter(matchingSelectedPaths);
  const fileError = props.context.errors.filter(matchingSelectedPaths);
  const errors = fileError.length !== 0 ? fileError[0].errors : [];

  return <HomePage components={components} errors={errors} {...props} />;
};

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(
    window.innerWidth > NarrowScreenWidth,
  );
  const [selectedPaths, setSelectedPaths] = React.useState(
    context.components.map(x => x.path) as string[],
  );

  if (window.location.pathname === "/" && selectedPaths.length === 1) {
    history.push(`/${selectedPaths[0]}`);
  } else if (window.location.pathname !== "/" && selectedPaths.length !== 1) {
    history.push("/");
  }

  return (
    <Router history={history}>
      <ThemeProvider theme={darkTheme}>
        <StyledPage>
          <Route
            path="/:path*"
            exact
            component={({match}: RouteComponentProps<{path: string}>) => (
              <>
                <Sidebar
                  components={context.components}
                  isOpen={isSidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  selected={selectedPaths}
                  select={setSelectedPaths}
                />

                <ContentContainer>
                  <HeaderContainer>
                    <NarrowScreen>
                      <SidebarToggle
                        isOpen={isSidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                      />
                    </NarrowScreen>
                    {match.params.path || "Snoopy, by Prodo"}
                  </HeaderContainer>

                  <StyledPageContents>
                    <Switch>
                      <Route
                        path="/"
                        exact
                        component={WithContext(
                          HomePageWithProps,
                          selectedPaths,
                        )}
                      />
                      <Route
                        path="/:path+"
                        exact
                        component={WithContext(ComponentPageWithProps)}
                      />
                    </Switch>
                  </StyledPageContents>
                </ContentContainer>
              </>
            )}
          />
        </StyledPage>
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
