import * as React from "react";
import { prefix } from "../../utils";
import ElementComponent from "../../utils/ElementComponent";

export default class Keyframe extends ElementComponent<{
    time: number,
    maxTime: number,
    value: string | undefined,
    selected: boolean,
}> {
    public render() {
        const { time, value, maxTime, selected } = this.props;
        return (
            <div className={prefix("keyframe" + (selected ? " select" : ""))}
                data-time={time} style={{ left: `${time / maxTime * 100}%` }}>
                {time} {value}
            </div>
        );
    }
}
