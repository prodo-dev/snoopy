import * as React from "react";

import "./index.css";

export interface Props {
  newTask: (text: string) => void;
}

const NewTask = ({newTask}: Props) => (
  <input
    className="new-task"
    placeholder="What needs to be done today?"
    onKeyUp={event => {
      if (event.keyCode === 13) {
        const target = event.target as HTMLInputElement;
        newTask(target.value);
        target.value = "";
      }
    }}
  />
);

// @prodo
export default NewTask;
