import * as React from "react";
import Button from "../Button";

export default ({
  setCount,
}: {
  setCount: React.Dispatch<React.SetStateAction<number>>;
}) => <Button onClick={() => setCount(c => c - 1)}>-</Button>;
