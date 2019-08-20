import Scene, { SceneItem, Frame } from "scenejs";
import { IObject } from "@daybrush/utils";
import { HTMLAttributes } from "react";

export interface SelectEvent {
    selectedItem: Scene | SceneItem;
    selectedProperty: string;
    selectedName: string;
    selectedTime: number;
    prevSelectedItem: Scene | SceneItem | null;
    prevSelectedProperty: string;
    prevSelectedTime: number;
}
export type AttributeKeys = Exclude<keyof HTMLAttributes<HTMLDivElement>, "onSelect">;
export type TimelineAttributes = {[key in AttributeKeys]?: HTMLAttributes<HTMLDivElement>[key]};
export interface TimelineProps extends TimelineAttributes {
    scene?: Scene | SceneItem;
    keyboard?: boolean;
    onSelect?: (e: SelectEvent) => any;
}
export interface TimelineState {
    zoom: number;
    alt: boolean;
    maxDuration: number;
    maxTime: number;
    timelineInfo: TimelineInfo;
    selectedProperty: string;
    selectedTime: number;
    selectedItem: Scene | SceneItem | null;
    updateTime: boolean;
    init: boolean;
}
export interface EditorState {
    selectedFrame: Frame | null;
    selectedItem: SceneItem | null;
    selectedTarget: HTMLElement | SVGElement | Array<HTMLElement | SVGElement> | null;
}
export interface PropertiesInfo {
    key: string;
    keys: Array<number | string>;
    parentItem: Scene;
    item: Scene | SceneItem;
    isParent: boolean;
    isItem: boolean;
    names: Array<number | string>;
    properties: string[];
    frames: Array<[number, number, any]>;
}
export type TimelineInfo = IObject<PropertiesInfo>;
