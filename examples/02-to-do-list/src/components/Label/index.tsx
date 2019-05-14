import * as React from "react";

import "./index.css";

export interface Props {
  text: string;
  done: boolean;
  editing: boolean;
  startEditing: () => void;
  edit: (text: string) => void;
}

// @prodo
export const Label = ({text, done, editing, startEditing, edit}: Props) => (
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

Label.examples = [
  {
    name: "saved",
    jsx: (
      <Label
        text="I'm not done."
        done={false}
        editing={false}
        startEditing={() => undefined}
        edit={() => undefined}
      />
    ),
  },
  {
    name: "done",
    jsx: (
      <Label
        text="I'm done!"
        done={true}
        editing={false}
        startEditing={() => undefined}
        edit={() => undefined}
      />
    ),
  },
  {
    name: "editing",
    jsx: (
      <Label
        text="I'm being edited."
        done={false}
        editing={true}
        startEditing={() => undefined}
        edit={() => undefined}
      />
    ),
  },
];

export default Label;
