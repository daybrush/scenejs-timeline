import Folder, { FileProps, OnSelect } from "@scena/react-folder";
import { ref } from "framework-utils";
import * as React from "react";
import Timeline from "..";
import { ItemInfo, TimelineInfo } from "../types";
import { prefix } from "../utils";


export default class KeyframesArea extends React.PureComponent<{
    timeline: Timeline,
    timelineInfo: TimelineInfo | null;
    selected: string[];
    folded: string[];
    zoom: number;
    onSelect: (e: OnSelect) => void;
    onScroll: (scrollLeft: number) => void;
}> {
    public keyframesAreaElement!: HTMLElement;
    public cursorElement!: HTMLElement;
    public render() {
        const {
            timeline,
            timelineInfo,
            selected,
            folded,
            zoom,
            onSelect,
        } = this.props;
        return <div className={prefix("keyframes-area")}
        ref={ref(this, "keyframesAreaElement")}
            onScroll={this._onScroll}>
            <div className={prefix("keyframes-scroll-area")} style={{
                    width: "120%",
                }}>
                <Folder<ItemInfo>
                    infos={timelineInfo!.rootInfo.children}
                    idProperty={"key"}
                    pathProperty={"key"}
                    nameProperty={"name"}
                    childrenProperty={"children"}
                    FileComponent={this._renderProperty}
                    showFoldIcon={false}
                    selected={selected}
                    folded={folded}
                    backgroundColor={"#333"}
                    selectedColor={"#555"}
                    borderColor={"#666"}
                    multiselect={true}
                    isPadding={true}
                    gap={0}
                    onSelect={onSelect}
                />
                <div className={prefix("keyframe-cursor")}
                ref={ref(this, "cursorElement")}
                style={{
                    transform: `translate(-50%) translate(${zoom * (timeline.getTime() + 0.1)}px)`,
                }}></div>
            </div>
        </div>;
    }
    private _renderProperty = (props: FileProps<ItemInfo>) => {
        const {
            zoom,
        } = this.props;
        const {
            name,
            scope,
            path,
            info,
        } = props;

        const {
            isFrame,
            names,
            frames,
            frameLines,
        } = info;
        const keyframes = frames || [];
        return (
            <div className={prefix("property")}>
                {frameLines.map(({ startTime, endTime, isDelay }, i) => {
                    return <div key={`line${i}`} className={prefix(
                        isFrame ? "keyframe-line" : "keyframe-group",
                        isDelay ? "keyframe-delay" : "")} style={{
                            width: `${(endTime - startTime) * zoom}px`,
                            transform: `translateY(-50%) translate(${(startTime + 0.1) * zoom}px)`,
                        }}></div>
                })}
                {keyframes.map((keyframe, i) => {
                    return <div key={`keyframe${i}`} className={prefix("keyframe")} style={{
                        transform: `translate(-50%, -50%) translate(${(keyframe.time + 0.1) * zoom}px) rotate(45deg)`,
                    }}></div>
                })}
            </div>
        );
    }
    private _onScroll = () => {
        const scrollLeft = this.keyframesAreaElement.scrollLeft;
        this.props.onScroll(scrollLeft);
    };
}
