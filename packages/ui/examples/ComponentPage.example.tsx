import * as React from "react";
import ComponentPage from "../src/routes/ComponentPage";
import {testComponents, testContext, testStyles} from "../test/fixtures";

export default ComponentPage;

export const noThemes = () => (
  <ComponentPage
    context={{
      components: testComponents,
      themes: [],
      styles: testStyles,
      errors: [],
    }}
    path={testComponents[0].path}
    components={[testComponents[0]]}
    errors={[]}
  />
);
noThemes.title = "No Themes";

export const withThemes = () => (
  <ComponentPage
    context={testContext}
    path={testComponents[0].path}
    components={[testComponents[0]]}
    errors={[]}
  />
);
withThemes.title = "With Themes";
