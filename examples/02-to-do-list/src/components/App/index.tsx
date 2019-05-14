import * as React from "react";

import {Id, Task, Tasks} from "../../types";
import NewTask from "../NewTask";
import TaskList from "../TaskList";
import Title from "../Title";

import "./index.css";

const noTasks: Tasks = {};

// @prodo
export const App = () => {
  const [tasks, setTasks] = React.useState(noTasks);
  const [id, setId] = React.useState(0);
  const [editing, setEditing] = React.useState(undefined as (Id | undefined));

  const newTask = (text: string) => {
    const taskId: Id = id.toString();
    const task: Task = {id: id.toString(), text, done: false};
    setTasks({...tasks, [taskId]: task});
    setId(id + 1);
  };

  return (
    <div className="app">
      <Title />
      <NewTask newTask={newTask} />
      <TaskList
        tasks={tasks}
        editing={editing}
        setTasks={setTasks}
        setEditing={setEditing}
      />
    </div>
  );
};

export default App;
