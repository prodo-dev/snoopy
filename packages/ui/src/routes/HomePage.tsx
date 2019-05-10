import * as React from "react";
import {emptyContext, testContext} from "../../test/fixtures";
import ComponentList from "../components/ComponentList";
import {StyledPage, StyledPageContents} from "../components/Page";
import {Component, Context} from "../models";

interface Props {
  context: Context;
}

const HomePage = (props: Props) => (
  <StyledPage>
    <StyledPageContents>
      <h1>Snoopy</h1>
      <p>
        Add <code>// @prodo</code> in the line above your exported components to
        see them with Snoopy.
      </p>
      <h2>Your components</h2>
      <ComponentList
        components={props.context.components.filter(
          (c: Component) => c != null,
        )}
        full
      />
    </StyledPageContents>
  </StyledPage>
);

HomePage.examples = [
  {
    name: "No components",
    jsx: <HomePage context={emptyContext} />,
  },
  {
    name: "With components",
    jsx: <HomePage context={testContext} />,
  },
];

// @prodo
export default HomePage;
