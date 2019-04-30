const {configure, addParameters} = require("@storybook/react");
const {create} = require("@storybook/theming");

const bgColour = "#282c34";
const theme = create({
  base: "dark",

  appBg: bgColour,
  appContentBg: bgColour,
  barBg: bgColour,
});

addParameters({
  options: {
    theme: theme,
  },
});

function loadStories() {
  require("../stories");
}

configure(loadStories, module);
