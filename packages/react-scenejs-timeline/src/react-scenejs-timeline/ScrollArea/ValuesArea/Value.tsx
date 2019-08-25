import { PropertiesInfo } from "../../types";
import * as React from "react";
import { prefix } from "../../utils";
import ElementComponent from "../../utils/ElementComponent";
import { ref } from "framework-utils";
import Timeline from "../..";

export default class Value extends ElementComponent<{
    id: string,
    propertiesInfo: PropertiesInfo,
    folded: number,
    selected: boolean,
    timeline: Timeline,
}> {
    public inputElement!: HTMLInputElement;
    public render() {
        const {
            id,
            selected,
            folded,
            propertiesInfo: {
                isItem,
                isParent,
            },
        } = this.props;
        return (
            <div className={prefix("value" + (folded === 1 ? " fold" : "") + (selected ? " select" : ""))}
                data-id={id}
                data-object={isParent ? 1 : 0}
                data-item={isItem ? 1 : 0}>
                {this.renderValue()}
            </div>
        );
    }
    public renderValue() {
        const { isParent } = this.props.propertiesInfo;
        if (isParent) {
            return (
                <div className={prefix("add")} onClick={this.add}>+</div>
            );
        } else {
            return (
                <input ref={ref(this, "inputElement")}></input>
            );
        }
    }
    private add = () => {
        const {
            propertiesInfo: {
                item,
                properties,
            },
            timeline,
        } = this.props;
        timeline.openDialog(item, properties);
    }
}
