import * as React from "react";
import Timeline from "../Timeline";
import Scene, { SceneItem } from "scenejs";
import Infos from "./Infos/Infos";
import Menus from "./Menus/Menus";
import { SelectEvent } from "../types";
import { ref } from "framework-utils";
import Moveable, { OnDrag, OnResize } from "react-moveable";
import { findSceneItemByElementStack } from "../utils";

export default class Editor extends React.Component<{
    scene: Scene | SceneItem,
}, {
    selectedTarget: HTMLElement | SVGElement | null,
}> {
    public state: {
        selectedTarget: HTMLElement | null,
    } = {
            selectedTarget: null,
        };
    private infos!: Infos;
    private timeline!: Timeline;
    private editorElement!: HTMLElement;
    private moveable!: Moveable;

    public render() {
        const selectedTarget = this.state.selectedTarget;

        return (
            <div className="scenejs-editor" ref={ref(this, "editorElement")}>
                <Menus />
                <Moveable
                    target={selectedTarget}
                    draggable={true}
                    resizable={true}
                    rotatable={true}
                    container={document.body}
                    onDrag={this.onDrag}
                    onResize={this.onReisze}
                    ref={ref(this, "moveable")} />
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

        document.body.addEventListener("mousedown", e => {
            const [parentElement, item]
                = findSceneItemByElementStack(e.target as any, this.props.scene);

            if (!parentElement || !item) {
                return;
            }

            this.timeline.selectItem(item);

            let target = parentElement;

            if ((target as any).ownerSVGElement) {
                target = (target as any).ownerSVGElement;
            }
            if (this.editorElement.contains(target)) {
                return;
            }
            if (this.state.selectedTarget === target) {
                this.moveable.updateRect();
            } else {
                this.setState({
                    selectedTarget: target,
                });
            }
        });
        window.addEventListener("resize", () => {
            this.moveable.updateRect();
        });
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
    private onReisze = ({ target, width, height }: OnResize) => {
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
    }
    private onDrag = ({ target, left, top }: OnDrag) => {
        target.style.left = `${left}px`;
        target.style.top = `${top}px`;
    }
    private onUpdate = () => {
        this.update();
    }
}
