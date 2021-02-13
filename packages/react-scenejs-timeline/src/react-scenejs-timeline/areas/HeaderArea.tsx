import { TimelineInfo } from "../types";
// import KeytimesArea from "./KeytimesArea";
import * as React from "react";
import { prefix } from "../utils";
import { ref } from "framework-utils";
import Timeline from "../Timeline";
import Ruler from "@scena/react-ruler";
import Gesto from "gesto";

export default class HeaderArea extends React.PureComponent<{
    timelineInfo: TimelineInfo | null,
    zoom: number,
    timeline: Timeline,
}> {
    public ruler!: Ruler;
    public cursorElement!: HTMLElement;
    public state = {
        scrollLeft: -0.1,
    };
    private _gesto!: Gesto;
    public render() {
        const {
            zoom,
            timeline,
        } = this.props;
        const {
            scrollLeft,
        } = this.state;
        return (
            <div className={prefix("header-area")}>
                <div className={prefix("properties-area")}>
                    <div className={prefix("property")}>Name</div>
                </div>
                <div className={prefix("keyframes-area")}>
                    <Ruler
                        ref={ref(this, "ruler")}
                        zoom={zoom}
                        unit={1}
                        negativeRuler={false}
                        textAlign={"center"}
                        mainLineSize={12}
                        longLineSize={6}
                        shortLineSize={6}
                        scrollPos={scrollLeft}
                        style={{
                            width: "100%",
                            height: "100%",
                        }} />
                    <div className={prefix("keyframe-cursor")}
                        ref={ref(this, "cursorElement")}
                        style={{
                            transform: `translate(-50%) translate(${zoom * (timeline.getTime() - scrollLeft)}px)`,
                        }}></div>
                </div>
            </div>
        );
    }
    public componentDidMount() {
        this.ruler.scroll(-0.1);

        this._gesto = new Gesto(this.cursorElement, {
            container: window,
        }).on("dragStart", e => {
            e.datas.startTime = this.props.timeline.getTime();
        }).on("drag", e => {
            const startTime = e.datas.startTime;
            const distTime = e.distX / this.props.zoom;

            this.props.timeline.setTime(startTime + distTime);
        });
    }
    public scroll(scrollLeft: number) {
        const zoom = this.props.zoom;
        // this.ruler.scroll(scrollLeft - 0.1);
        // this.cursorElement.style.transform = `translate(-50%) translate(calc(var(--scenejs-timeline-time) * ${zoom}px + ${zoom * (0.1 - scrollLeft)}px))`;
        this.setState({
            scrollLeft: scrollLeft - 0.1,
        })
    }
    public componentWillUnmount() {
        this._gesto.unset();
    }
}
