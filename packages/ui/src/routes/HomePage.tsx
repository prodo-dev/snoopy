import * as React from "react";
import ComponentList from "../components/ComponentList";
import {Readme, Toggle} from "../components/Docs";
import {Context} from "../models";

interface Props {
  context: Context;
}

const HomePage = ({context}: Props) => {
  const hasComponents = context.components.length > 0;

  if (!hasComponents) {
    return <Readme />;
  }

  return (
    <>
      <Toggle>
        <Readme />
      </Toggle>

      <h2>Your components</h2>
      <ComponentList components={context.components} />
    </>
  );
};

// @prodo
export default HomePage;
