// tslint:disable-next-line:no-submodule-imports
import {darkTheme} from "@prodo/snoopy-ui/src/styles/theme";

import {configure, addParameters} from "@storybook/react";
import {create} from "@storybook/theming";

const theme = create({
  base: "dark",

  appBg: darkTheme.colors.bg,
  appContentBg: darkTheme.colors.bg,
  barBg: darkTheme.colors.bg,
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
