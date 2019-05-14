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

// @prodo
export const TaskList = ({tasks, editing, setTasks, setEditing}: Props) => (
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

TaskList.examples = [
  {
    name: "no tasks",
    jsx: (
      <TaskList
        tasks={{}}
        editing={undefined}
        setTasks={() => undefined}
        setEditing={() => undefined}
      />
    ),
  },
  {
    name: "multiple tasks",
    jsx: (
      <TaskList
        tasks={{
          "1": {id: "1", text: "a thing", done: true},
          "2": {id: "2", text: "another thing", done: false},
          "3": {id: "3", text: "a third thing", done: false},
        }}
        editing={undefined}
        setTasks={() => undefined}
        setEditing={() => undefined}
      />
    ),
  },
  {
    name: "editing a task",
    jsx: (
      <TaskList
        tasks={{
          "1": {id: "1", text: "a thing", done: true},
          "2": {id: "2", text: "another thing", done: false},
          "3": {id: "3", text: "a third thing", done: false},
        }}
        editing={"2"}
        setTasks={() => undefined}
        setEditing={() => undefined}
      />
    ),
  },
];

export default TaskList;
