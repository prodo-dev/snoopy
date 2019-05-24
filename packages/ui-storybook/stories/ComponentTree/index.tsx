// tslint:disable:no-submodule-imports
import ComponentTree from "@prodo-ai/snoopy-ui/src/components/ComponentTree";
import {Component as ComponentModel} from "@prodo-ai/snoopy-ui/src/models";
import {darkTheme} from "@prodo-ai/snoopy-ui/src/styles/theme";
// tslint:enable

import {action} from "@storybook/addon-actions";
import {storiesOf} from "@storybook/react";
import * as React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {ThemeProvider} from "styled-components";

const One = () => <div />;
const OneModel: ComponentModel = {
  path: "foo/bar",
  name: "One",
  component: One,
  examples: [],
};

const Two = () => <div />;
const TwoModel: ComponentModel = {
  path: "foo/bar",
  name: "Two",
  component: Two,
  examples: [],
};

const Three = () => <div />;
const ThreeModel: ComponentModel = {
  path: "foo/bar",
  name: "Three",
  component: Three,
  examples: [],
};

storiesOf("Component List", module)
  .addDecorator((storyFn: any) => (
    <ThemeProvider theme={darkTheme}>{storyFn()}</ThemeProvider>
  ))
  .addDecorator(storyFn => <Router>{storyFn()}</Router>)
  .add("empty", () => (
    <ComponentTree components={[]} selected={[]} select={action("select")} />
  ))
  .add("single item", () => (
    <ComponentTree
      components={[OneModel]}
      selected={[]}
      select={action("select")}
    />
  ))
  .add("single item with selection", () => (
    <ComponentTree
      components={[OneModel]}
      selected={[OneModel.path]}
      select={action("select")}
    />
  ))
  .add("multiple items", () => (
    <ComponentTree
      components={[OneModel, TwoModel, ThreeModel]}
      selected={[]}
      select={action("select")}
    />
  ))
  .add("multiple items with selection", () => (
    <ComponentTree
      components={[OneModel, TwoModel, ThreeModel]}
      selected={[TwoModel.path]}
      select={action("select")}
    />
  ));
