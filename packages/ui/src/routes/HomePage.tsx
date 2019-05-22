import {MDXProvider} from "@mdx-js/react";
import * as React from "react";
import Select from "react-select";
import styled from "styled-components";
import {userBodyId} from "../App/context";
import Component from "../components/Component";
import {Readme, Toggle} from "../components/Docs";
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

const Errors = styled.div``;

const ComponentContainer = styled.div`
  padding: ${paddings.medium} ${paddings.large};
`;

const StyledTitleContainer = styled.div`
  display: flex;
`;

const selectHeight = "38px";
const StyledTitle = styled.div`
  font-size: ${props => props.theme.fontSizes.title};
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  line-height: ${selectHeight};
`;

const StyledSelect = styled(Select)`
  font-size: ${props => props.theme.fontSizes.normal}
  color: ${props => props.theme.colors.bg}
  width: 150px;
  margin-left: ${margins.large}
`;

const Divider = styled.div`
  margin: 0 ${margins.large};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const StyledError = styled.div`
  padding: ${paddings.large};
  color: ${props => props.theme.colors.error}
  background-color: ${props => props.theme.colors.errorBg};
  text-align: center;
`;

const HomePage = ({context, components, errors}: Props) => {
  const hasComponents = context.components.length > 0;

  if (!hasComponents) {
    return <Readme />;
  }

  const mdxComponents = {code: Highlighter};
  const [selectedTheme, setSelectedTheme] = React.useState(0);
  const themes = context.themes && context.themes.filter(x => x != null);
  const options = themes.map((theme, idx) => {
    return {value: idx, label: theme.name};
  });
  const allStyles = context.styles
    .map(x => x.style.replace(/\bbody\b/, `#${userBodyId}`))
    .join("\n");

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
        <Errors className="errors">
          {errors.map((error, i) => (
            <StyledError key={i}>{error}</StyledError>
          ))}
        </Errors>
        <Components className="components">
          {components.map((component, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <ComponentContainer key={component.name}>
                <StyledTitleContainer>
                  <StyledTitle>{component.name}</StyledTitle>
                  {themes.length > 0 && (
                    <StyledSelect
                      defaultValue={options[selectedTheme]}
                      onChange={(selectedOption: any) =>
                        setSelectedTheme(selectedOption.value)
                      }
                      options={options}
                    />
                  )}
                </StyledTitleContainer>
                <Component
                  component={component}
                  userTheme={
                    themes.length > 0 &&
                    themes[selectedTheme] &&
                    themes[selectedTheme].theme
                  }
                  allStyles={allStyles}
                />
              </ComponentContainer>
            </React.Fragment>
          ))}
        </Components>
      </StyledPageContents>
    </StyledPage>
  );
};

// @prodo
export default HomePage;
