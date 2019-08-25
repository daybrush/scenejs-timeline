import { PropertiesInfo } from "../../types";
import * as React from "react";
import { prefix, hasClass } from "../../utils";
import ElementComponent from "../../utils/ElementComponent";
import Timeline from "../../Timeline";
import ScrollArea from "../ScrollArea";
import { SceneItem } from "scenejs";

export default class Property extends ElementComponent<{
    id: string,
    index: number,
    propertiesInfo: PropertiesInfo,
    selected: boolean,
    folded: number,
    timeline: Timeline,
    scrollArea: ScrollArea,
}> {
    public render() {
        const {
            id,
            selected,
            folded,
            propertiesInfo: {
                keys: propertyNames,
                isItem,
                isParent,
            },
        } = this.props;
        const length = propertyNames.length;
        const name = propertyNames[length - 1] as string;

        return (
            <div className={prefix("property" + (folded === 1 ? " fold" : "") + (selected ? " select" : ""))}
                onClick={this.onClick}
                data-id={id}
                data-name={name}
                data-object={isParent ? 1 : 0}
                data-item={isItem ? 1 : 0}
                data-fold={folded === 2 ? 1 : 0}
                style={{
                    paddingLeft: `${10 + (length - 1) * 20}px`,
                }}>
                <div className={prefix("arrow")}></div>
                <span>{name}</span>
                <div className={prefix("remove")}></div>
            </div>
        );
    }
    private onClick = (e: any) => {
        const target = e.target;

        if (hasClass(target, "arrow")) {
            this.onClickArrow();
        } else if (hasClass(target, "remove")) {
            this.onClickRemove();
        } else {
            const { timeline, id } = this.props;

            timeline.select(id);
        }
    }
    private onClickArrow = () => {
        const { id, timeline, scrollArea, index } = this.props;

        timeline.select(id);
        scrollArea.fold(index);
    }
    private onClickRemove = () => {
        const { propertiesInfo, timeline } = this.props;
        const { isItem, parentItem, item: targetItem, properties } = propertiesInfo;
        if (isItem) {
            let targetName: string | number | null = null;
            parentItem.forEach((item, name) => {
                if (item === targetItem) {
                    targetName = name;
                    return;
                }
            });
            if (targetName != null) {
                parentItem.removeItem(targetName);
            }
        } else {
            const times = (targetItem as SceneItem).times;

            times.forEach(time => {
                (targetItem as SceneItem).remove(time, ...properties);
            });
        }

        timeline.select("", -1, true);
        timeline.update();
    }
}
