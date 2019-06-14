import * as React from "react";
import {SidebarToggle} from "../src/components/Sidebar/SidebarToggle";

export default SidebarToggle;

export const Open = () => (
  <SidebarToggle isOpen={true} setSidebarOpen={() => alert("setSidebarOpen")} />
);

export const Closed = () => (
  <SidebarToggle
    isOpen={false}
    setSidebarOpen={() => alert("setSidebarOpen")}
  />
);
