import { TimelineInfo } from "../types";
import ElementComponent from "../utils/ElementComponent";
import KeytimesArea from "./KeytimesArea";
import * as React from "react";
import { prefix } from "../utils";
import { ref } from "framework-utils";
import Timeline from "../Timeline";

export default class HeaderArea extends ElementComponent<{
    timelineInfo: TimelineInfo,
    maxTime: number,
    maxDuration: number,
    zoom: number,
    timeline: Timeline,
}> {
    public keytimesArea!: KeytimesArea;
    public render() {
        const { timelineInfo, maxTime, maxDuration, zoom, timeline } = this.props;
        return (
            <div className={prefix("header-area")}>
                <div className={prefix("properties-area")}>
                    <div className={prefix("property")}>Name</div>
                </div>
                <div className={prefix("values-area")}>
                    <div className={prefix("value")} >
                        <div className={prefix("add")} onClick={this.openDialog}>+</div>
                    </div>
                </div>
                <KeytimesArea
                    ref={ref(this, "keytimesArea")}
                    timeline={timeline}
                    timelineInfo={timelineInfo}
                    maxDuration={maxDuration}
                    maxTime={maxTime}
                    zoom={zoom} />
            </div>
        );
    }
    private openDialog = () => {
        this.props.timeline.openDialog();
    }
}
