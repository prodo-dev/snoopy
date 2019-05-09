import {
  MemoryRouter as Router,
  Route,
  RouteComponentProps,
} from "react-router-dom";
import styled from "styled-components";
import ErrorBoundary from "../components/ErrorBoundary";
import backgroundImage from "../media/transparent_background.png";
import {Component, Context, Example, Theme} from "../models";
import {paddings} from "../styles";

// tslint:disable-next-line:no-var-requires
const userImport = require(process.env.PRODO_COMPONENTS_FILE!);

const {UserReact, UserReactDOM, StyledComponents} = userImport;

const React = UserReact;
const ThemeProvider =
  StyledComponents != null ? StyledComponents.ThemeProvider : null;

const components: Component[] = userImport.components;
const themes: Theme[] = userImport.themes;

export const context: Context = {components, themes};

const StyledLog = styled.div`
  padding-top: ${paddings.small};
`;

const Container = styled.div`
  width: min-content;
`;

const LogRoute = (
  props: RouteComponentProps<{
    link: string;
  }>,
) => (
  <StyledLog>
    This action would have redirected you to /{props.match.params.link}.
  </StyledLog>
);

const DarkerJsxContainer = styled.div`
  background: linear-gradient(
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.2)
    ),
    url(${backgroundImage}) repeat;
  padding: ${paddings.medium};
  width: fit-content;
`;

const JsxContainer = styled.div`
  background: linear-gradient(
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 0.7)
    ),
    url(${backgroundImage}) repeat;
`;

export const renderExample = (
  example: Example,
  theme: Theme,
  divId: string,
) => {
  const UserComponent = () => (
    <ErrorBoundary>
      <Router>
        <Container>
          <DarkerJsxContainer>
            <JsxContainer className="example-contents">
              {theme && ThemeProvider ? (
                <ThemeProvider theme={theme as any}>
                  <>{example.jsx}</>
                </ThemeProvider>
              ) : (
                <>{example.jsx}</>
              )}
            </JsxContainer>
          </DarkerJsxContainer>
          <Route path="/" exact component={() => <StyledLog />} />
          <Route path="/:link+" exact component={LogRoute} />
        </Container>
      </Router>
    </ErrorBoundary>
  );

  UserReactDOM.render(<UserComponent />, document.getElementById(divId));
};
