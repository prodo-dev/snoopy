import {faCaretDown, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MDXProvider} from "@mdx-js/react";
import * as React from "react";
import styled from "styled-components";
import Readme from "../../README.mdx";
import ComponentList from "../components/ComponentList";
import Highlighter from "../components/Highlighter";
import {StyledPage, StyledPageContents} from "../components/Page";
import {Context} from "../models";
import {paddings} from "../styles";

interface Props {
  context: Context;
}

const StyledMarkdown = styled.div`
  max-width: 70ch;
  line-height: 1.4;
  a {
    color: ${({theme}) => theme.colors.textSecondary};
  }

  .mdx a {
    padding: 0 ${paddings.small};
  }
`;

const StyledDocsToggle = styled.div`
  font-size: ${({theme}) => theme.fontSizes.subtitle};
  cursor: pointer;
`;

const HomePage = ({context}: Props) => {
  const [showDocs, setShowDocs] = React.useState(
    context.components.length === 0,
  );
  const hasComponents = context.components.length > 0;
  const mdxComponents = {code: Highlighter};

  return (
    <StyledPage>
      <StyledPageContents>
        {showDocs ? (
          <React.Fragment>
            {hasComponents && (
              <StyledDocsToggle onClick={() => setShowDocs(false)}>
                <FontAwesomeIcon icon={faCaretDown} /> Hide documentation
              </StyledDocsToggle>
            )}
            <MDXProvider components={mdxComponents}>
              <StyledMarkdown>
                <Readme />
              </StyledMarkdown>
            </MDXProvider>
          </React.Fragment>
        ) : (
          hasComponents && (
            <StyledDocsToggle onClick={() => setShowDocs(true)}>
              <FontAwesomeIcon icon={faCaretRight} /> Show documentation
            </StyledDocsToggle>
          )
        )}
        {hasComponents && (
          <>
            <h2>Your components</h2>
            <ComponentList components={context.components} full />
          </>
        )}
      </StyledPageContents>
    </StyledPage>
  );
};

// @prodo
export default HomePage;
