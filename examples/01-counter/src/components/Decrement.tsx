import * as React from "react";

export default ({
  setCount,
}: {
  setCount: React.Dispatch<React.SetStateAction<number>>;
}) => (
  <button
    onClick={event => {
      event.stopPropagation();
      setCount(c => c - 1);
    }}
  >
    -
  </button>
);
