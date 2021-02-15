import {
    PREFIX,
} from "./consts";
import Scene, { SceneItem, NAME_SEPARATOR, isScene, isSceneItem, AnimatorState, Frame, animate } from "scenejs";
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
import { ItemInfo, TimelineInfo, Keyframe, FrameLine } from "./types";

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
export function splitProperty(scene: Scene, property: string) {
    const names = property.split(NAME_SEPARATOR);
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
        (name, i) => foldedInfo[names.slice(0, i + 1).join(NAME_SEPARATOR) + NAME_SEPARATOR]
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
//     const id = foldedProperty + SEPARATOR;
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
    if (firstEntry[0] !== 0 && states[states.length - 1].delay) {
        entries.unshift([0, 0]);
    }

    states.forEach((state) => {
        const {
            delay,
            playSpeed,
            direction,
        } = state;
        const iterationCount = state.iterationCount as number;
        const intCount = Math.ceil(iterationCount);
        const currentDuration = entries[entries.length - 1][0];
        const length = entries.length;
        const lastTime = currentDuration * iterationCount;

        for (let i = 0; i < intCount; ++i) {
            const isReverse =
                direction === "reverse" ||
                (direction === "alternate" && i % 2) ||
                (direction === "alternate-reverse" && !(i % 2));

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
                return state.iterationCount === "infinite";
            },
            states.length - 1
        ) + 1;

    return getEntries(times, states.slice(0, infiniteIndex));
}

export function getItemProperties(
    infoMap: Record<string, ItemInfo>,
    items: Array<Scene | SceneItem>,
    itemNames: Array<string | number>,
    item: SceneItem
): ItemInfo[] {
    item.update();
    const times = item.times.slice();

    const originalDuration = item.getDuration();
    !item.getFrame(0) && times.unshift(0);
    !item.getFrame(originalDuration) && times.push(originalDuration);
    const states = items
        .slice(1)
        .map((animator) => animator.state)
        .reverse();
    const entries = getFiniteEntries(times, states);
    const parentItem = items[items.length - 2] as Scene;

    function getProperties(names: Array<string | number>): ItemInfo {
        const frameInfos = getFrameInfos(entries.map(([time, iterationTime]) => {
            const value = item.get(iterationTime, ...names);
            if (isUndefined(value)) {
                return;
            }
            return [time, iterationTime, value];
        }), originalDuration, true);
        const keys = [...itemNames, ...names];
        const key = keys.join(NAME_SEPARATOR);
        const children = (item.getOrders(names) || []).map(nextName => {
            return getProperties([...names, nextName]);
        });
        const info: ItemInfo = {
            key,
            keys,
            name: names[names.length - 1],
            names,
            parentScene: parentItem,
            scene: item,
            isScene: false,
            isItem: false,
            isFrame: true,
            children,
            ...frameInfos,
        };

        infoMap[key] = info;

        return info;
    };

    return item.getOrders([])!.map(name => {
        return getProperties([name]);
    });
}
export function getFrameInfos(entries: Array<any[] | undefined>, duration: number, isFrame?: boolean) {
    const frames: Keyframe[] = [];
    const frameLines: FrameLine[] = [];

    (entries.filter(Boolean) as any[][]).forEach(([time, iterationTime, value], i) => {
        let isDelay = false;
        const nextEntry = entries[i + 1];
        const hasFrame =  !isUndefined(value);

        if (nextEntry) {
            const [nextTime, nextIterationTime] = nextEntry;

            isDelay = (iterationTime === 0 && nextIterationTime === 0)
              || (iterationTime === duration && nextIterationTime === duration);

            if (!isDelay && !hasFrame) {
                return;
            }
            if (!isFrame || !isDelay) {
                frameLines.push({
                    isDelay,
                    startTime: time,
                    endTime: nextTime,
                });
            }
        }
        if (!isDelay || i !== 0) {
            frames.push({
                isScene: true,
                time,
                iterationTime,
                value,
            });
        }
    });
    return {
        frames,
        frameLines,
    };
}
export function getTimelineInfo(scene: Scene | SceneItem): TimelineInfo {
    const infoMap: Record<string, ItemInfo> = {};
    const rootInfo = (function sceneForEach(...items: Array<Scene | SceneItem>) {
        const length = items.length;
        const lastItem = items[length - 1];
        const names = items.map((item) => `${item.getId()}`);
        const name = lastItem.getId();
        const key = names.join(NAME_SEPARATOR);
        const duration = lastItem.getDuration();
        let children: ItemInfo[] = [];
        let info: ItemInfo;

        if (isScene(lastItem)) {
            const times = [0, duration];
            const entries = getFiniteEntries(times, items.slice(1).map(animator => animator.state).reverse());
            const frameInfos = getFrameInfos(entries.map(([time, iterationTime]) => {
                return [time, iterationTime, iterationTime];
            }), duration);
            info = {
                key,
                keys: names,
                name,
                names,
                isItem: false,
                isScene: true,
                parentScene: items[length - 2] as Scene,
                scene: lastItem,
                children,
                ...frameInfos,
            };
            lastItem.forEach((item: Scene | SceneItem, _) => {
                children.push(sceneForEach(...items, item));
            });
        } else {
            const times = lastItem.times.slice();
            !lastItem.getFrame(0) && times.unshift(0);
            !lastItem.getFrame(duration) && times.push(duration);

            const entries = getFiniteEntries(times, items.slice(1).map(animator => animator.state).reverse());
            const frameInfos = getFrameInfos(entries.map(([time, iterationTime]) => {
                return [time, iterationTime, lastItem.getFrame(iterationTime)];
            }), duration);
            children = getItemProperties(infoMap, items, names, lastItem);
            info = {
                key,
                keys: names,
                name,
                names: [],
                isItem: true,
                isScene: false,
                parentScene: items[length - 2] as Scene,
                scene: lastItem,
                children,
                ...frameInfos,
            };

        }
        infoMap[key] = info;
        return info;
    })(scene);
    return {
        rootInfo,
        infoMap,
    };
}
export function getCurrentFlattedFrames(scene: Scene) {
    const frames = scene.getCurrentFlattedFrames();
    const nextFrames: Record<string, Frame> = {};
    const id = scene.getId();

    for (const name in frames) {
        nextFrames[`${id}${NAME_SEPARATOR}${name}`] = frames[name];
    }
    return nextFrames;

}

export function checkInput(target: any) {
    return (target ? (target.tagName || "") : "").toLowerCase() === "input";
}