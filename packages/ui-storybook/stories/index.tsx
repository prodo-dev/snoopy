// tslint:disable:no-submodule-imports
import Component from "@prodo/snoopy-ui/src/components/Component";
import {Component as ComponentModel} from "@prodo/snoopy-ui/src/models";
// tslint:enable

import {storiesOf} from "@storybook/react";
import * as React from "react";

const TestComponent: ComponentModel = {
  name: "TestComponent",
  component: () => <div>test</div>,
};

storiesOf("Component", module).add("base", () => (
  <Component component={TestComponent} />
));
