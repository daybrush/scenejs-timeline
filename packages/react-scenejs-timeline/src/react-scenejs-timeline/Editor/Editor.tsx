import * as React from "react";
import Timeline from "../Timeline";
import Scene, { SceneItem } from "scenejs";
import Infos from "./Infos/Infos";
import Menus from "./Menus/Menus";
import { SelectEvent } from "../types";
import { ref } from "framework-utils";

export default class Editor extends React.Component<{
    scene: Scene | SceneItem,
}, {
    selectedTarget: HTMLElement | null,
}> {
    public state: {
        selectedTarget: HTMLElement | null,
    } = {
        selectedTarget: null,
    };
    private infos!: Infos;
    private timeline!: Timeline;
    public render() {
        const selectedTarget = this.state.selectedTarget;

        return (
            <div className="scenejs-editor">
                <Menus />
                <Infos
                    ref={ref(this, "infos")}
                    onUpdate={this.onUpdate}
                />
                <Timeline
                    ref={ref(this, "timeline")}
                    scene={this.props.scene}
                    style={{
                        maxHeight: "350px",
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                    onSelect={this.onSelect}
                />
            </div>);
    }
    public componentDidMount() {
        this.infos.select({
            selectedItem: this.props.scene,
            selectedName: "",
        });
        this.checkScene(undefined, this.props.scene);
    }
    public componentDidUpdate(prevProps: any) {
        this.checkScene(prevProps.scene, this.props.scene);
    }
    public update(isInit?: boolean) {
        this.timeline.update(isInit);
    }
    private checkScene(prevScene?: Scene | SceneItem, scene?: Scene | SceneItem) {
        if (prevScene !== scene) {
            this.releaseScene(prevScene);
            this.initScene(scene);
        }
    }
    private initScene(scene?: Scene | SceneItem) {
        if (!scene) {
            return;
        }
        scene.on("animate", this.onAnimate);
    }
    private releaseScene(scene?: Scene | SceneItem) {
        if (!scene) {
            return;
        }
        scene.off("animate", this.onAnimate);
    }
    private onAnimate = () => {
        this.infos.update(this.timeline.getValues());
    }
    private onSelect = (e: SelectEvent) => {
        (document.activeElement as HTMLInputElement).blur();

        this.infos.select(e, this.timeline.getValues());
    }
    private onUpdate = () => {
        this.update();
    }
}
