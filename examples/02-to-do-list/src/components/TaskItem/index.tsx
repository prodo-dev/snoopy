import * as React from "react";

import {Task} from "../../types";
import Label from "../Label";
import Remove from "../Remove";
import Toggle from "../Toggle";

import "./index.css";

export interface Props extends Task {
  editing: boolean;
  toggle: (done: boolean) => void;
  startEditing: () => void;
  edit: (text: string) => void;
  remove: () => void;
}

// @prodo
export const TaskItem = ({
  id,
  text,
  done,
  editing,
  toggle,
  startEditing,
  edit,
  remove,
}: Props) => (
  <li key={id} className="task-item">
    <Toggle done={done} toggle={toggle} />
    <Label
      text={text}
      done={done}
      editing={editing}
      startEditing={startEditing}
      edit={edit}
    />
    <Remove remove={remove} />
  </li>
);

TaskItem.examples = [
  {
    name: "saved",
    jsx: (
      <TaskItem
        id="0"
        text="I'm not done."
        done={false}
        editing={false}
        toggle={() => undefined}
        startEditing={() => undefined}
        edit={() => undefined}
        remove={() => undefined}
      />
    ),
  },
  {
    name: "done",
    jsx: (
      <TaskItem
        id="0"
        text="I'm done!"
        done={true}
        editing={false}
        toggle={() => undefined}
        startEditing={() => undefined}
        edit={() => undefined}
        remove={() => undefined}
      />
    ),
  },
  {
    name: "editing",
    jsx: (
      <TaskItem
        id="0"
        text="I'm being edited."
        done={false}
        editing={true}
        toggle={() => undefined}
        startEditing={() => undefined}
        edit={() => undefined}
        remove={() => undefined}
      />
    ),
  },
];

export default TaskItem;
