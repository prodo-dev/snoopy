import * as React from "react";
import TaskItem from "../src/components/TaskItem";

export default TaskItem;

export const saved = () => (
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
);

export const done = () => (
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
);

export const editing = () => (
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
);
