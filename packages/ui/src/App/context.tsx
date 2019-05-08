import {Component, Context, Example, Theme} from "../models";

// tslint:disable-next-line:no-var-requires
const userImport = require(process.env.PRODO_COMPONENTS_FILE!);

const {UserReact, UserReactDOM, StyledComponents} = userImport;

const React = UserReact;
const ThemeProvider =
  StyledComponents != null ? StyledComponents.ThemeProvider : null;

const components: Component[] = userImport.components;
const themes: Theme[] = userImport.themes;

export const context: Context = {components, themes};

export const renderExample = (
  example: Example,
  theme: Theme,
  divId: string,
) => {
  const UserComponent = () =>
    theme && ThemeProvider ? (
      <ThemeProvider theme={theme as any}>
        <>{example.jsx}</>
      </ThemeProvider>
    ) : (
      <>{example.jsx}</>
    );

  UserReactDOM.render(<UserComponent />, document.getElementById(divId));
};
