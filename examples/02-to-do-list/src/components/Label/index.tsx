import * as React from "react";

import "./index.css";

export interface Props {
  text: string;
  done: boolean;
  editing: boolean;
  startEditing: () => void;
  edit: (text: string) => void;
}

const Label = ({text, done, editing, startEditing, edit}: Props) => (
  <label className="label">
    {editing ? (
      <input
        type="text"
        defaultValue={text}
        onBlur={event => edit(event.target.value)}
      />
    ) : (
      <span className={done ? "done" : ""} onClick={() => startEditing()}>
        {text}
      </span>
    )}
  </label>
);

export default Label;
