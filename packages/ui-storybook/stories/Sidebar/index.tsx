// tslint:disable:no-submodule-imports
import {Sidebar} from "@prodo-ai/snoopy-ui/src/components/Sidebar";
import {darkTheme} from "@prodo-ai/snoopy-ui/src/styles/theme";
import {Component as ComponentModel} from "@prodo-ai/snoopy-ui/src/models";
// tslint:enable

import {action} from "@storybook/addon-actions";
import {storiesOf} from "@storybook/react";
import * as React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {ThemeProvider} from "styled-components";

const components: ComponentModel[] = [
  {path: "foo/bar", name: "App", component: () => <div />, examples: []},
  {
    path: "foo/bar",
    name: "ComponentA",
    component: () => <div />,
    examples: [],
  },
  {
    path: "foo/bar",
    name: "ComponentB",
    component: () => <div />,
    examples: [],
  },
];

storiesOf("Sidebar", module)
  .addDecorator((storyFn: any) => (
    <ThemeProvider theme={darkTheme}>{storyFn()}</ThemeProvider>
  ))
  .addDecorator((storyFn: any) => <Router>{storyFn()}</Router>)
  .add("closed", () => (
    <Sidebar
      components={components}
      isOpen={false}
      setSidebarOpen={action("setSidebarOpen")}
      selected={new Set()}
      select={action("select")}
    />
  ))
  .add("open and empty", () => (
    <Sidebar
      components={[]}
      isOpen={true}
      setSidebarOpen={action("setSidebarOpen")}
      selected={new Set()}
      select={action("select")}
    />
  ))
  .add("open with components", () => (
    <Sidebar
      components={components}
      isOpen={true}
      setSidebarOpen={action("setSidebarOpen")}
      selected={new Set()}
      select={action("select")}
    />
  ));
