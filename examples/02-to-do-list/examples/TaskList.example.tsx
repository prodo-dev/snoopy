import * as React from "react";
import TaskList from "../src/components/TaskList";

export default TaskList;

export const noTasks = () => (
  <TaskList
    tasks={{}}
    editing={undefined}
    setTasks={() => undefined}
    setEditing={() => undefined}
  />
);
noTasks.title = "no tasks";

export const multipleTasks = () => (
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
);
multipleTasks.title = "multiple tasks";

export const editingATask = () => (
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
);
editingATask.title = "editing a task";
