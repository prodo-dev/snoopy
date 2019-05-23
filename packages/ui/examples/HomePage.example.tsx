import * as React from "react";
import HomePage from "../src/routes/HomePage";
import {emptyContext, testContext} from "../test/fixtures";

export default HomePage;

export const noComponents = () => (
  <HomePage context={emptyContext} components={[]} errors={[]} />
);
noComponents.title = "No components";

export const withComponents = () => (
  <HomePage context={testContext} components={[]} errors={[]} />
);
withComponents.title = "With components";
