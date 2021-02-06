import { TimelineProps, TimelineState } from "./types";
import * as React from "react";
import { CSS } from "./consts";
import {
    prefix,
    getTimelineInfo,
} from "./utils";
import Scene, { SceneItem, ROLES } from "scenejs";
import styled from "react-css-styled";
import HeaderArea from "./HeaderArea";

const TimelineElement = styled("div", CSS);

export default class Timeline extends React.PureComponent<TimelineProps, TimelineState> {
    public static defaultProps = {
        keyboard: true,
        onSelect: () => { },
    };
    public state: TimelineState = {
        alt: false,
        zoom: 1,
        maxDuration: 0,
        maxTime: 0,
        timelineInfo: {},
        selectedProperty: "",
        selectedTime: -1,
        selectedItem: null,
        init: false,
        updateTime: false,
    };

    constructor(props: any) {
        super(props);

        this.state = { ...this.state, ...this.getSceneInfo(this.props.scene, false) };
    }
    public render() {
        const {
            scene,
            className,
            keyboard,
            onSelect,
            ...attributes
        } = this.props;
        const {
            zoom,
            alt,
            maxDuration,
            maxTime,
            timelineInfo,
            selectedProperty,
            selectedTime,
        } = this.state;

        return (
            <TimelineElement
                className={prefix("timeline" + (alt ? " alt" : "")) + (className ? ` ${className}` : "")}
                {...attributes}>
                {/* <ControlArea
                    ref={ref(this, "controlArea")}
                    scene={scene}
                    timeline={this}
                />*/}
                <HeaderArea
                    // ref={ref(this, "headerArea")}
                    timeline={this}
                    zoom={zoom}
                    timelineInfo={timelineInfo} />
                {/*
                <ScrollArea
                    ref={ref(this, "scrollArea")}
                    timeline={this}
                    maxDuration={maxDuration}
                    zoom={zoom}
                    maxTime={maxTime}
                    selectedProperty={selectedProperty}
                    selectedTime={selectedTime}
                    timelineInfo={timelineInfo}
                /> */}
            </TimelineElement>
        );
    }
    public update = (isInit: boolean = false) => {
        const scene = this.props.scene;

        if (!scene) {
            return;
        }
        const maxDuration = Math.ceil(scene.getDuration());
        const maxTime = Math.max(this.state.maxTime, maxDuration);
        const currentMaxTime = this.state.maxTime;
        const zoom = this.state.zoom;
        const nextZoomScale = currentMaxTime > 1 ? maxTime / currentMaxTime : 1;
        const nextZoom = Math.max(1, zoom * nextZoomScale);

        this.setState({
            timelineInfo: getTimelineInfo(scene),
            maxTime,
            maxDuration,
            updateTime: true,
            init: isInit,
            zoom: nextZoom,
        });
    }
    private getSceneInfo(scene?: Scene | SceneItem, isInit?: boolean) {
        if (!scene) {
            return {
                timelineInfo: {},
                maxTime: 0,
                maxDuration: 0,
                zoom: 1,
                init: false,
            };
        }
        scene.finish();
        // (scene as Scene).on("animate", this.animate);
        const duration = Math.ceil(scene.getDuration());

        return {
            timelineInfo: getTimelineInfo(scene),
            maxTime: duration,
            maxDuration: duration,
            zoom: 1,
            init: isInit || false,
        };
    }
}
