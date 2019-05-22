import {MDXProvider} from "@mdx-js/react";
import * as React from "react";
import styled from "styled-components";
import {ComponentContainer} from "../components/ComponentContainer";
import {Readme, Toggle} from "../components/Docs";
import {Errors} from "../components/Errors";
import Highlighter from "../components/Highlighter";
import {StyledPage, StyledPageContents} from "../components/Page";
import {Component as ComponentModel, Context} from "../models";
import {margins, paddings} from "../styles";

interface Props {
  components: ComponentModel[];
  errors: string[];
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

const Components = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

const Divider = styled.div`
  margin: 0 ${margins.large};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const HomePage = ({context, components, errors}: Props) => {
  const hasComponents = context.components.length > 0;

  if (!hasComponents) {
    return <Readme />;
  }

  const mdxComponents = {code: Highlighter};

  return (
    <StyledPage>
      <StyledPageContents>
        <Toggle>
          <MDXProvider components={mdxComponents}>
            <StyledMarkdown>
              <p>
                <a href="https://github.com/prodo-ai/snoopy">
                  View the docs here.
                </a>
              </p>
            </StyledMarkdown>
          </MDXProvider>
        </Toggle>
        <Errors errors={errors} />
        <Components className="components">
          {components.map((component, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <ComponentContainer
                component={component}
                themes={context.themes}
                styles={context.styles}
              />
            </React.Fragment>
          ))}
        </Components>
      </StyledPageContents>
    </StyledPage>
  );
};

// @prodo
export default HomePage;
