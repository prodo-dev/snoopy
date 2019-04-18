import {storiesOf} from "@storybook/react";
import * as React from "react";
import Component from "@prodo/snoopy-ui/src/components/Component";

const TestComponent = () => <div>This is a Test</div>;

storiesOf("Component", module).add("base", () => (
  <Component component={TestComponent} />
));
