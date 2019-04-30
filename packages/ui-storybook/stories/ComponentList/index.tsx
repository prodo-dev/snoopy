// tslint:disable:no-submodule-imports
import ComponentList from "@prodo/snoopy-ui/src/components/ComponentList";
import {Component as ComponentModel} from "@prodo/snoopy-ui/src/models";
import {darkTheme} from "@prodo/snoopy-ui/src/styles/theme";
// tslint:enable

import {storiesOf} from "@storybook/react";
import * as React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {ThemeProvider} from "styled-components";

const One = () => <div />;
const OneModel: ComponentModel = {
  name: "One",
  component: One,
};

const Two = () => <div />;
const TwoModel: ComponentModel = {
  name: "Two",
  component: Two,
};

storiesOf("Component List", module)
  .addDecorator((storyFn: any) => (
    <ThemeProvider theme={darkTheme}>{storyFn()}</ThemeProvider>
  ))
  .addDecorator(storyFn => <Router>{storyFn()}</Router>)
  .add("single item", () => <ComponentList components={[OneModel]} />)
  .add("multiple items", () => (
    <ComponentList components={[OneModel, TwoModel]} />
  ));
