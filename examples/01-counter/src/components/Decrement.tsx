import * as React from "react";

export default ({
  setCount,
}: {
  setCount: React.Dispatch<React.SetStateAction<number>>;
}) => (
  <p>
    <button
      onClick={event => {
        event.stopPropagation();
        setCount(c => c - 1);
      }}
    >
      -
    </button>
  </p>
);
