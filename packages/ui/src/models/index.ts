import * as React from "react";

export interface Component {
    name: string;
    component: React.ComponentType<any>;
}
