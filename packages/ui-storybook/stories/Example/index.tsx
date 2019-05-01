// tslint:disable:no-submodule-imports
import Example from "@prodo/snoopy-ui/src/components/Example";
import {Example as ExampleModel} from "@prodo/snoopy-ui/src/models";
import {darkTheme} from "@prodo/snoopy-ui/src/styles/theme";
// tslint:enable

import {storiesOf} from "@storybook/react";
import * as React from "react";
import {ThemeProvider} from "styled-components";

const basicExample: ExampleModel = {name: "Title", jsx: <div>Hello World</div>};
const testExample: ExampleModel = {
  name: "Example 1",
  jsx: (
    <div
      style={{backgroundColor: "peachpuff", color: "magneta", padding: "1rem"}}
    >
      <h1>This is an example</h1>
    </div>
  ),
};

storiesOf("Example", module)
  .addDecorator((storyFn: any) => (
    <ThemeProvider theme={darkTheme}>{storyFn()}</ThemeProvider>
  ))
  .add("Basic", () => <Example example={basicExample} />)
  .add("Example 1", () => <Example example={testExample} />);
