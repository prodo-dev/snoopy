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
  const highlighted = elements.map((el: React.ReactElement, idx: number) =>
    el.type === "pre" && el.props.children.length > 0 ? (
      <Highlighter
        className={el.props.children[0].props.className}
        key={el.key || idx}
      >
        {el.props.children[0].props.children.toString()}
      </Highlighter>
    ) : (
      el
    ),
  );

  return <StyledMarkdown>{highlighted}</StyledMarkdown>;
};

export default Markdown;
