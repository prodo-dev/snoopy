import {faCaretLeft, faList} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {
  forNarrowScreen,
  forWideScreen,
  margins,
  MinSidebarWidth,
  paddings,
  SidebarWidth,
} from "../../styles/theme";
import ComponentList from "../ComponentList";
import Logo from "../Logo";
import {NarrowScreen, WideScreen} from "../Responsive";

const StyledSidebar = styled.div<{isOpen: boolean}>`
  position: sticky;
  top: 0;
  left: 0;
  ${props =>
    props.isOpen
      ? `min-width: ${SidebarWidth}; max-width: ${SidebarWidth};`
      : forWideScreen`min-width: ${MinSidebarWidth}; max-width: ${MinSidebarWidth};`};
  height: 100vh;
  z-index: 1000;
  background-color: ${props => props.theme.colors.fg};
  padding-top: ${paddings.small};

  transition: transform 150ms ease-in;
  ${props => !props.isOpen && forNarrowScreen`transform: translateX(-100%)`};
  ${forNarrowScreen`position: fixed`}
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Title = styled.div`
  flex-grow: 1;
  padding-left: ${paddings.small};
  text-decoration: none;
  font-size: ${props => props.theme.fontSizes.title};
  color: ${props => props.theme.colors.text};

  &:hover {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Separator = styled.hr`
  margin: ${margins.none};
`;

const StyledOverlay = styled.div<{isSidebarOpen: boolean}>`
  background-color: black;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  transition: opacity 150ms ease-in;

  transform: translateX(-100%);
  ${props => props.isSidebarOpen && forNarrowScreen`transform: translateX(0);`};

  opacity: ${props => (props.isSidebarOpen ? 0.5 : 0)};
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SidebarIcon = styled.span`
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.textSecondary};
  }

  margin: ${margins.small} ${margins.medium};
`;

interface Props {
  isOpen: boolean;
  selected?: string;
  setSidebarOpen: (open: boolean) => any;
}

const Overlay = (props: Props) => (
  <StyledOverlay
    className="sidebar-overlay"
    isSidebarOpen={props.isOpen}
    onClick={e => {
      if (props.isOpen && props.setSidebarOpen) {
        e.preventDefault();
        e.stopPropagation();
        props.setSidebarOpen(false);
      }
    }}
  />
);

const SidebarToggle = (props: Props) => (
  <SidebarIcon onClick={() => props.setSidebarOpen(!props.isOpen)}>
    <FontAwesomeIcon icon={props.isOpen ? faCaretLeft : faList} size="lg" />
  </SidebarIcon>
);

const Header = () => (
  <StyledLink to="/">
    <Title>
      <Logo />
      Snoopy
    </Title>
  </StyledLink>
);

export default (props: Props) => (
  <React.Fragment>
    <NarrowScreen>
      <StyledSidebar isOpen={props.isOpen}>
        <Header />
        <Separator />
        <ComponentList selected={props.selected} />
      </StyledSidebar>
      <Overlay {...props} />
    </NarrowScreen>
    <WideScreen>
      {props.isOpen ? (
        <StyledSidebar isOpen={props.isOpen}>
          <Flex>
            <Header />
            <SidebarToggle {...props} />
          </Flex>
          <Separator />
          <ComponentList selected={props.selected} />
        </StyledSidebar>
      ) : (
        <StyledSidebar isOpen={props.isOpen}>
          <Flex>
            <SidebarToggle {...props} />
          </Flex>
        </StyledSidebar>
      )}
    </WideScreen>
  </React.Fragment>
);
