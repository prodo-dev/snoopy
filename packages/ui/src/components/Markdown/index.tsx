import {MDXProvider} from "@mdx-js/react";
import * as React from "react";
import styled from "styled-components";
import ReadmeMarkdown from "../../../../../README.mdx";
import Highlighter from "../Highlighter";

const StyledMarkdown = styled.div`
  max-width: 70ch;
  line-height: 1.4;
  a {
    color: ${({theme}) => theme.colors.textSecondary};
  }
`;

const Markdown = ({children}: {children: React.ReactNode}) => {
  const mdxComponents = {code: Highlighter};

  return (
    <MDXProvider components={mdxComponents}>
      <StyledMarkdown>{children}</StyledMarkdown>
    </MDXProvider>
  );
};

export const Readme = () => (
  <Markdown>
    <ReadmeMarkdown />
  </Markdown>
);

export default Markdown;
