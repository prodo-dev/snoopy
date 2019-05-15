import * as React from "react";
import Component from "../src/components/Component";
import {CounterModel, HelloNameModel, HelloWorldModel} from "../test/fixtures";

export default Component;

export const defaultExample = () => <Component component={HelloWorldModel} />;
defaultExample.title = "Default";

export const helloWorld = () => <Component component={HelloNameModel} />;
helloWorld.title = "Examples provided";

export const withReactState = () => <Component component={CounterModel} />;
withReactState.title = "With React State";
