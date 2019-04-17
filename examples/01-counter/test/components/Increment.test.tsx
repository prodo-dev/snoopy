import * as React from "react";
import {cleanup, fireEvent, render} from "react-testing-library";

import Increment from "../../src/components/Increment";
import {fakeState} from "../state";

afterEach(cleanup);

test("increments the counter", async () => {
  const [getCount, setCount] = fakeState(0);

  const {getByText} = render(<Increment setCount={setCount} />);
  const button = getByText("+");

  fireEvent.click(button);

  expect(getCount()).toBe(1);
});

test("increments the counter lots", async () => {
  const [getCount, setCount] = fakeState(0);

  const {getByText} = render(<Increment setCount={setCount} />);
  const button = getByText("+");

  fireEvent.click(button);
  fireEvent.click(button);
  fireEvent.click(button);

  expect(getCount()).toBe(3);
});
