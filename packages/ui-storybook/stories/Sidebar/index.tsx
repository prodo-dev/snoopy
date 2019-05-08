// tslint:disable:no-submodule-imports
import Sidebar from "@prodo/snoopy-ui/src/components/Sidebar";
import {darkTheme} from "@prodo/snoopy-ui/src/styles/theme";
// tslint:enable

import {action} from "@storybook/addon-actions";
import {storiesOf} from "@storybook/react";
import * as React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {ThemeProvider} from "styled-components";

const components = [
  {path: "foo/bar", name: "App", component: () => <div />},
  {path: "foo/bar", name: "ComponentA", component: () => <div />},
  {path: "foo/bar", name: "ComponentB", component: () => <div />},
];

storiesOf("Sidebar", module)
  .addDecorator((storyFn: any) => (
    <ThemeProvider theme={darkTheme}>{storyFn()}</ThemeProvider>
  ))
  .addDecorator((storyFn: any) => <Router>{storyFn()}</Router>)
  .add("closed", () => (
    <Sidebar
      isOpen={false}
      setSidebarOpen={action("setSidebarOpen")}
      components={components}
    />
  ))
  .add("open and empty", () => (
    <Sidebar
      isOpen={true}
      setSidebarOpen={action("setSidebarOpen")}
      components={[]}
    />
  ))
  .add("open with components", () => (
    <Sidebar
      isOpen={true}
      setSidebarOpen={action("setSidebarOpen")}
      components={components}
    />
  ));
