import styled from "styled-components";
import ErrorBoundary from "../components/ErrorBoundary";
import backgroundImage from "../media/transparent_background.png";
import {Component, Context, Example, Theme} from "../models";
import {paddings} from "../styles";

// tslint:disable-next-line:no-var-requires
const userImport = require(process.env.PRODO_COMPONENTS_FILE!);

const {UserReact, UserReactDOM, StyledComponents, ReactRouterDOM} = userImport;
const React = UserReact;
const ThemeProvider =
  StyledComponents != null ? StyledComponents.ThemeProvider : null;
const MemoryRouter =
  ReactRouterDOM != null ? ReactRouterDOM.MemoryRouter : React.Fragment;

const components: Component[] = userImport.components;
const themes: Theme[] = userImport.themes;

export const context: Context = {components, themes};

const StyledLog = styled.div`
  padding-top: ${paddings.small};
`;

const Container = styled.div`
  width: min-content;
`;

const LogRoute = (props: any) => (
  <StyledLog>
    This action would have redirected you to /
    {props.match && props.match.params && props.match.params.link}.
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
      <MemoryRouter>
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
          {ReactRouterDOM != null && (
            <React.Fragment>
              <ReactRouterDOM.Route
                path="/"
                exact
                component={() => <StyledLog />}
              />
              <ReactRouterDOM.Route path="/:link+" exact component={LogRoute} />
            </React.Fragment>
          )}
        </Container>
      </MemoryRouter>
    </ErrorBoundary>
  );

  UserReactDOM.render(<UserComponent />, document.getElementById(divId));
};
