import { TimelineInfo } from "../../types";
import Keyframes from "./Keyframes";
import LineArea from "./LineArea";
import * as React from "react";
import { prefix, checkFolded } from "../../utils";
import ElementComponent from "../../utils/ElementComponent";
import { IObject } from "@daybrush/utils";
import KeyframeCursor from "./KeyframeCursor";
import { refs, ref } from "framework-utils";
import Timeline from "../../Timeline";
import KeyController from "keycon";

export default class KeyframesArea extends ElementComponent<{
    timelineInfo: TimelineInfo,
    maxTime: number,
    maxDuration: number,
    zoom: number,
    timeline: Timeline,
    selectedProperty: string,
    selectedTime: number,
}, {
    foldedInfo: IObject<boolean>,
}> {
    public cursor!: KeyframeCursor;
    public scrollAreaElement!: HTMLElement;
    public keyframesList: Keyframes[] = [];
    public state = {
        foldedInfo: {},
    };
    public render() {
        const {
            timelineInfo, maxTime, maxDuration, zoom,
            selectedProperty, selectedTime,
        } = this.props;
        const { foldedInfo } = this.state;
        const width = Math.min(maxDuration ? maxTime / maxDuration : 1, 2);
        const keyframesList: JSX.Element[] = [];

        this.keyframesList = [];
        for (const key in timelineInfo) {
            const propertiesInfo = timelineInfo[key];
            const selected = key === selectedProperty;
            const folded = checkFolded(foldedInfo, propertiesInfo.keys);

            keyframesList.push(
                <Keyframes
                    ref={refs(this, "keyframesList", keyframesList.length)}
                    selected={selected}
                    folded={folded}
                    selectedTime={selectedTime}
                    key={key}
                    id={key}
                    propertiesInfo={propertiesInfo}
                    maxTime={maxTime} />,
            );
        }
        return (
            <div className={prefix("keyframes-area")} onWheel={this.onWheel}>
                <div
                    className={prefix("keyframes-scroll-area")}
                    ref={ref(this, "scrollAreaElement")}
                    style={{
                        minWidth: `${50 * maxTime}px`,
                        width: `${width * zoom * 100}%`,
                    }}>
                    {[
                        ...keyframesList,
                        <KeyframeCursor key="cursor" ref={ref(this, "cursor")} />,
                        <LineArea maxTime={maxTime} key="lines" />,
                    ]}
                </div>
            </div>
        );
    }
    private onWheel = (e: any) => {
        if (!KeyController.global.altKey) {
            return;
        }
        e.preventDefault();
        const delta = e.deltaY;

        const timeline = this.props.timeline;

        timeline.setZoom(timeline.getZoom() + delta / 5000);
    }
}
