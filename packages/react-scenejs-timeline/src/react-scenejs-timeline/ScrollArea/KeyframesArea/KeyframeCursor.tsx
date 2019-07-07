import * as React from "react";
import ElementComponent from "../../utils/ElementComponent";
import { prefix } from "../../utils";
import { ref } from "framework-utils";

export default class KeyframeCursor extends ElementComponent {
    public render() {
        return <div
            className={prefix("keyframe-cursor")}
            ref={ref(this, "cursor")} />;
    }
}
