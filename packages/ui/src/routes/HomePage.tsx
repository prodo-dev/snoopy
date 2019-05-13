import {faCaretDown, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import styled from "styled-components";
import ComponentList from "../components/ComponentList";
import {Readme} from "../components/Markdown";
import {Context} from "../models";

interface Props {
  context: Context;
}

const StyledDocsToggle = styled.div`
  font-size: ${({theme}) => theme.fontSizes.subtitle};
`;

const HomePage = ({context}: Props) => {
  const [showDocs, setShowDocs] = React.useState(
    context.components.length === 0,
  );
  const hasComponents = context.components.length > 0;

  return (
    <>
      {showDocs ? (
        <React.Fragment>
          {hasComponents && (
            <StyledDocsToggle onClick={() => setShowDocs(false)}>
              <FontAwesomeIcon icon={faCaretDown} /> Hide documentation
            </StyledDocsToggle>
          )}
          <Readme />
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
          <ComponentList components={context.components} />
        </>
      )}
    </>
  );
};

// @prodo
export default HomePage;
