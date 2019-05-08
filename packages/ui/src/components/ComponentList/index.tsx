import * as React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {testComponents} from "../../../test/fixtures";
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

const ComponentList = (props: Props) => (
  <StyledComponentList className="component-list">
    {props.components.map(({name}) => (
      <StyledLink to={`/${name}`} key={name}>
        <ComponentName selected={props.selected === name}>{name}</ComponentName>
      </StyledLink>
    ))}
  </StyledComponentList>
);

ComponentList.examples = [
  {
    name: "Empty",
    jsx: <ComponentList components={[]} />,
  },
  {
    name: "Single item",
    jsx: <ComponentList components={[testComponents[0]]} />,
  },
  {
    name: "Single item with selection",
    jsx: (
      <ComponentList
        components={[testComponents[0]]}
        selected={testComponents[0].name}
      />
    ),
  },
  {
    name: "Multiple items",
    jsx: <ComponentList components={testComponents} />,
  },
  {
    name: "Multiple items with selection",
    jsx: (
      <ComponentList
        components={testComponents}
        selected={testComponents[0].name}
      />
    ),
  },
];

// @prodo
export default ComponentList;
