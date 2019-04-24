import * as React from "react";
import styled from "styled-components";
import Component from "../components/Component";
import Sidebar from "../components/Sidebar";
import {Component as ComponentModel} from "../models";
import {margins, paddings} from "../styles/theme";

interface Props {
  component: ComponentModel;
}

const Flex = styled.div`
  display: flex;
  padding: ${paddings.none};
  margin: ${margins.none};
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.bg};
  color: ${props => props.theme.colors.text};
`;

const StyledComponentPage = styled.div`
  padding: ${paddings.medium} ${paddings.large};
`;

const StyledTitle = styled.div`
  font-size: ${props => props.theme.fontSizes.title};
`;

const ComponentPage = (props: Props) => (
  <Flex>
    <Sidebar selected={props.component.name} />
    <StyledComponentPage>
      <StyledTitle>{props.component.name}</StyledTitle>
      <Component key={props.component.name} component={props.component} />
    </StyledComponentPage>
  </Flex>
);

export default ComponentPage;
