import {faCaretDown, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import styled from "styled-components";
import Markdown from "../Markdown";

export const Readme = () => (
  <Markdown>
    <p>
      <a href="https://github.com/prodo-ai/snoopy">View the docs here.</a>
    </p>
  </Markdown>
);

export const Toggle = ({children}: {children: React.ReactNode}) => {
  const [showDocs, setShowDocs] = React.useState(false);

  return showDocs ? (
    <>
      <StyledDocsToggle onClick={() => setShowDocs(false)}>
        <FontAwesomeIcon icon={faCaretDown} /> Hide documentation
      </StyledDocsToggle>
      {children}
    </>
  ) : (
    <StyledDocsToggle onClick={() => setShowDocs(true)}>
      <FontAwesomeIcon icon={faCaretRight} /> Show documentation
    </StyledDocsToggle>
  );
};

const StyledDocsToggle = styled.div`
  font-size: ${({theme}) => theme.fontSizes.subtitle};
  cursor: pointer;
`;
