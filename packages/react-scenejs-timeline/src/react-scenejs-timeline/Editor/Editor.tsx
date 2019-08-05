import * as React from "react";
import Timeline from "../Timeline";
import Scene, { SceneItem } from "scenejs";
import Infos from "./Infos/Infos";
import Menus from "./Menus/Menus";
import { SelectEvent } from "../types";
import { ref } from "framework-utils";
import Moveable, { OnDrag, OnResize, OnRotate, OnRotateEnd } from "react-moveable";
import { findSceneItemByElementStack, prefix } from "../utils";
import styled, { StylerElement } from "react-css-styler";
import { EDITOR_CSS } from "../consts";

const EditorElement = styled("div", EDITOR_CSS);

export default class Editor extends React.PureComponent<{
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
    private editorElement!: typeof EditorElement extends new (...args: any[]) => infer U ? U : never;
    private labelElement!: HTMLDivElement;
    private moveable!: Moveable;

    public render() {
        const selectedTarget = this.state.selectedTarget;

        return (
            <EditorElement className="scenejs-editor" ref={ref(this, "editorElement")}>
                <div className={prefix("label")} ref={ref(this, "labelElement")}></div>
                <Menus />
                <Moveable
                    target={selectedTarget}
                    draggable={true}
                    resizable={true}
                    rotatable={true}
                    throttleDrag={1}
                    container={document.body}
                    // onDragStart={this.onDragStart}
                    onRotate={this.onRotate}
                    onRotateEnd={this.onRotateEnd}
                    onDrag={this.onDrag}
                    onDragEnd={this.onDragEnd}
                    // onResizeStart={this.onResizeStart}
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
            </EditorElement>);
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
            if (this.editorElement.getElement().contains(target)) {
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
    private setLabel(x: number, y: number, text: string) {
        this.labelElement.style.cssText = `display:block;
        transform:translate(-100%, -100%) translate(${x}px, ${y}px) translateZ(60px);`;
        this.labelElement.innerHTML = text;
    }
    private hideLabel() {
        this.labelElement.style.display = "none";
    }
    private onAnimate = () => {
        this.infos.update(this.timeline.getValues());
    }
    private onSelect = (e: SelectEvent) => {
        (document.activeElement as HTMLInputElement).blur();

        this.infos.select(e, this.timeline.getValues());
    }
    private onReisze = ({ target, width, height, clientX, clientY }: OnResize) => {
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
        this.setLabel(clientX, clientY, `W: ${width}px<br/>H: ${height}px`);
    }
    private onRotate = ({ target, beforeDelta, clientX, clientY }: OnRotate) => {
        // target.style.width = `${width}px`;
        // target.style.height = `${height}px`;
        // this.setLabel(clientX, clientY, `W: ${width}px<br/>H: ${height}px`);
    }
    private onDrag = ({ clientX, clientY, target, left, top }: OnDrag) => {
        target.style.left = `${left}px`;
        target.style.top = `${top}px`;
        this.setLabel(clientX, clientY, `X: ${left}px<br/>Y: ${top}px`);
    }
    private onDragEnd = () => {
        // history save
        this.hideLabel();
    }
    private onResizeEnd = () => {
        // history save
        this.hideLabel();
    }
    private onRotateEnd = ({ target, clientX, clientY }: OnRotateEnd) => {
        // history save
        this.hideLabel();
    }
    private onUpdate = () => {
        this.update();
    }
}
