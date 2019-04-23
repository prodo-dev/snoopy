// tslint:disable:no-submodule-imports
import Component from "@prodo/snoopy-ui/src/components/Component";
import {Component as ComponentModel} from "@prodo/snoopy-ui/src/models";
// tslint:enable

import {storiesOf} from "@storybook/react";
import * as React from "react";

const TestComponent = ({name}: {name: string}) => <div>{name}</div>;

TestComponent.examples = [
  {name: "Example 1", jsx: <TestComponent name="Tom" />},
];

const Test: ComponentModel = {
  name: "TestComponent",
  component: TestComponent,
};

storiesOf("Component", module).add("base", () => (
  <Component component={Test} />
));
