import * as _ from "lodash";
import ErrorBoundary from "../components/ErrorBoundary";
import backgroundImage from "../media/transparent_background.png";
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

const createContext = (
  components: Component[],
  themes: Theme[],
  styles: Style[],
  errors: FileError[],
): Context => {
  const keyedThemes: {[name: string]: Theme} = _.transform(
    themes,
    (result, theme) => {
      result[theme.name] = theme;
    },
    {},
  );

  return {components, themes: keyedThemes, styles, errors};
};

export const context: Context = createContext(
  _.uniqBy(userImport.components, (c: Component) => c.component).map(
    (c: Component) => ({
      ...c,
      examples: findExamplesForComponent(c),
    }),
  ) as Component[],
  userImport.themes as Theme[],
  userImport.styles as Style[],
  userImport.errors as FileError[],
);

const DarkerJsxContainer = ({children}: any) => (
  <div
    style={{
      background: `linear-gradient(
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.2)
  ),
  url(${backgroundImage}) repeat`,
      padding: paddings.medium,
      width: "fit-content",
    }}
  >
    {children}
  </div>
);

const JsxContainer = ({children}: any) => (
  <div
    style={{
      background: `linear-gradient(
  rgba(255, 255, 255, 0.7),
  rgba(255, 255, 255, 0.7)
  ),
  url(${backgroundImage}) repeat`,
      all: "initial",
    }}
  >
    {children}
  </div>
);

const StyledLog = ({children}: any) => (
  <div style={{paddingTop: paddings.small}} color="black">
    {children}
  </div>
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
            <DarkerJsxContainer>
              <JsxContainer className="example-contents">
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
              </JsxContainer>
            </DarkerJsxContainer>
          </div>

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
        </MemoryRouter>
      </ErrorBoundary>
    );
  };

  UserReactDOM.render(<UserComponent />, document.getElementById(divId));
};
