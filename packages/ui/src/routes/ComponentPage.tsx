import * as React from "react";
import Select from "react-select";
import styled from "styled-components";
import {userBodyId} from "../App/context";
import Component from "../components/Component";
import {Component as ComponentModel, Context} from "../models";
import {margins, paddings} from "../styles";

interface Props {
  components: ComponentModel[];
  errors: string[];
  context: Context;
}

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

const ComponentPage = (props: Props) => {
  const [selectedTheme, setSelectedTheme] = React.useState(0);
  const themes =
    props.context.themes && props.context.themes.filter(x => x != null);
  const options = themes.map((theme, idx) => {
    return {value: idx, label: theme.name};
  });
  const allStyles = props.context.styles
    .map(x => x.style.replace(/\bbody\b/, `#${userBodyId}`))
    .join("\n");

  return (
    <>
      <Errors className="errors">
        {props.errors.map((error, i) => (
          <StyledError key={i}>{error}</StyledError>
        ))}
      </Errors>
      <Components className="components">
        {props.components.map((component, i) => (
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
    </>
  );
};

// @prodo
export default ComponentPage;
