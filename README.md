# Prodo

To get started, run this inside your project's root or source directory:

```shell
$ npx @prodo-ai/snoopy-cli
```

Then go to http://localhost:3000/ to interact with the UI.

### Components

Add `// @prodo` to any exported component you want to display/preview/visualize with Prodo.

For a pure components, that's all you need to do. If your component requires props to be passed in, you should define examples. Each example is an object consisting of a name and the JSX you would write to use the component. You can have as many examples as you want. Attach them to your component using an "examples" property.

Here is a simple example:

```typescript
// @prodo
export const Counter = ({count}: {count: number}) => <p>{count}</p>;

Counter.examples = [
  {name: "Count is 0", jsx: <Counter count={0} />},
  {name: "Count is 10", jsx: <Counter count={10} />},
];
```

### Styles & Themes

If you use the `styled-components` ThemeProvider, you can also annotate your exported themes with `// @prodo:theme` to visualize your components in different themes.

If you want to include any application-level CSS files, just put a `/* @prodo:styles */` comment anywhere inside the file, and they will be applied to all your examples.

## What is and isn't supported yet

We support many libraries and use cases, including:

- styled components with themes
- react-router
- hooks

Here's a list of things we don't support yet, most of which are on the roadmap:

- Redux
- React Context
- react-modal
- chroma.js (due to a chroma issue with parcel)
- some CSS attributes (for example absolute positioning)

There are a couple of cases where you may want to tweak something in your code to get it fully working in Prodo.

- Images should render in Prodo, but if yours isn't, check how it's imported. If you're using `import * as image from ...` syntax, try replacing it with `import image from ...`.
- If you're seeing duplication, check if you're also unintentionally running Snoopy on your build files.

## Examples

[Here](https://github.com/prodo-ai/snoopy/tree/master/examples/01-counter) is a basic example of a Counter project set up for testing with Prodo. In it, we test the following components: App, Button and Counter.

We also test Prodo with Prodo, so you can check [our source code](https://github.com/prodo-ai/snoopy/tree/master/packages/ui/src) directly.
