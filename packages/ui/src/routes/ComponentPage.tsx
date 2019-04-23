import * as React from "react";
import Component from "../components/Component";
import {Component as ComponentModel} from "../models";

interface Props {
  component: ComponentModel;
}

const ComponentPage = (props: Props) => (
  <div>
    <h1>{props.component.name}</h1>
    <Component key={props.component.name} component={props.component} />
  </div>
);

export default ComponentPage;
