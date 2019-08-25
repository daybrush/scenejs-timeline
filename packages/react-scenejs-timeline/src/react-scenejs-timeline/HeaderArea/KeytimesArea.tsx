import { TimelineInfo } from "../types";
import * as React from "react";
import { prefix } from "../utils";
import ElementComponent from "../utils/ElementComponent";
import KeyframeCursor from "../ScrollArea/KeyframesArea/KeyframeCursor";
import { addEvent, removeEvent } from "@daybrush/utils";
import Dragger from "@daybrush/drag";
import { ref } from "framework-utils";
import Timeline from "../Timeline";

export default class KeytimesArea extends ElementComponent<{
    timeline: Timeline,
    timelineInfo: TimelineInfo,
    maxTime: number,
    maxDuration: number,
    zoom: number,
}> {
    public scrollAreaElement!: HTMLElement;
    public cursor!: KeyframeCursor;
    public dragger!: Dragger;

    public renderKeytimes() {
        const { maxTime } = this.props;
        const keytimes = [];

        for (let time = 0; time <= maxTime; ++time) {
            keytimes.push(
                <div key={time} data-time={time} className={prefix("keytime")} style={{ width: `${100 / maxTime}%` }}>
                    <span>{time}</span>
                    <div className={prefix("graduation start")} />
                    <div className={prefix("graduation quarter")} />
                    <div className={prefix("graduation half")} />
                    <div className={prefix("graduation quarter3")} />
                </div>,
            );
        }
        return keytimes;
    }
    public render() {
        const { maxTime, maxDuration, zoom } = this.props;
        return (
            <div className={prefix("keytimes-area keyframes-area")}>
                <div
                    className={prefix("keyframes-scroll-area")}
                    ref={ref(this, "scrollAreaElement")}
                    style={{
                        minWidth: `${50 * maxTime}px`,
                        width: `${Math.min(maxDuration ? maxTime / maxDuration : 1, 2) * zoom * 100}%`,
                    }}
                >
                    <div className={prefix("keytimes keyframes")}>
                        <div className={prefix("keyframes-container")}>
                            {this.renderKeytimes()}
                        </div>
                        <KeyframeCursor ref={ref(this, "cursor")}/>
                    </div>
                </div>
            </div>
        );
    }
    public onWheel = (e: WheelEvent) => {
        const timeline = this.props.timeline;
        const delta = e.deltaY;

        timeline.setZoom(timeline.getZoom() + delta / 5000);
        !e.deltaX && e.preventDefault();
    }
    public componentDidMount() {
        addEvent(this.getElement(), "wheel", this.onWheel);
        this.dragger = new Dragger(this.cursor!.getElement(), {
            dragstart: ({ inputEvent }) => {
                inputEvent.stopPropagation();
            },
            drag: ({ clientX }) => {
                this.props.timeline.move(clientX);
            },
            container: window,
        });
    }
    public componentWillUnmount() {
        removeEvent(this.getElement(), "wheel", this.onWheel);
        this.dragger.unset();
    }
}
