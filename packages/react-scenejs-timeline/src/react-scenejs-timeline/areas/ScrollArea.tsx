import * as React from "react";
import Timeline from "../Timeline";
import PropertiesArea from "./PropertiesArea";
import KeyframesArea from "./KeyframesArea";
import { TimelineInfo } from "../types";
import { prefix } from "../utils";
import { OnFold, OnSelect } from "@scena/react-folder";
import { ref } from "framework-utils";

export default class ScrollArea extends React.PureComponent<{
    timeline: Timeline;
    zoom: number;
    maxTime: number;
    selectedKeys: string[];
    selectedTime: number;
    timelineInfo: TimelineInfo | null;
    onScroll: (scrollLeft: number) => void;
}, {
    selected: string[];
    folded: string[];
}> {
    public keyframesArea!: KeyframesArea;
    public propertiesArea!: PropertiesArea;
    public state = {
        selected: [],
        folded: [],
    };
    public render() {
        const {
            timeline,
            timelineInfo,
            zoom,
            onScroll,
        } = this.props;
        const {
            selected,
            folded,
        } = this.state;
        return <div className={prefix("scroll-area")}>
            <PropertiesArea
                ref={ref(this, "propertiesArea")}
                timeline={timeline}
                timelineInfo={timelineInfo}
                selected={selected}
                folded={folded}
                onSelect={this._onSelect}
                onFold={this._onFold}
            />
            <KeyframesArea
                ref={ref(this, "keyframesArea")}
                timeline={timeline}
                timelineInfo={timelineInfo}
                selected={selected}
                folded={folded}
                zoom={zoom}
                onSelect={this._onSelect}
                onScroll={onScroll}
            />
        </div>;
    }
    public unselect() {
        this.setState({
            selected: [],
        });
    }
    private _onSelect = (e: OnSelect) => {
        this.setState({
            selected: e.selected,
        });
    }
    private _onFold = (e: OnFold) => {
        this.setState({
            folded: e.folded,
        });
    }
}
