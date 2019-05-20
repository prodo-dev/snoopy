import * as React from "react";
import Label from "../src/components/Label";

export default Label;

export const saved = () => (
  <Label
    text="I'm not done."
    done={false}
    editing={false}
    startEditing={() => undefined}
    edit={() => undefined}
  />
);

export const done = () => (
  <Label
    text="I'm done!"
    done={true}
    editing={false}
    startEditing={() => undefined}
    edit={() => undefined}
  />
);

export const editing = () => (
  <Label
    text="I'm being edited."
    done={false}
    editing={true}
    startEditing={() => undefined}
    edit={() => undefined}
  />
);
