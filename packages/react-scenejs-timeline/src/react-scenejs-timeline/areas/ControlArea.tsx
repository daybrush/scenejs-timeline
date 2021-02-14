import { TimelineInfo } from "../types";
import * as React from "react";
import { numberFormat, prefix } from "../utils";
import { ref } from "framework-utils";
import Timeline from "../Timeline";
import Ruler from "@scena/react-ruler";
import Gesto from "gesto";
import { throttle } from "@daybrush/utils";
import Scene, { Animator } from "scenejs";
import { SceneItem } from "scenejs";
import KeyController from "keycon";

export default class ControlArea extends React.PureComponent<{
    timeline: Timeline,
    scene?: Scene | SceneItem,
}> {
    public timeAreaElement!: HTMLInputElement;
    public keycon!: KeyController;
    public render() {
        const scene = this.props.timeline.getScene();
        const isPaused = scene ? scene.isPaused() : true;
        return (
            <div className={prefix("control-area", "top-area")}>
                <div className={prefix("properties-area")}>
                    <div className={prefix("property")}>Name</div>
                </div>
                <div className={prefix("keyframes-area")}>
                    <input className={prefix("time-area")} ref={ref(this, "timeAreaElement")} />
                    <div className={prefix("play-control-area")}>
                        <div className={prefix("control", "prev")} onClick={this._prev} />
                        <div
                            className={prefix("control", isPaused ? "play" : "pause")}
                            onClick={this._togglePlay} />
                        <div className={prefix("control next")} onClick={this._next} />
                    </div>
                </div>
            </div>
        );
    }
    public componentDidMount() {
        this.initScene(this.props.scene);
        this.keycon = new KeyController(this.timeAreaElement)
            .keydown(e => {
                !e.isToggle && e.inputEvent.stopPropagation();
            })
            .keyup(e => {
                !e.isToggle && e.inputEvent.stopPropagation();
            })
            .keyup("enter", () => {
                // go to time
                const value = this.timeAreaElement.value;
                const result = /(\d+):(\d+):(\d+)/g.exec(value);

                if (!result) {
                    return;
                }
                const minute = parseFloat(result[1]);
                const second = parseFloat(result[2]);
                const milisecond = parseFloat(`0.${result[3]}`);
                const time = minute * 60 + second + milisecond;

                this.props.timeline.setTime(time);
            });
    }
    public componentDidUpdate(prevProps: ControlArea["props"]) {
        if (prevProps.scene !== this.props.scene) {
            this.initScene(this.props.scene);
            this.releaseScene(prevProps.scene);
        }
    }
    public componentWillUnmount() {
        this.releaseScene(this.props.scene);
        this.keycon.destroy();
    }

    public updateTime(time: number) {
        const minute = numberFormat(Math.floor(time / 60), 2);
        const second = numberFormat(Math.floor(time % 60), 2);
        const milisecond = numberFormat(Math.floor((time % 1) * 100), 3, true);
        this.timeAreaElement.value = `${minute}:${second}:${milisecond}`;
    }
    private initScene(scene?: Animator | null) {
        if (!scene) {
            return;
        }
        scene.on({
            play: this._updateState,
            paused: this._updateState,
        });
    }
    private releaseScene(scene?: Animator | null) {
        if (!scene) {
            return;
        }

        scene.off("play", this._updateState);
        scene.off("paused", this._updateState);
    }
    private _updateState = () => {
        this.forceUpdate();
    }
    private _togglePlay = () => {
        const scene = this.props.timeline.getScene();

        scene && (scene.isPaused() ? scene.play() : scene.pause());
    }
    private _prev = () => {
        this.props.timeline.prev();
    }
    private _next = () => {
        this.props.timeline.next();
    }
}
