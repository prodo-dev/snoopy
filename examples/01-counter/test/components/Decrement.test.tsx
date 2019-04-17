import * as React from "react";
import {cleanup, fireEvent, render} from "react-testing-library";

import Decrement from "../../src/components/Decrement";
import {fakeState} from "../state";

afterEach(cleanup);

test("decrements the counter", async () => {
  const [getCount, setCount] = fakeState(0);

  const {getByText} = render(<Decrement setCount={setCount} />);
  const button = getByText("-");

  fireEvent.click(button);

  expect(getCount()).toBe(-1);
});

test("decrements the counter lots", async () => {
  const [getCount, setCount] = fakeState(0);

  const {getByText} = render(<Decrement setCount={setCount} />);
  const button = getByText("-");

  fireEvent.click(button);
  fireEvent.click(button);
  fireEvent.click(button);

  expect(getCount()).toBe(-3);
});
