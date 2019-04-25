import {faCaretLeft, faList} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {Link} from "react-router-dom";
import styled, {css} from "styled-components";
import {
  forNarrowScreen,
  forWideScreen,
  margins,
  paddings,
  SidebarClosedWidth,
  SidebarWidth,
} from "../../styles";
import ComponentList from "../ComponentList";
import Logo from "../Logo";
import {NarrowScreen, WideScreen} from "../Responsive";

const StyledSidebar = styled.div<{isOpen: boolean}>`
  position: sticky;
  top: 0;
  left: 0;

  background-color: ${props => props.theme.colors.fg};
  padding-top: ${paddings.small};
  z-index: 1000;
  overflow: hidden;
  height: 100vh;
  ${props =>
    props.isOpen
      ? css`
          width: ${SidebarWidth};
          min-width: ${SidebarWidth};
          max-width: ${SidebarWidth};
        `
      : forWideScreen`width: ${SidebarClosedWidth}; min-width: ${SidebarClosedWidth}; max-width: ${SidebarClosedWidth}`};

  ${forNarrowScreen`position: fixed`};
  ${forNarrowScreen`transition: transform 100ms ease-in`};
  ${props => !props.isOpen && forNarrowScreen`transform: translateX(-100%)`};

  ${forWideScreen`transition: width 100ms, min-width 100ms, max-width 100ms`};
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
  ${props => props.isSidebarOpen && forNarrowScreen`transform: translateX(0)`};

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

const HeaderContainer = styled.div`
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
      {props.isOpen ? (
        <React.Fragment>
          <HeaderContainer>
            <Header />
            <WideScreen>
              <SidebarToggle {...props} />
            </WideScreen>
          </HeaderContainer>
          <Separator />
          <ComponentList selected={props.selected} />
        </React.Fragment>
      ) : (
        <HeaderContainer>
          <SidebarToggle {...props} />
        </HeaderContainer>
      )}
    </StyledSidebar>
    <NarrowScreen>
      <Overlay {...props} />
    </NarrowScreen>
  </React.Fragment>
);
