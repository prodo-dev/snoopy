import * as React from "react";
import {HomePage} from "../src/routes/HomePage";
import {emptyContext, testContext} from "../test/fixtures";

export default HomePage;

export const noComponents = () => (
  <HomePage
    context={emptyContext}
    selectedPaths={new Set([])}
    selectedTheme={null}
    setSelectedTheme={() => alert("setting theme")}
  />
);
noComponents.title = "No components";

export const withComponents = () => (
  <HomePage
    context={testContext}
    selectedPaths={new Set([])}
    selectedTheme={null}
    setSelectedTheme={() => alert("setting theme")}
  />
);
withComponents.title = "With components";
