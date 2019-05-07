import {ThemeProvider} from "styled-components";
import {Component, Example, Theme} from "../models";

// tslint:disable-next-line:no-var-requires
const userImport = require(process.env.PRODO_COMPONENTS_FILE!);

const {UserReact, UserReactDOM} = userImport;
const React = UserReact;

const components: Component[] = userImport.components;
const themes: Theme[] = userImport.themes;

export {components, themes};

export const renderExample = (
  example: Example,
  theme: Theme,
  divId: string,
) => {
  const UserComponent = () =>
    theme ? (
      <ThemeProvider theme={theme as any}>
        <>{example.jsx}</>
      </ThemeProvider>
    ) : (
      <>{example.jsx}</>
    );

  UserReactDOM.render(<UserComponent />, document.getElementById(divId));
};
