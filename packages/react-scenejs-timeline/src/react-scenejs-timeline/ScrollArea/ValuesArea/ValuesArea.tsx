import { TimelineInfo } from "../../types";
import Value from "./Value";
import * as React from "react";
import { prefix, checkFolded, getTarget, hasClass } from "../../utils";
import ElementComponent from "../../utils/ElementComponent";
import { IObject, findIndex } from "@daybrush/utils";
import Dragger from "@daybrush/drag";
import KeyController from "keycon";
import { refs } from "framework-utils";
import Timeline from "../../Timeline";

export default class ValuesArea extends ElementComponent<{
    timelineInfo: TimelineInfo,
    selectedProperty: string,
    timeline: Timeline,
}, {
    foldedInfo: IObject<boolean>,
}> {
    public dragger!: Dragger;
    public values: Value[] = [];
    public state = {
        foldedInfo: {},
    };
    private keycon!: KeyController;
    public render() {
        const { timelineInfo, selectedProperty, timeline } = this.props;
        const { foldedInfo } = this.state;
        const values: JSX.Element[] = [];
        this.values = [];

        for (const id in timelineInfo) {
            const propertiesInfo = timelineInfo[id];
            const selected = selectedProperty === id;
            const folded = checkFolded(foldedInfo, propertiesInfo.keys);

            values.push(<Value
                ref={refs(this, "values", values.length)}
                timeline={timeline}
                key={id}
                folded={folded}
                selected={selected}
                id={id} propertiesInfo={propertiesInfo} />);
        }

        return (
            <div className={prefix("values-area")}>
                {values}
            </div>
        );
    }
    public componentDidMount() {
        const element = this.getElement();
        let dragTarget: HTMLInputElement;
        let dragTargetValue: any;

        element.addEventListener("focusout", e => {
            this.props.timeline.setTime();
        });
        this.dragger = new Dragger(element, {
            container: window,
            dragstart: e => {
                dragTarget = e.inputEvent.target;
                dragTargetValue = dragTarget.value;

                if (!KeyController.global.altKey || !getTarget(dragTarget, el => el.nodeName === "INPUT")) {
                    return false;
                }
            },
            drag: e => {
                const nextValue = dragTargetValue.replace(/-?\d+/g, (num: string) => {
                    return `${parseFloat(num) + Math.round(e.distX / 2)}`;
                });

                dragTarget.value = nextValue;
            },
            dragend: e => {
                this.edit(dragTarget, dragTarget.value);
            },
        });
        this.keycon = new KeyController(element)
            .keydown(e => {
                !e.isToggle && e.inputEvent.stopPropagation();
            })
            .keyup(e => {
                !e.isToggle && e.inputEvent.stopPropagation();
            })
            .keyup("enter", e => {
                const target = e.inputEvent.target as HTMLInputElement;

                this.edit(target, target.value);
            })
            .keyup("esc", e => {
                const target = e.inputEvent.target as HTMLInputElement;

                target.blur();
            });
    }
    public componentWillUnmount() {
        this.dragger.unset();
        this.keycon.off();
    }
    private edit(target: HTMLInputElement, value: any) {
        const parentEl = getTarget(target, el => hasClass(el, "value"));

        if (!parentEl) {
            return;
        }
        const index = findIndex(this.values, v => v.getElement() === parentEl);

        if (index === -1) {
            return;
        }
        this.props.timeline.editKeyframe(index, value);
    }
}
