import * as React from "react";
import Select from "react-select";
import styled from "styled-components";
import {testComponents, testThemes} from "../../test/fixtures";
import Component from "../components/Component";
import {StyledPage} from "../components/Page";
import {NarrowScreen} from "../components/Responsive";
import Sidebar, {SidebarToggle} from "../components/Sidebar";
import {Component as ComponentModel, Theme} from "../models";
import {margins, paddings} from "../styles";

interface Props {
  component: ComponentModel;
  components: ComponentModel[];
  themes: Theme[];
}

const StyledComponentPage = styled.div`
  display: flex;
`;

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

const ComponentPage = (props: Props) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState(0);
  const themes = props.themes && props.themes.filter(x => x != null);
  const options = themes.map((theme, idx) => {
    return {value: idx, label: theme.name};
  });

  return (
    <StyledPage>
      <StyledComponentPage>
        <Sidebar
          selected={props.component.path}
          isOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          components={props.components}
        />
        <ComponentContainer>
          <StyledTitleContainer>
            <NarrowScreen>
              <SidebarToggle
                isOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            </NarrowScreen>
            <StyledTitle>{props.component.name}</StyledTitle>
            {props.themes.length > 0 && (
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
            key={props.component.name}
            component={props.component}
            userTheme={
              themes.length > 0 &&
              themes[selectedTheme] &&
              themes[selectedTheme].theme
            }
          />
        </ComponentContainer>
      </StyledComponentPage>
    </StyledPage>
  );
};

ComponentPage.examples = [
  {
    name: "No themes",
    jsx: (
      <ComponentPage
        components={testComponents}
        themes={[]}
        component={testComponents[0]}
      />
    ),
  },
  {
    name: "With themes",
    jsx: (
      <ComponentPage
        components={testComponents}
        themes={testThemes}
        component={testComponents[0]}
      />
    ),
  },
];

// @prodo
export default ComponentPage;
