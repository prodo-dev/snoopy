import * as React from "react";
import styled from "styled-components";
import Readme from "../../../../README.mdx";
import {emptyContext, testContext} from "../../test/fixtures";
import ComponentList from "../components/ComponentList";
import {StyledPage, StyledPageContents} from "../components/Page";
import {Component, Context} from "../models";

interface Props {
  context: Context;
}

const StyledMarkdown = styled.div`
  a {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const HomePage = (props: Props) => (
  <StyledPage>
    <StyledPageContents>
      <StyledMarkdown>
        <Readme />
      </StyledMarkdown>
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
