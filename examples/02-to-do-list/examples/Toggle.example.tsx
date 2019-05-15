import * as React from "react";
import Toggle from "../src/components/Toggle";

export default Toggle;

export const notDone = () => <Toggle done={false} toggle={() => undefined} />;
notDone.title = "not done";

export const done = () => <Toggle done={true} toggle={() => undefined} />;
