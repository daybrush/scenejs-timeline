import * as React from "react";
import { prefix } from "../../utils";

export default class Menu extends React.Component<{
    selected?: boolean,
    icon: typeof React.Component,
}> {
    public render() {
        const { selected, icon } = this.props;
        return (
            <div className={prefix("menu", selected ? "selected" : "")}>
                {React.createElement(icon)}
            </div>);
    }
}
