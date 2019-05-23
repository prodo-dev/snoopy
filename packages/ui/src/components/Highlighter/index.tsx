import Highlight, {defaultProps, Language} from "prism-react-renderer";
import * as React from "react";
import styled from "styled-components";

import "./theme.css";

const StyledHighlighter = styled.div`
  font-family: ${props => props.theme.fonts.code};
  font-size: ${props => props.theme.fontSizes.code};
`;

// From https://mdxjs.com/guides/syntax-highlighting/
const Highlighter = ({
  children,
  className,
}: {
  children: string;
  className: string;
}) => {
  const language = className.replace(/language-/, "") as Language;
  return (
    <StyledHighlighter>
      <Highlight
        {...defaultProps}
        code={children}
        language={language}
        theme={undefined}
      >
        {({
          className: innerClassName,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }) => (
          <pre className={innerClassName} style={{...style, padding: "20px"}}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({line, key: i})}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({token, key})} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </StyledHighlighter>
  );
};

export default Highlighter;
