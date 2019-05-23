import * as _ from "lodash";
import ErrorBoundary from "../components/ErrorBoundary";
import {
  Component,
  Context,
  Example,
  ExampleImport,
  FileError,
  Style,
  Theme,
} from "../models";
import {paddings} from "../styles";

// tslint:disable:no-var-requires
const userImport = require(process.env.PRODO_COMPONENTS_FILE!);
const libImport = require(process.env.PRODO_LIB_FILE!);
// tslint:enable

const {UserReact, UserReactDOM, StyledComponents, ReactRouterDOM} = libImport;
const React = UserReact;
const ThemeProvider =
  StyledComponents != null ? StyledComponents.ThemeProvider : null;
const MemoryRouter =
  ReactRouterDOM != null ? ReactRouterDOM.MemoryRouter : React.Fragment;

const exampleImports: ExampleImport[] = userImport.examples;

const findExamplesForComponent = (c: Component): Example[] => {
  const exampleFileExport = exampleImports.filter(
    ex => ex.forComponent !== null && ex.forComponent === c.component,
  )[0];

  if (!exampleFileExport) {
    return [];
  }

  return exampleFileExport.examples.map(ex => ({
    ...ex,
    title: (ex.component as any).title || ex.title,
  }));
};

const components = _.uniqBy(
  userImport.components,
  (c: Component) => c.component,
).map((c: Component) => ({
  ...c,
  examples: findExamplesForComponent(c),
}));

const themes: Theme[] = userImport.themes;
const styles: Style[] = userImport.styles;
const errors: FileError[] = userImport.errors;

export const context: Context = {components, themes, styles, errors};

const StyledLog = ({children}: any) => (
  <div style={{paddingTop: paddings.small}}>{children}</div>
);

const LogRoute = (props: any) => (
  <StyledLog>
    This action would have redirected you to /
    {props.match && props.match.params && props.match.params.link}.
  </StyledLog>
);

export const userBodyId = "snoopy-user-body";
class ApplyStylesClass extends React.Component<{
  css: string;
  children: React.ReactNode;
}> {
  public componentDidMount() {
    let styleEl = document.querySelector(
      'style[generated-by="snoopy"][type="text/css"]',
    ) as HTMLStyleElement;

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.setAttribute("generated-by", "snoopy");
      styleEl.setAttribute("type", "text/css");
      styleEl.innerHTML = this.props.css;
      document.head.appendChild(styleEl);
    }
  }

  public render() {
    return this.props.children;
  }
}

const ApplyStyles = ApplyStylesClass as any;

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
          <div
            style={{
              all: "initial",
              width: "min-content",
            }}
          >
            <ApplyStyles css={allStyles}>
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
          </div>
        </MemoryRouter>
      </ErrorBoundary>
    );
  };

  UserReactDOM.render(<UserComponent />, document.getElementById(divId));
};
