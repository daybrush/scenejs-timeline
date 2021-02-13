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
    timelineInfo: TimelineInfo | null;
    selectedKeys: string[];
    selectedTime: number;
    selectedItem: Scene | SceneItem | null;
    updateTime: boolean;
    init: boolean;
}
/**
 * @typedef
 * @property - key
 * @property - key array
 * @property - property names
 */
export interface ItemInfo {
    key: string;
    keys: Array<string | number>;
    name: string | number;
    names: Array<string | number>;

    isScene: boolean;
    isItem: boolean;
    isFrame?: boolean;

    parentScene?: Scene;
    scene: Scene | SceneItem;
    children: ItemInfo[];
    frames: Keyframe[];
    frameLines: FrameLine[];
}
export interface TimelineInfo {
    infoMap: Record<string, ItemInfo>;
    rootInfo: ItemInfo;
}
export interface FrameLine {
    isDelay?: boolean;
    startTime: number;
    endTime: number;
}
export interface Keyframe {
    isDelay?: boolean;
    isScene?: boolean;
    isItem?: boolean;
    time: number;
    iterationTime: number;
    value: any;
}
