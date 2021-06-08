import * as React from "react";
import { prefix } from "../utils";
import Folder, { FileProps, OnFold, OnMove, OnSelect } from "@scena/react-folder";
import { ItemInfo, TimelineInfo } from "../types";
import Scene, { isRole, SceneItem } from "scenejs";
import { OnDragStart } from "gesto";
import { camelize, hasClass } from "@daybrush/utils";
import Timeline from "../Timeline";
import { ref } from "framework-utils";

export default class PropertiesArea extends React.PureComponent<{
    timeline: Timeline,
    timelineInfo: TimelineInfo | null;
    selected: string[];
    folded: string[];
    onSelect: (e: OnSelect) => void;
    onFold: (e: OnFold) => void;
}> {
    public folder!: Folder<ItemInfo>;
    public render() {
        const {
            timelineInfo,
            selected,
            folded,
            onSelect,
            onFold,
        } = this.props;

        return <div className={prefix("properties-area")}>
            <Folder<ItemInfo>
                ref={ref(this, "folder")}
                infos={timelineInfo!.rootInfo.children}
                idProperty={"key"}
                pathProperty={"key"}
                nameProperty={"name"}
                childrenProperty={"children"}
                FileComponent={this._renderProperty}
                selected={selected}
                folded={folded}
                backgroundColor={"#333"}
                selectedColor={"#555"}
                borderColor={"#666"}
                onSelect={onSelect}
                onFold={onFold}
                isMove={true}
                isMoveChildren={true}
                multiselect={true}
                isPadding={true}
                dragCondtion={this._dragCondition}
                onMove={this._onMove}
            />
        </div>;
    }

    private _renderProperty = (props: FileProps<ItemInfo>) => {
        const {
            name,
            // scope,
            // path,
            info,
        } = props;

        const {
            isFrame,
            isItem,
            isOption,
            names,
        } = info;
        const isAdd = isItem || (isFrame && isRole(names));

        return (
            <div className={prefix("property", isOption ? "option" : "")}>
                <div className={prefix("name")}>{name}</div>
                <div className={prefix("remove")} onClick={() => {
                    this._onClickRemove(info);
                }}></div>
                <div className={prefix("value")}>{this._renderValue(info, isAdd)}</div>
            </div>
        );
    }
    private _renderValue(info: ItemInfo, isAdd?: boolean) {
        const {
            isOption,
            optionName,
            scene,
        } = info;

        if (isOption && !optionName) {
            return;
        }
        if (isAdd) {
            return <span className={prefix("add")} ></span>;
        } else {
            return <input ref={ref(info, "element")} defaultValue={isOption ? (scene as any)[camelize(`get ${optionName}`)](): ""}/>;
        }
    }
    private _dragCondition = (e: OnDragStart) => {
        const target = e.inputEvent.target;

        return !hasClass(target, prefix("remove"));
    }
    private _onMove = (e: OnMove<ItemInfo>) => {
        const timeline = this.props.timeline;
        const parentInfo = e.parentInfo;
        const orders = e.children.filter(info => !info.isOption).map(info => info.name);

        if (!parentInfo) {
            (this.props.timeline.getScene()! as Scene).setOrders(orders);
            timeline.update();
            return;
        }
        const {
            isItem,
            isScene,
            isFrame,
            names,
            scene,
        } = parentInfo.info;

        if (isScene) {
            scene.setOrders([], orders);
            timeline.update();
        }
        if (isItem || isFrame) {
            scene.setOrders(names, orders);
            timeline.update();
        }

    }
    private _onClickRemove = (info: ItemInfo) => {
        const { timeline } = this.props;
        const { isItem, isScene, isFrame, scene, parentScene, names } = info;

        if (!parentScene) {
            return;
        }
        if (isItem || isScene) {
            let targetName: string | number | null = null;
            parentScene.forEach((item, name) => {
                if (item === scene) {
                    targetName = name;
                    return;
                }
            });
            if (targetName != null) {
                parentScene.removeItem(targetName);
            }
        } else if (isFrame) {
            const times = (scene as SceneItem).times;

            times.forEach(time => {
                (scene as SceneItem).remove(time, ...names);
            });
        }

        timeline.update();
    }
}
