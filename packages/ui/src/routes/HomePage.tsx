import {faCaretDown, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MDXProvider} from "@mdx-js/react";
import * as React from "react";
import styled from "styled-components";
import Readme from "../../../../README.mdx";
import {emptyContext, testContext} from "../../test/fixtures";
import ComponentList from "../components/ComponentList";
import Highlighter from "../components/Highlighter";
import {StyledPage, StyledPageContents} from "../components/Page";
import {Component, Context} from "../models";

interface Props {
  context: Context;
}

const StyledMarkdown = styled.div`
  max-width: 70ch;
  line-height: 1.4;
  a {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const StyledDocsToggle = styled.div`
  font-size: ${props => props.theme.fontSizes.subtitle};
`;

const HomePage = (props: Props) => {
  const [showDocs, setShowDocs] = React.useState(
    props.context.components.length === 0,
  );
  const mdxComponents = {code: Highlighter};

  return (
    <StyledPage>
      <StyledPageContents>
        {showDocs ? (
          <React.Fragment>
            <StyledDocsToggle onClick={() => setShowDocs(false)}>
              <FontAwesomeIcon icon={faCaretDown} /> Hide documentation
            </StyledDocsToggle>
            <MDXProvider components={mdxComponents}>
              <StyledMarkdown>
                <Readme />
              </StyledMarkdown>
            </MDXProvider>
          </React.Fragment>
        ) : (
          <StyledDocsToggle onClick={() => setShowDocs(true)}>
            <FontAwesomeIcon icon={faCaretRight} /> Show documentation
          </StyledDocsToggle>
        )}
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
};

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
