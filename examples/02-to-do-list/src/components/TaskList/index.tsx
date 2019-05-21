import * as React from "react";

import {Id, Tasks} from "../../types";
import TaskItem from "../TaskItem";

import "./index.css";

export interface Props {
  tasks: Tasks;
  editing?: Id;
  setTasks: (tasks: Tasks) => void;
  setEditing: (editing: Id | undefined) => void;
}

const TaskList = ({tasks, editing, setTasks, setEditing}: Props) => (
  <ul className="task-list">
    {Object.values(tasks).map(({id, text, done}) => {
      const toggle = (newDone: boolean) =>
        setTasks({...tasks, [id]: {id, text, done: newDone}});
      const startEditing = () => setEditing(id);
      const edit = (newText: string) => {
        setTasks({...tasks, [id]: {id, text: newText, done}});
        setEditing(undefined);
      };
      const remove = () => {
        const newTasks = {...tasks};
        delete newTasks[id];
        setTasks(newTasks);
      };
      return (
        <TaskItem
          key={id}
          id={id}
          text={text}
          done={done}
          editing={id === editing}
          toggle={toggle}
          startEditing={startEditing}
          edit={edit}
          remove={remove}
        />
      );
    })}
  </ul>
);

export default TaskList;
