import {faCaretLeft, faList} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {connect} from "react-redux";
import styled from "styled-components";
import {State} from "../../store";
import {actions} from "../../store/app";
import {margins} from "../../styles";

const SidebarIcon = styled.span`
  cursor: pointer;

  color: ${props => props.theme.colors.text};
  &:hover {
    color: ${props => props.theme.colors.textSecondary};
  }

  margin: ${margins.small} ${margins.medium};
`;

export interface Props {
  isOpen: boolean;
  setSidebarOpen: (open: boolean) => any;
}

export const SidebarToggle = ({isOpen, setSidebarOpen}: Props) => (
  <SidebarIcon
    onClick={() => setSidebarOpen(!isOpen)}
    className="sidebar-toggle"
  >
    <FontAwesomeIcon icon={isOpen ? faCaretLeft : faList} size="lg" />
  </SidebarIcon>
);

export const ConnectedSidebarToggle = connect(
  (state: State) => ({
    isOpen: state.app.isSidebarOpen,
  }),
  dispatch => ({
    setSidebarOpen: (value: boolean) => dispatch(actions.setSidebarOpen(value)),
  }),
)(SidebarToggle);

export default SidebarToggle;
