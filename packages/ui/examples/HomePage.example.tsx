import * as React from "react";
import HomePage from "../src/routes/HomePage";
import {emptyContext, testContext} from "../test/fixtures";

export default HomePage;

export const noComponents = () => <HomePage context={emptyContext} />;
noComponents.title = "No components";

export const withComponents = () => <HomePage context={testContext} />;
withComponents.title = "With components";
