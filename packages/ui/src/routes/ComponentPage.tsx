import * as React from "react";
import {ComponentContainer} from "../components/ComponentContainer";
import {Readme, Toggle} from "../components/Docs";
import {Errors} from "../components/Errors";
import {Component as ComponentModel, Context} from "../models";

interface Props {
  component: ComponentModel;
  errors: string[];
  context: Context;
}

const ComponentPage = (props: Props) => (
  <>
    <Toggle>
      <Readme />
    </Toggle>

    <Errors errors={props.errors} />
    <ComponentContainer
      component={props.component}
      themes={props.context.themes}
      styles={props.context.styles}
    />
  </>
);

export default ComponentPage;
