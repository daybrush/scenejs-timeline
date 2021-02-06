import {
    ALTERNATE,
    ALTERNATE_REVERSE,
    DELAY,
    DIRECTION,
    INFINITE,
    ITERATION_COUNT,
    PLAY_SPEED,
    PREFIX,
    REVERSE,
} from "./consts";
import Scene, { SceneItem, Frame, AnimatorState } from "scenejs";
import {
    hasClass as hasClass2,
    addClass as addClass2,
    removeClass as removeClass2,
    IObject,
    isObject,
    findIndex,
    dot,
    isUndefined,
} from "@daybrush/utils";
import { prefixNames } from "framework-utils";
import { TimelineInfo } from "./types";

export function numberFormat(num: number, count: number, isRight?: boolean) {
    const length = `${num}`.length;
    const arr = [];

    if (isRight) {
        arr.push(num);
    }
    for (let i = length; i < count; ++i) {
        arr.push(0);
    }
    if (!isRight) {
        arr.push(num);
    }
    return arr.join("");
}
export function applyStyle(el: HTMLElement, style: IObject<any>) {
    for (const name in style) {
        el.style[name as any] = style[name as any];
    }
}
export function keys(value: object) {
    const arr = [];
    for (const name in value) {
        arr.push(name);
    }
    return arr;
}
export function toValue(value: any): any {
    if (isObject(value)) {
        if (Array.isArray(value)) {
            return `[${value.join(", ")}]`;
        }
        return `{${keys(value)
            .map((k) => `${k}: ${toValue(value[k])}`)
            .join(", ")}}`;
    }
    return value;
}
export function flatObject(obj: IObject<any>, newObj: IObject<any> = {}) {
    for (const name in obj) {
        const value = obj[name];

        if (isObject(value)) {
            const nextObj = flatObject(isFrame(value) ? value.get() : value);

            for (const nextName in nextObj) {
                newObj[`${name}///${nextName}`] = nextObj[nextName];
            }
        } else {
            newObj[name] = value;
        }
    }
    return newObj;
}

export function getTarget<T extends HTMLElement>(
    target: T,
    conditionCallback: (el: Element) => boolean
): T | null {
    let parentTarget = target;

    while (parentTarget && parentTarget !== document.body) {
        if (conditionCallback(parentTarget)) {
            return parentTarget;
        }
        parentTarget = parentTarget.parentNode as T;
    }
    return null;
}

export function hasClass(target: Element, className: string) {
    return hasClass2(target, `${PREFIX}${className}`);
}
export function addClass(target: Element, className: string) {
    return addClass2(target, `${PREFIX}${className}`);
}
export function removeClass(target: Element, className: string) {
    return removeClass2(target, `${PREFIX}${className}`);
}
export function isScene(value: any): value is Scene {
    return value && !!(value.constructor as typeof Scene).prototype.getItem;
}
export function isSceneItem(value: any): value is SceneItem {
    return (
        value && !!(value.constructor as typeof SceneItem).prototype.getFrame
    );
}
export function isFrame(value: any): value is Frame {
    return value && !!(value.constructor as typeof Frame).prototype.toCSS;
}
export function splitProperty(scene: Scene, property: string) {
    const names = property.split("///");
    const length = names.length;
    let item: Scene | SceneItem = scene;
    let i;

    for (i = 0; i < length; ++i) {
        if (isSceneItem(item)) {
            break;
        }
        item = scene.getItem(names[i]);
    }
    return {
        item: item as SceneItem,
        names: names.slice(0, i),
        properties: names.slice(i),
    };
}
export function getSceneItem(scene: Scene, names: string[]): SceneItem {
    return names.reduce<any>(
        (nextScene, name) => nextScene.getItem(name),
        scene
    );
}

export function findElementIndexByPosition(
    elements: HTMLElement[],
    pos: number
): number {
    return findIndex(elements, (el) => {
        const box = el.getBoundingClientRect();
        const top = box.top;
        const bottom = top + box.height;

        return top <= pos && pos < bottom;
    });
}

export function prefix(...classNames: string[]) {
    return prefixNames(PREFIX, ...classNames);
}

export function checkFolded(foldedInfo: IObject<any>, names: any[]) {
    const index = findIndex(
        names,
        (name, i) => foldedInfo[names.slice(0, i + 1).join("///") + "///"]
    );

    if (index > -1) {
        if (index === names.length - 1) {
            return 2;
        }
        return 1;
    } else {
        return 0;
    }
}

// export function fold(
//     target: ElementComponent<any, { foldedInfo: IObject<boolean> }>,
//     foldedProperty: string,
//     isNotUpdate?: boolean,
// ) {
//     const id = foldedProperty + "///";
//     const foldedInfo = target.state.foldedInfo;

//     foldedInfo[id] = !foldedInfo[id];
//     if (!isNotUpdate) {
//         target.setState({
//             foldedInfo: { ...foldedInfo },
//         });
//     }
// }

export const MAXIMUM = 1000000;
export function toFixed(num: number) {
    return Math.round(num * MAXIMUM) / MAXIMUM;
}
export function addEntry(entries: number[][], time: number, keytime: number) {
    const prevEntry = entries[entries.length - 1];

    (!prevEntry || prevEntry[0] !== time || prevEntry[1] !== keytime) &&
        entries.push([toFixed(time), toFixed(keytime)]);
}
export function getEntries(times: number[], states: AnimatorState[]) {
    if (!times.length) {
        return [];
    }
    let entries = times.map((time) => [time, time]);
    let nextEntries: number[][] = [];
    const firstEntry = entries[0];
    if (firstEntry[0] !== 0 && states[states.length - 1][DELAY]) {
        entries.unshift([0, 0]);
    }

    states.forEach((state) => {
        const iterationCount = state[ITERATION_COUNT] as number;
        const delay = state[DELAY];
        const playSpeed = state[PLAY_SPEED];
        const direction = state[DIRECTION];
        const intCount = Math.ceil(iterationCount);
        const currentDuration = entries[entries.length - 1][0];
        const length = entries.length;
        const lastTime = currentDuration * iterationCount;

        for (let i = 0; i < intCount; ++i) {
            const isReverse =
                direction === REVERSE ||
                (direction === ALTERNATE && i % 2) ||
                (direction === ALTERNATE_REVERSE && !(i % 2));

            for (let j = 0; j < length; ++j) {
                const entry = entries[isReverse ? length - j - 1 : j];
                const time = entry[1];
                const currentTime =
                    currentDuration * i +
                    (isReverse ? currentDuration - entry[0] : entry[0]);
                const prevEntry = entries[isReverse ? length - j : j - 1];

                if (currentTime > lastTime) {
                    if (j !== 0) {
                        const prevTime =
                            currentDuration * i +
                            (isReverse
                                ? currentDuration - prevEntry[0]
                                : prevEntry[0]);
                        const divideTime = dot(
                            prevEntry[1],
                            time,
                            lastTime - prevTime,
                            currentTime - lastTime
                        );

                        addEntry(
                            nextEntries,
                            (delay + currentDuration * iterationCount) /
                                playSpeed,
                            divideTime
                        );
                    }
                    break;
                } else if (
                    currentTime === lastTime &&
                    nextEntries.length &&
                    nextEntries[nextEntries.length - 1][0] === lastTime + delay
                ) {
                    break;
                }
                addEntry(nextEntries, (delay + currentTime) / playSpeed, time);
            }
        }
        // delay time
        delay && nextEntries.unshift([0, nextEntries[0][1]]);

        entries = nextEntries;
        nextEntries = [];
    });

    return entries;
}
export function getFiniteEntries(times: number[], states: AnimatorState[]) {
    const infiniteIndex =
        findIndex(
            states,
            (state) => {
                return state[ITERATION_COUNT] === INFINITE;
            },
            states.length - 1
        ) + 1;

    return getEntries(times, states.slice(0, infiniteIndex));
}
// export function getItemInfo(
//     timelineInfo: TimelineInfo,
//     items: Array<Scene | SceneItem>,
//     names: Array<string | number>,
//     item: SceneItem
// ) {
//     item.update();
//     const times = item.times.slice();

//     const originalDuration = item.getDuration();
//     !item.getFrame(0) && times.unshift(0);
//     !item.getFrame(originalDuration) && times.push(originalDuration);
//     const states = items
//         .slice(1)
//         .map((animator) => animator.state)
//         .reverse();
//     const entries = getFiniteEntries(times, states);
//     const parentItem = items[items.length - 2] as Scene;

//     (function getPropertyInfo(itemNames: string[]) {
//         itemNames.forEach((key) => {
//             const frames: any[] = [];
//             const isParent = isObject(itemNames);
//             const keys = key.split("///");

//             const isItem = keys.length === 1;
//             entries.forEach(([time, iterationTime]) => {
//                 const value = item.get(iterationTime, ...keys);
//                 if (isUndefined(value)) {
//                     return;
//                 }
//                 frames.push([time, iterationTime, value]);
//             });

//             if (key) {
//                 timelineInfo[key] = {
//                     key,
//                     keys,
//                     parentItem,
//                     isParent,
//                     isItem,
//                     item,
//                     names,
//                     properties,
//                     frames,
//                 };
//             }
//             if (isParent) {
//                 for (const property in itemNames) {
//                     getPropertyInfo(
//                         itemNames[property],
//                         ...properties,
//                         property
//                     );
//                 }
//             }
//         });
//     })(item.getOrders([]) as string[]);
// }
export function getTimelineInfo(scene: Scene | SceneItem): TimelineInfo {
    const timelineInfo: TimelineInfo = {};

    (function sceneForEach(...items: Array<Scene | SceneItem>) {
        const length = items.length;
        const lastItem = items[length - 1];
        const names = items.map((item) => `${item.getId()}`);
        const key = names.join("///");
        if (isScene(lastItem)) {
            timelineInfo[key] = {
                key,
                keys: names,
                names: [],
                isItem: false,
                isScene: true,
                parentScene: items[length - 2] as Scene,
                scene: lastItem,
            };
            lastItem.forEach((item: Scene | SceneItem) => {
                sceneForEach(...items, item);
            });
        } else {
            timelineInfo[key] = {
                key,
                keys: names,
                names: [],
                isItem: true,
                isScene: false,
                parentScene: items[length - 2] as Scene,
                scene: lastItem,
            };
            // getItemInfo(timelineInfo, items, names, lastItem);
        }
    })(scene);
    return timelineInfo;
}
