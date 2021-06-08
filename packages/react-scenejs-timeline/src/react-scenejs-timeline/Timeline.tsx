import { TimelineProps, TimelineState } from "./types";
import * as React from "react";
import { CSS } from "./consts";
import {
    prefix,
    getTimelineInfo,
    getCurrentFlattedFrames,
    checkInput,
} from "./utils";
import Scene, { SceneItem, isScene, NAME_SEPARATOR } from "scenejs";
import styled, { StyledElement } from "react-css-styled";
import ControlArea from "./areas/ControlArea";
import HeaderArea from "./areas/HeaderArea";
import ScrollArea from "./areas/ScrollArea";
import { ref } from "framework-utils";
import KeyController from "keycon";

const TimelineElement = styled("div", CSS);

export default class Timeline extends React.PureComponent<TimelineProps, TimelineState> {
    public static defaultProps = {
        keyboard: true,
        onSelect: () => { },
    };
    public state: TimelineState = {
        alt: false,
        zoom: 100,
        maxDuration: 0,
        maxTime: 0,
        timelineInfo: null,
        selectedKeys: [],
        selectedTime: -1,
        selectedItem: null,
        init: false,
        updateTime: false,
    };
    public timelineElement!: StyledElement<HTMLElement>;
    public controlArea!: ControlArea;
    public headerArea!: HeaderArea;
    public scrollArea!: ScrollArea;
    private _keycon!: KeyController;

    constructor(props: any) {
        super(props);

        this.state = { ...this.state, ...this._getSceneInfo(this.props.scene, false) };
    }
    public render() {
        const {
            scene,
            className,
            // keyboard,
            // onSelect,
            ...attributes
        } = this.props;
        const {
            zoom,
            alt,
            // maxDuration,
            maxTime,
            timelineInfo,
            selectedKeys,
            selectedTime,
        } = this.state;

        return (
            <TimelineElement
                className={prefix("timeline" + (alt ? " alt" : "")) + (className ? ` ${className}` : "")}
                ref={ref(this, "timelineElement")}
                {...attributes}>
                <ControlArea
                    ref={ref(this, "controlArea")}
                    scene={scene}
                    timeline={this}
                />
                <HeaderArea
                    ref={ref(this, "headerArea")}
                    timeline={this}
                    zoom={zoom}
                    timelineInfo={timelineInfo} />
                <ScrollArea
                    ref={ref(this, "scrollArea")}
                    timeline={this}
                    zoom={zoom}
                    maxTime={maxTime}
                    selectedKeys={selectedKeys}
                    selectedTime={selectedTime}
                    timelineInfo={timelineInfo}
                    onScroll={this._onScroll}
                />
            </TimelineElement>
        );
    }
    public componentDidMount() {
        (this.props.scene as Scene).on("animate", this._onAnimate);

        this._initKeyController();
        this._onAnimate();

        window.addEventListener("resize", this._onResize);
    }
    public componentWillUnmount() {
        window.removeEventListener("resize", this._onResize);
        this._keycon.destroy();
    }
    public getScene() {
        return this.props.scene;
    }
    public getTime() {
        const scene = this.props.scene;
        return scene ? scene.getTime() : 0;
    }
    public getDuration() {
        const scene = this.props.scene;
        return scene ? scene.getDuration() : 0;
    }
    public setTime(time: number) {
        const scene = this.props.scene;

        scene && scene.setTime(time);
    }
    public updateCursor() {
        this.headerArea.forceUpdate();
        this.scrollArea.keyframesArea.forceUpdate();
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
        }, () => {
            this._onAnimate();
        });
    }
    public prev = () => {
        const scene = this.props.scene;

        scene && this.setTime(scene.getTime() - 0.05);
    }
    public next() {
        const scene = this.props.scene;

        scene && this.setTime(scene.getTime() + 0.05);
    }
    public togglePlay = () => {
        const scene = this.props.scene;

        scene && (scene.isPaused() ? scene.play() : scene.pause());
    }
    private _initKeyController() {
        this._keycon = new KeyController(window)
            .keydown(e => {
                !e.isToggle && e.inputEvent.stopPropagation();
            })
            .keyup(e => {
                !e.isToggle && e.inputEvent.stopPropagation();
            })
            .keyup("enter", e => {
                // go to time
                const target = e.inputEvent.target;
                const timeAreaElement = this.controlArea.timeAreaElement;

                if (target === timeAreaElement) {
                    const value = timeAreaElement.value;
                    const result = /(\d+):(\d+):(\d+)/g.exec(value);

                    if (!result) {
                        return;
                    }
                    const minute = parseFloat(result[1]);
                    const second = parseFloat(result[2]);
                    const milisecond = parseFloat(`0.${result[3]}`);
                    const time = minute * 60 + second + milisecond;

                    this.setTime(time);
                }
            })
            .keydown("left", e => {
                if (!checkInput(e.inputEvent.target)) {
                    this.prev();
                }
            })
            .keydown("right", e => {
                if (!checkInput(e.inputEvent.target)) {
                    this.next();
                }
            })
            .keydown("space", e => {
                if (!checkInput(e.inputEvent.target)) {
                    e.inputEvent.preventDefault();
                }
            })
            .keyup("space", e => {
                if (!checkInput(e.inputEvent.target)) {
                    this.togglePlay();
                }
            });
    }
    private _onAnimate = () => {
        const scene = this.props.scene!;
        const frames = isScene(scene)
            ? getCurrentFlattedFrames(scene)
            : { [scene.getId()]: scene.getCurrentFrame() };
        const propertiesFolder = this.scrollArea.propertiesArea.folder;


        for (const id in frames) {
            const frame = frames[id];
            const fullOrders = frame.getFullOrders([], true);
            fullOrders.forEach(names => {
                const fullNames = [id, ...names];
                const fullId = [id, ...names].join(NAME_SEPARATOR);

                const fullNamesLength = fullNames.length;

                for (let i = 1; i <= fullNamesLength; ++i) {
                    const parentId = fullNames.slice(0, i).join(NAME_SEPARATOR);

                    if (propertiesFolder.isFolded(parentId)) {
                        return;
                    }
                }
                const file = propertiesFolder.findFile(fullId);

                if (!file) {
                    return;
                }
                const info = file.getInfo();

                if (!info.element) {
                    return;
                }
                (info.element as HTMLInputElement).value = frame.get(...names);
            });
        }
        this.updateCursor();
        const time = scene.getTime();
        this.controlArea.updateTime(time);
    }
    private _getSceneInfo(scene?: Scene | SceneItem, isInit?: boolean) {
        if (!scene) {
            return {
                timelineInfo: null,
                maxTime: 0,
                maxDuration: 0,
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
            init: isInit || false,
        };
    }
    private _onScroll = (scrollLeft: number) => {
        this.headerArea.scroll(scrollLeft / this.state.zoom);
    }
    private _onResize = () => {
        this.headerArea.ruler.resize();
    }
}
