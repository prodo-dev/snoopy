// tslint:disable-next-line:no-submodule-imports
import Component from "@prodo/snoopy-ui/src/components/Component";

import {storiesOf} from "@storybook/react";
import * as React from "react";

const TestComponent = () => <div>This is a Test</div>;

storiesOf("Component", module).add("base", () => (
  <Component name="TestComponent" component={TestComponent} />
));
