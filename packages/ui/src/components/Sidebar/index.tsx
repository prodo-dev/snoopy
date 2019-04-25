import {faCaretLeft, faList} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {
  forNarrowScreen,
  forWideScreen,
  margins,
  paddings,
  SidebarWidth,
} from "../../styles/theme";
import ComponentList from "../ComponentList";
import Logo from "../Logo";
import {NarrowScreen, WideScreen} from "../Responsive";

// TODO: smooth transition?
const StyledSidebar = styled.div<{isOpen: boolean}>`
  position: sticky;
  top: 0;
  left: 0;
  ${props =>
    props.isOpen &&
    `width: ${SidebarWidth}; min-width: ${SidebarWidth}; max-width: ${SidebarWidth};`};
  height: 100vh;
  z-index: 1000;
  background-color: ${props => props.theme.colors.fg};
  padding-top: ${paddings.small};

  ${forNarrowScreen`position: fixed`}
  ${forNarrowScreen`transition: transform 100ms ease-in`};
  ${props => !props.isOpen && forNarrowScreen`transform: translateX(-100%)`};

  ${forWideScreen`transition: width 100ms, min-width 100ms, max-width 100ms`};
  ${props =>
    !props.isOpen &&
    forWideScreen`width: 55px; min-width: 55px; max-width: 55px`};
`;

const StyledOverlay = styled.div<{isSidebarOpen: boolean}>`
  background-color: black;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  transition: opacity 100ms ease-in;

  transform: translateX(-100%);
  ${props => props.isSidebarOpen && forNarrowScreen`transform: translateX(0);`};

  opacity: ${props => (props.isSidebarOpen ? 0.5 : 0)};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Title = styled.div`
  flex-grow: 1;
  margin-top: ${margins.small};
  padding-left: ${paddings.small};
  min-height: 45px;
  min-width: 120px;

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

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SidebarIcon = styled.span`
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.textSecondary};
  }

  // Custom margin for alignment with the header and logo
  margin: 0.75rem ${margins.medium};
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
  <SidebarIcon
    onClick={() => props.setSidebarOpen(!props.isOpen)}
    className="sidebar-toggle"
  >
    <FontAwesomeIcon icon={props.isOpen ? faCaretLeft : faList} size="lg" />
  </SidebarIcon>
);

const Header = () => (
  <StyledLink to="/">
    <Title className="title">
      <Logo />
      Snoopy
    </Title>
  </StyledLink>
);

export default (props: Props) => (
  <React.Fragment>
    <StyledSidebar isOpen={props.isOpen} className="sidebar">
      <NarrowScreen>
        <Header />
        <Separator />
        <ComponentList selected={props.selected} />
      </NarrowScreen>
      <WideScreen>
        {props.isOpen ? (
          <React.Fragment>
            <Flex>
              <Header />
              <SidebarToggle {...props} />
            </Flex>
            <Separator />
            <ComponentList selected={props.selected} />
          </React.Fragment>
        ) : (
          <Flex>
            <SidebarToggle {...props} />
          </Flex>
        )}
      </WideScreen>
    </StyledSidebar>
    <NarrowScreen>
      <Overlay {...props} />
    </NarrowScreen>
  </React.Fragment>
);
