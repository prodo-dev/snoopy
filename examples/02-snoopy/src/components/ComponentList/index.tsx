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

const exampleComponent1: Component = {
  name: "Component1",
  component: () => <div>Hello World 1</div>,
};
const exampleComponent2: Component = {
  name: "Component2",
  component: () => <div>Hello World 2</div>,
};
const exampleComponent3: Component = {
  name: "Component3",
  component: () => <div>Hello World 3</div>,
};
ComponentList.examples = [
  {
    name: "Empty component list",
    jsx: <ComponentList components={[]} selected={""} />,
  },
  {
    name: "Single Item",
    jsx: <ComponentList components={[exampleComponent1]} selected={""} />,
  },
  {
    name: "Single Item Selected",
    jsx: (
      <ComponentList
        components={[exampleComponent1]}
        selected={exampleComponent1.name}
      />
    ),
  },
  {
    name: "Multiple Items",
    jsx: (
      <ComponentList
        components={[exampleComponent1, exampleComponent2, exampleComponent3]}
        selected={""}
      />
    ),
  },
  {
    name: "Multiple Items With Selection",
    jsx: (
      <ComponentList
        components={[exampleComponent1, exampleComponent2, exampleComponent3]}
        selected={exampleComponent2.name}
      />
    ),
  },
];

// @prodo
export default ComponentList;
