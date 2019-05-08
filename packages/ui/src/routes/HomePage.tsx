import * as React from "react";
import ComponentList from "../components/ComponentList";
import {StyledPage, StyledPageContents} from "../components/Page";
import {Context} from "../models";

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
      <ComponentList components={props.context.components} full />
    </StyledPageContents>
  </StyledPage>
);

export default HomePage;
