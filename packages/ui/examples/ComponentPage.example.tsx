import * as React from "react";
import {ComponentPage} from "../src/routes/ComponentPage";
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
    filepath=""
    selectedPaths={new Set([])}
    selectedTheme={null}
    setSelectedTheme={() => alert("setting theme")}
  />
);
noThemes.title = "No Themes";

export const withThemes = () => (
  <ComponentPage
    context={testContext}
    filepath=""
    selectedPaths={new Set([])}
    selectedTheme={null}
    setSelectedTheme={() => alert("setting theme")}
  />
);
withThemes.title = "With Themes";
