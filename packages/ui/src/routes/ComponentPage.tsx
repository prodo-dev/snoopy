import * as React from "react";
import {ComponentContainer} from "../components/ComponentContainer";
import {Readme, Toggle} from "../components/Docs";
import {Errors} from "../components/Errors";
import {Component as ComponentModel, Context} from "../models";

interface Props {
  components: ComponentModel[];
  errors: string[];
  context: Context;
}

const ComponentPage = (props: Props) => {
  const component = props.components[0]; // TODO temp

  return (
    <>
      <Toggle>
        <Readme />
      </Toggle>

      <Errors errors={props.errors} />
      <ComponentContainer
        component={component}
        themes={props.context.themes}
        styles={props.context.styles}
      />
    </>
  );
};

// @prodo
export default ComponentPage;
