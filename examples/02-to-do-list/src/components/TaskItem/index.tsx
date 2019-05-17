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

const TaskItem = ({
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

export default TaskItem;
