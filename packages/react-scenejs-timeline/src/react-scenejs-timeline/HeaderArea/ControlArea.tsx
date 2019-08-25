import * as React from "react";
import { prefix } from "../utils";
import ElementComponent from "../utils/ElementComponent";
import TimeArea from "./TimeArea";
import Scene, { SceneItem } from "scenejs";
import { ref } from "framework-utils";
import Timeline from "../Timeline";

export default class ControlArea extends ElementComponent<{
    scene?: Scene | SceneItem,
    timeline: Timeline
}, {
    isPlay: boolean,
}> {
    public timeArea!: TimeArea;
    public state = {
        isPlay: false,
    };
    public render() {
        const timeline = this.props.timeline;

        return (
            <div className={prefix("control-area header-area")}>
                <div className={prefix("properties-area")} onClick={this.unselect}>
                    <div className={prefix("property")} />
                </div>
                <div className={prefix("values-area")}>
                    <div className={prefix("value")}></div>
                </div>
                <div className={prefix("keyframes-area")}>
                    <div className={prefix("keyframes")}>
                        <TimeArea ref={ref(this, "timeArea")} timeline={timeline} />
                        <div className={prefix("play-control-area")}>
                            <div className={prefix("control prev")} onClick={this.prev} />
                            <div
                                className={prefix("control " + (this.state.isPlay ? "pause" : "play"))}
                                onClick={this.togglePlay} />
                            <div className={prefix("control next")} onClick={this.next} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    public componentDidMount() {
       this.initScene(this.props.scene);
    }
    public componentDidUpdate(prevProps: ControlArea["props"]) {
        if (prevProps.scene !== this.props.scene) {
            this.initScene(this.props.scene);
            this.releaseScene(prevProps.scene);
        }
    }
    public componentWillUnmount() {
        this.releaseScene(this.props.scene);
    }
    private initScene(scene?: Scene | SceneItem) {
        if (!scene) {
            return;
        }
        scene.on({
            play: this.play,
            paused: this.pause,
        });
    }
    private releaseScene(scene?: Scene | SceneItem) {
        if (!scene) {
            return;
        }
        scene.off("play", this.play);
        scene.off("paused", this.pause);
    }
    private play = () => {
        this.setState({ isPlay: true });
    }
    private pause = () => {
        this.setState({ isPlay: false });
    }
    private togglePlay = () => {
        this.props.timeline.togglePlay();
    }
    private prev = () => {
        this.props.timeline.prev();
    }
    private next = () => {
        this.props.timeline.next();
    }
    private unselect = () => {
        this.props.timeline.select("", -1);
    }
}
