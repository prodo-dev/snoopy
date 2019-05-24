import * as React from "react";
import ReactHtmlParser from "react-html-parser";
import styled from "styled-components";
import {paddings} from "../../styles";
import Highlighter from "../Highlighter";

const StyledMarkdown = styled.div`
  max-width: 70ch;
  line-height: 1.4;
  a {
    color: ${({theme}) => theme.colors.textSecondary};
  }

  .markdown a {
    padding: 0 ${paddings.small};
  }
`;

const Markdown = ({source}: {source: string}) => {
  const elements = ReactHtmlParser(source);
  const highlighted = elements.map(
    (element: React.ReactElement, index: number) =>
      element.type === "pre" && element.props.children.length > 0 ? (
        <Highlighter
          className={element.props.children[0].props.className}
          key={element.key ? `key_${element.key}` : index}
        >
          {element.props.children[0].props.children.toString()}
        </Highlighter>
      ) : (
        element
      ),
  );

  return <StyledMarkdown>{highlighted}</StyledMarkdown>;
};

export default Markdown;
