import {faList} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import styled from "styled-components";
import Component from "../components/Component";
import {StyledPage} from "../components/Page";
import {NarrowScreen} from "../components/Responsive";
import Sidebar from "../components/Sidebar";
import {Component as ComponentModel} from "../models";
import {margins, paddings} from "../styles";

interface Props {
  component: ComponentModel;
  components: ComponentModel[];
  themes?: any[];
}

const StyledComponentPage = styled.div`
  display: flex;
`;

const ComponentContainer = styled.div`
  padding: ${paddings.medium} ${paddings.large};
`;

const StyledTitle = styled.div`
  font-size: ${props => props.theme.fontSizes.title};
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const SidebarIcon = styled.span`
  cursor: pointer;
  margin-right: ${margins.medium}

  &:hover {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ComponentPage = (props: Props) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const [selectedTheme, setSelectedTheme] = React.useState(0);
  const themes = props.themes || [];
  const selectTheme = () => {
    const el = document.getElementById("temp-select");
    if (el) {
      setSelectedTheme((el as any).value);
    }
  };

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
          <StyledTitle>
            <NarrowScreen>
              <SidebarIcon onClick={() => setSidebarOpen(!isSidebarOpen)}>
                <FontAwesomeIcon icon={faList} />
              </SidebarIcon>
            </NarrowScreen>
            {props.component.name}{" "}
            <select id="temp-select" onChange={() => selectTheme()}>
              {" "}
              {themes.map((theme, idx) => (
                <option value={idx} key={idx}>
                  {theme.name}
                </option>
              ))}
            </select>
          </StyledTitle>
          <Component
            key={props.component.name}
            component={props.component}
            userTheme={themes[selectedTheme].theme}
          />
        </ComponentContainer>
      </StyledComponentPage>
    </StyledPage>
  );
};

export default ComponentPage;
