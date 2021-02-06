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
/**
 * @typedef
 * @property - key
 * @property - key array
 * @property - property names
 */
export interface PropertiesInfo {
    key: string;
    keys: string[];
    names: string[];

    isScene: boolean;
    isItem: boolean;

    parentScene?: Scene;
    scene: Scene | SceneItem;
}
export type TimelineInfo = IObject<PropertiesInfo>;
