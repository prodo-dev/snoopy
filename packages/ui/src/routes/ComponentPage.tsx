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
            {props.component.name}
          </StyledTitle>
          <Component key={props.component.name} component={props.component} />
        </ComponentContainer>
      </StyledComponentPage>
    </StyledPage>
  );
};

export default ComponentPage;
