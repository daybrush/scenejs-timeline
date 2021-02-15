import * as React from "react";
import { prefix } from "../utils";
import Folder, { FileProps, OnFold, OnMove, OnSelect } from "@scena/react-folder";
import { ItemInfo, TimelineInfo } from "../types";
import { isRole, SceneItem } from "scenejs";
import { OnDragStart } from "gesto";
import { hasClass } from "@daybrush/utils";
import Timeline from "../Timeline";

export default class PropertiesArea extends React.PureComponent<{
    timeline: Timeline,
    timelineInfo: TimelineInfo | null;
    selected: string[];
    folded: string[];
    onSelect: (e: OnSelect) => void;
    onFold: (e: OnFold) => void;
}> {
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
            scope,
            path,
            info,
        } = props;

        const {
            isFrame,
            isItem,
            names,
        } = info;
        const isAdd = isItem || (isFrame && isRole(names));

        return (
            <div className={prefix("property")}>
                <div className={prefix("name")}>{name}</div>
                <div className={prefix("remove")} onClick={e => {
                    this._onClickRemove(info);
                }}></div>
                <div className={prefix("value")}>{isAdd ? this._renderAdd(info) : this._renderInput(info)}</div>
            </div>
        );
    }
    private _renderAdd(info: ItemInfo) {
        return <span className={prefix("add")}></span>;
    }
    private _renderInput(info: ItemInfo) {
        return <input />;
    }
    private _dragCondition = (e: OnDragStart) => {
        const target = e.inputEvent.target;

        return !hasClass(target, prefix("remove"));
    }
    private _onMove = (e: OnMove<ItemInfo>) => {
        const timeline = this.props.timeline;
        const parentInfo = e.parentInfo;
        const orders = e.children.map(info => info.name);

        if (!parentInfo) {
            return;
        }
        const {
            isItem,
            isScene,
            isFrame,
            names,
            scene,
        } = parentInfo.info;

        if (isItem || isFrame) {
            console.log(names, orders);
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
