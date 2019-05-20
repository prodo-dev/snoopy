import Example from "../src/components/Example";
import {CounterExample, HelloWorldExample} from "../test/fixtures";

export default Example;

export const helloWorld = () => HelloWorldExample.component;
helloWorld.title = HelloWorldExample.title;

export const counter = () => CounterExample.component;
counter.title = CounterExample.title;
