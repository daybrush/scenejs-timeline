import * as React from "react";
import { prefix } from "../utils";
import Folder, { FileProps, OnFold, OnSelect } from "@scena/react-folder";
import { ItemInfo, TimelineInfo } from "../types";
import { isRole } from "scenejs";

export default class PropertiesArea extends React.PureComponent<{
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
                FileComponent={this.renderProperty}
                selected={selected}
                folded={folded}
                backgroundColor={"#333"}
                selectedColor={"#555"}
                borderColor={"#666"}
                onSelect={onSelect}
                onFold={onFold}
                multiselect={true}
                isPadding={true}
            />
        </div>;
    }

    private renderProperty = (props: FileProps<ItemInfo>) => {
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
                <div className={prefix("value")}>{isAdd ? this.renderAdd(info) : this.renderInput(info)}</div>
            </div>
        );
    }
    private renderAdd(info: ItemInfo) {
        return <span className={prefix("add")}></span>;
    }
    private renderInput(info: ItemInfo) {
        return <input />;
    }
}
