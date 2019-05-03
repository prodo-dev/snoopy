import "react";
import {Component, Example, Theme} from "../models";

const userImport = require(process.env.PRODO_COMPONENTS_FILE!);

const components: Component[] = userImport.components;
const themes: Theme[] = userImport.themes;
const {UserReactDOM} = userImport;

export {components, themes};

export const renderExample = (example: Example, divId: string) => {
  UserReactDOM.render(example.jsx, document.getElementById(divId));
};
