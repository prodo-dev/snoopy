import * as _ from "lodash";
import styled from "styled-components";
import ErrorBoundary from "../components/ErrorBoundary";
import backgroundImage from "../media/transparent_background.png";
import {Component, Context, Example, FileError, Style, Theme} from "../models";
import {paddings} from "../styles";

// tslint:disable-next-line:no-var-requires
const userImport = require(process.env.PRODO_COMPONENTS_FILE!);

const {UserReact, UserReactDOM, StyledComponents, ReactRouterDOM} = userImport;
const React = UserReact;
const ThemeProvider =
  StyledComponents != null ? StyledComponents.ThemeProvider : null;
const MemoryRouter =
  ReactRouterDOM != null ? ReactRouterDOM.MemoryRouter : React.Fragment;

const findExamplesForComponent = (c: any) => {
  const exampleFileExport = userImport.examples.filter(
    (ex: any) => ex.default !== null && ex.default === c.component,
  )[0];

  if (!exampleFileExport) {
    return [];
  }

  const examples = Object.keys(
    _.omit(exampleFileExport, "__esModule", "default"),
  ).map(exportName => {
    const exampleReactComponent = exampleFileExport[exportName];
    return {
      title: exampleReactComponent.title || exportName,
      component: exampleReactComponent,
    };
  });

  return examples;
};

const components = userImport.components.map((c: Component) => ({
  ...c,
  examples: findExamplesForComponent(c),
}));

const themes: Theme[] = userImport.themes;
const styles: Style[] = userImport.styles;
const errors: FileError[] = userImport.errors;

export const context: Context = {components, themes, styles, errors};

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
  all: initial;
`;

export const userBodyId = "prodo-user-body";
const ApplyStyles = styled.div<{allStyles: string}>`
  ${props => props.allStyles}
`;

export const renderExample = (
  example: Example,
  theme: Theme,
  divId: string,
  allStyles: string,
) => {
  const UserComponent = () => {
    const ExampleComponent = example.component;

    return (
      <ErrorBoundary>
        <MemoryRouter>
          <Container>
            <DarkerJsxContainer>
              <JsxContainer className="example-contents">
                <ApplyStyles allStyles={allStyles}>
                  <div id={userBodyId}>
                    {theme && ThemeProvider ? (
                      <ThemeProvider theme={theme as any}>
                        <ExampleComponent />
                      </ThemeProvider>
                    ) : (
                      <ExampleComponent />
                    )}
                  </div>
                </ApplyStyles>
              </JsxContainer>
            </DarkerJsxContainer>
            {ReactRouterDOM != null && (
              <React.Fragment>
                <ReactRouterDOM.Route
                  path="/"
                  exact
                  component={() => <StyledLog />}
                />
                <ReactRouterDOM.Route
                  path="/:link+"
                  exact
                  component={LogRoute}
                />
              </React.Fragment>
            )}
          </Container>
        </MemoryRouter>
      </ErrorBoundary>
    );
  };

  UserReactDOM.render(<UserComponent />, document.getElementById(divId));
};
