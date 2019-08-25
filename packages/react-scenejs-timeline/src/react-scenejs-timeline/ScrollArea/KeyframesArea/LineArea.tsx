import * as React from "react";
import { prefix } from "../../utils";

export default class KeyframeLine extends React.PureComponent<{
    maxTime: number,
}> {
    public render() {
        const maxTime = this.props.maxTime;
        const lines = [];
        for (let time = 0; time <= maxTime; ++time) {
            lines.push(
                <div key={time}
                    className={prefix("division-line")}
                    style={{ left: `${100 / maxTime * time}%` }} />,
            );
        }
        return (<div className={prefix("line-area")}>{lines}</div>);
    }
}
