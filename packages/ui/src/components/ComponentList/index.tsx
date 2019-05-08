import * as React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {Component} from "../../models";
import {paddings} from "../../styles";

const StyledComponentList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ComponentName = styled.div<{selected?: boolean}>`
  overflow-x: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  padding: ${paddings.small} ${paddings.medium};
  ${props => props.selected && `background-color: ${props.theme.colors.bg}`}
  font-size: ${props => props.theme.fontSizes.subtitle};
  color: ${props => props.theme.colors.text};

  &:hover {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

interface Props {
  selected?: string;
  components: Component[];
}

export default (props: Props) => (
  <StyledComponentList className="component-list">
    {props.components.map(({path, name}) => (
      <StyledLink to={`/${path}/${name}`} key={`${path}:${name}`}>
        <ComponentName selected={props.selected === name}>
          {path}:{name}
        </ComponentName>
      </StyledLink>
    ))}
  </StyledComponentList>
);
