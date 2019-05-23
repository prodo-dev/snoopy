import * as _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import {Component} from "../../models";
import {paddings} from "../../styles";

const StyledComponentList = styled.div``;

const StyledFileTree = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

interface FileProps {
  for?: string;
  level: number;
  selected: Selected;
}

enum Selected {
  selected,
  unselected,
  partiallySelected,
}

const TreeElement = styled.label<FileProps>`
  display: block;
  padding: 0 ${paddings.small} ${paddings.small} 0;
  padding-left: calc(${paddings.small} * (${props => props.level} + 1));
  overflow-x: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  font-size: ${props => props.theme.fontSizes.normal};
  font-weight: ${props =>
    props.selected === Selected.unselected ? "inherit" : "bold"};
  color: ${props => (props.theme.colors as any)[Selected[props.selected]]};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const StyledDirectory = styled(TreeElement)`
  cursor: default;
  color: ${props => props.theme.colors.textTertiary};

  &::after {
    content: "/";
  }
`;

const StyledFile = styled(TreeElement)``;

const StyledFileSelector = styled.input`
  float: left;
`;

interface Props {
  components: Component[];
  selected: FilePath[];
  select: (selection: FilePath[]) => any;
  full?: boolean;
}

export type FilePath = string;

interface Directory {
  [segment: string]: Directory | FilePath;
}

const ComponentList = ({components, selected, select}: Props) => {
  const paths = _.uniq(components.map(({path}) => path));
  const structure: Directory = {};
  for (const path of paths) {
    const segments = path.split("/");
    let current = structure;
    for (const segment of segments.slice(0, segments.length - 1)) {
      if (current[segment] == null) {
        current[segment] = {};
      }
      const child = current[segment];
      if (typeof child === "string") {
        throw new Error(`"${segment}" is both a directory and a file.`);
      }
      current = child;
    }
    current[segments[segments.length - 1]] = path;
  }

  return (
    <StyledComponentList className="component-list">
      <FileTree
        structure={structure}
        level={0}
        selected={selected}
        select={select}
      />
    </StyledComponentList>
  );
};

const FileTree = ({
  structure,
  level,
  selected,
  select,
}: {
  structure: Directory;
  level: number;
  selected: FilePath[];
  select: (selection: FilePath[]) => any;
}) => (
  <StyledFileTree>
    {Object.keys(structure)
      .sort()
      .map(segment => {
        const child = structure[segment];
        if (typeof child === "string") {
          const elementSelected = selected.includes(child)
            ? Selected.selected
            : Selected.unselected;
          const add = () => select(selected.concat([child]).sort());
          const remove = () => select(selected.filter(s => s !== child));
          return (
            <li key={segment}>
              <FileSelector
                selected={elementSelected}
                add={add}
                remove={remove}
              />
              <File level={level} selected={elementSelected}>
                {segment}
              </File>
            </li>
          );
        } else {
          const allDescendants = descendantsOf(child);
          const entirelySelected = allDescendants.every(descendant =>
            selected.includes(descendant),
          );
          const partiallySelected = allDescendants.some(descendant =>
            selected.includes(descendant),
          );
          const elementSelected = entirelySelected
            ? Selected.selected
            : partiallySelected
            ? Selected.partiallySelected
            : Selected.unselected;
          const add = () =>
            select(_.uniq(selected.concat(allDescendants)).sort());
          const remove = () =>
            select(selected.filter(s => !allDescendants.includes(s)));
          return (
            <li key={segment}>
              <FileSelector
                selected={elementSelected}
                add={add}
                remove={remove}
              />
              <Directory level={level} selected={elementSelected}>
                {segment}
              </Directory>
              <FileTree
                structure={child}
                level={level + 1}
                selected={selected}
                select={select}
              />
            </li>
          );
        }
      })}
  </StyledFileTree>
);

const Directory = ({
  children,
  ...props
}: FileProps & {children: React.ReactNode}) => (
  <StyledDirectory {...props}>{children}</StyledDirectory>
);

const File = ({
  children,
  ...props
}: FileProps & {children: React.ReactNode}) => (
  <StyledFile {...props}>{children}</StyledFile>
);

interface FileSelectorProps {
  selected: Selected;
  add: () => void;
  remove: () => void;
}

const FileSelector = ({selected, add, remove}: FileSelectorProps) => {
  const ref = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    const current = ref.current;
    if (!current) {
      return;
    }
    current.indeterminate = selected === Selected.partiallySelected;
  });
  return (
    <StyledFileSelector
      ref={ref}
      type="checkbox"
      checked={selected !== Selected.unselected}
      onClick={event => {
        event.stopPropagation();
        event.preventDefault();
      }}
      onChange={event => {
        event.stopPropagation();
        event.preventDefault();
        if (selected === Selected.unselected) {
          add();
        } else {
          remove();
        }
      }}
    />
  );
};

const descendantsOf = (directory: Directory): FilePath[] =>
  _.flatMap(Object.keys(directory).sort(), segment => {
    const child = directory[segment];
    if (typeof child === "string") {
      return child;
    } else {
      return descendantsOf(child);
    }
  });

export default ComponentList;
