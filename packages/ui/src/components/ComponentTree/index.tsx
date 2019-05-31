import * as _ from "lodash";
import * as React from "react";
import styled from "styled-components";
import {Component} from "../../models";
import {paddings} from "../../styles";

const StyledComponentTree = styled.div`
  padding: ${paddings.small};
`;

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
`;

const StyledDirectory = styled(TreeElement)`
  cursor: default;
  color: ${props => props.theme.colors.textTertiary};

  &::after {
    content: "/";
  }
`;

const StyledFile = styled(TreeElement)`
  color: ${props =>
    props.selected === Selected.selected
      ? props.theme.colors.selected
      : props.theme.colors.unselected};
`;

const StyledFileSelector = styled.input`
  float: left;
`;

interface Props {
  components: Component[];
  selected: Set<FilePath>;
  select: (selection: Set<FilePath>) => any;
  full?: boolean;
}

export type FilePath = string;

interface Directory {
  type: "directory";
  path: FilePath;
  children: {
    [segment: string]: Directory | File;
  };
}

interface File {
  type: "file";
  path: FilePath;
}

const ComponentTree = ({components, selected, select}: Props) => {
  const [paths, structure] = React.useMemo(() => createFileTree(components), [
    components,
  ]);

  return (
    <StyledComponentTree className="component-list">
      <FileTree
        paths={paths}
        structure={structure}
        level={0}
        selected={selected}
        select={select}
      />
    </StyledComponentTree>
  );
};

const onlyContainsIndexFile = (directory: Directory) => {
  const keys = Object.keys(directory.children);
  return keys.length === 1 && /^index\.(j|t)sx?$/.test(keys[0]);
};

const FileTree = ({
  paths,
  structure,
  level,
  selected,
  select,
}: {
  paths: FilePath[];
  structure: Directory;
  level: number;
  selected: Set<FilePath>;
  select: (selection: Set<FilePath>) => any;
}) => {
  const childParameters = React.useMemo(
    () => createChildParameters(structure, paths, selected, select),
    [structure, paths, selected, select],
  );

  return (
    <StyledFileTree>
      {childParameters.map(({child, segment, elementSelected, add, remove}) => {
        if (child.type === "file" || onlyContainsIndexFile(child)) {
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
                paths={paths}
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
};

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
        if (selected !== Selected.selected) {
          add();
        } else {
          remove();
        }
      }}
    />
  );
};

const createFileTree = (components: Component[]): [FilePath[], Directory] => {
  const paths = _.uniq(components.map(({path}) => path)).sort();
  const structure: Directory = {
    type: "directory",
    path: "",
    children: {},
  };
  for (const path of paths) {
    const segments = path.split("/");

    let current = structure;
    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
      if (current.children[segment] == null) {
        current.children[segment] = {
          type: "directory",
          path: segments.slice(0, i + 1).join("/"),
          children: {},
        };
      }
      const child = current.children[segment];
      if (child.type === "file") {
        throw new Error(`"${segment}" is both a directory and a file.`);
      }
      current = child;
    }
    current.children[segments[segments.length - 1]] = {
      type: "file",
      path,
    };
  }
  return [paths, structure];
};

const createChildParameters = (
  directory: Directory,
  paths: FilePath[],
  selected: Set<FilePath>,
  select: (selection: Set<FilePath>) => void,
): Array<{
  child: Directory | File;
  segment: string;
  elementSelected: Selected;
  add: () => void;
  remove: () => void;
}> =>
  Object.keys(directory.children)
    .sort()
    .map(segment => {
      const child = directory.children[segment];
      if (child.type === "file") {
        const elementSelected = selected.has(child.path)
          ? Selected.selected
          : Selected.unselected;
        const add = () => select(setUnion(selected, [child.path]));
        const remove = () => select(setDifference(selected, [child.path]));
        return {
          child,
          segment,
          elementSelected,
          add,
          remove,
        };
      } else if (child.type === "directory" && onlyContainsIndexFile(child)) {
        const onlyChild = child.children[Object.keys(child.children)[0]];

        const elementSelected = selected.has(onlyChild.path)
          ? Selected.selected
          : Selected.unselected;
        const add = () => select(setUnion(selected, [onlyChild.path]));
        const remove = () => select(setDifference(selected, [onlyChild.path]));
        return {
          child,
          segment,
          elementSelected,
          add,
          remove,
        };
      } else {
        const allDescendants = paths.filter(path =>
          path.startsWith(child.path),
        );
        const entirelySelected = allDescendants.every(descendant =>
          selected.has(descendant),
        );
        const partiallySelected = allDescendants.some(descendant =>
          selected.has(descendant),
        );
        const elementSelected = entirelySelected
          ? Selected.selected
          : partiallySelected
          ? Selected.partiallySelected
          : Selected.unselected;
        const add = () => select(setUnion(selected, allDescendants));
        const remove = () => select(setDifference(selected, allDescendants));
        return {
          child,
          segment,
          elementSelected,
          add,
          remove,
        };
      }
    });

function setUnion<T>(a: Iterable<T>, b: Iterable<T>): Set<T> {
  const result = new Set(a);
  for (const value of b) {
    result.add(value);
  }
  return result;
}

function setDifference<T>(a: Iterable<T>, b: Iterable<T>): Set<T> {
  const result = new Set(a);
  for (const value of b) {
    result.delete(value);
  }
  return result;
}

export default ComponentTree;
