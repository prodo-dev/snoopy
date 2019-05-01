import {faList} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import Select from "react-select";
import styled from "styled-components";
import Component from "../components/Component";
import {StyledPage} from "../components/Page";
import {NarrowScreen} from "../components/Responsive";
import Sidebar from "../components/Sidebar";
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

const SidebarIcon = styled.span`
  cursor: pointer;
  margin-right: ${margins.medium}

  &:hover {
    color: ${props => props.theme.colors.textSecondary};
  }
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
  const options = props.themes.map((theme, idx) => {
    return {value: idx, label: theme.name};
  });

  return (
    <StyledPage>
      <StyledComponentPage>
        <Sidebar
          selected={props.component.name}
          isOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          components={props.components}
        />
        <ComponentContainer>
          <StyledTitleContainer>
            <NarrowScreen>
              <SidebarIcon onClick={() => setSidebarOpen(!isSidebarOpen)}>
                <FontAwesomeIcon icon={faList} />
              </SidebarIcon>
            </NarrowScreen>
            <StyledTitle>{props.component.name}</StyledTitle>
            {props.themes.length > 0 && (
              <StyledSelect
                defaultValue={options[0]}
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
              props.themes.length > 0 && props.themes[selectedTheme].theme
            }
          />
        </ComponentContainer>
      </StyledComponentPage>
    </StyledPage>
  );
};

export default ComponentPage;
