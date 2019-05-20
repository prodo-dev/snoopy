import * as React from "react";
import Counter from "../src/components/Counter";

export default Counter;

export const counter0 = () => <Counter count={0} />;
counter0.title = "Count is 0";

export const counter10 = () => <Counter count={10} />;
counter10.title = "Count is 10";

export const counter100 = () => <Counter count={100} />;
counter100.title = "Count is 100";

export const counter1000 = () => <Counter count={1000} />;
counter1000.title = "Count is 1000";
