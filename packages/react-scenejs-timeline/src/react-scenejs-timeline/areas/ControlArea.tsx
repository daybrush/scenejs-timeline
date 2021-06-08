import * as React from "react";
import { numberFormat, prefix } from "../utils";
import { ref } from "framework-utils";
import Timeline from "../Timeline";
import Scene, { Animator } from "scenejs";
import { SceneItem } from "scenejs";

export default class ControlArea extends React.PureComponent<{
    timeline: Timeline,
    scene?: Scene | SceneItem,
}> {
    public timeAreaElement!: HTMLInputElement;
    public render() {
        const scene = this.props.timeline.getScene();
        const isPaused = scene ? scene.isPaused() : true;
        return (
            <div className={prefix("control-area", "top-area")}>
                <div className={prefix("properties-area")}>
                    <div className={prefix("property")} onClick={this._unselect}></div>
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
        this._initScene(this.props.scene);
    }
    public componentDidUpdate(prevProps: ControlArea["props"]) {
        if (prevProps.scene !== this.props.scene) {
            this._initScene(this.props.scene);
            this._releaseScene(prevProps.scene);
        }
    }
    public componentWillUnmount() {
        this._releaseScene(this.props.scene);
    }

    public updateTime(time: number) {
        const minute = numberFormat(Math.floor(time / 60), 2);
        const second = numberFormat(Math.floor(time % 60), 2);
        const milisecond = numberFormat(Math.floor((time % 1) * 100), 3, true);
        this.timeAreaElement.value = `${minute}:${second}:${milisecond}`;
    }
    private _initScene(scene?: Animator | null) {
        if (!scene) {
            return;
        }
        scene.on({
            play: this._updateState,
            paused: this._updateState,
        });
    }
    private _releaseScene(scene?: Animator | null) {
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
        this.props.timeline.togglePlay();
    }
    private _prev = () => {
        this.props.timeline.prev();
    }
    private _next = () => {
        this.props.timeline.next();
    }
    private _unselect = () => {
        this.props.timeline.scrollArea.unselect();
    }
}
