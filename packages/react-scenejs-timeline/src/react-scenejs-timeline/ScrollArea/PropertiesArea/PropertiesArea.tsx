import { TimelineInfo } from "../../types";
import Property from "./Property";
import * as React from "react";
import { prefix, checkFolded } from "../../utils";
import ElementComponent from "../../utils/ElementComponent";
import { IObject } from "@daybrush/utils";
import { refs } from "framework-utils";
import ScrollArea from "../ScrollArea";
import Timeline from "../../Timeline";

export default class PropertiesArea extends ElementComponent<{
    timelineInfo: TimelineInfo,
    selectedProperty: string,
    timeline: Timeline,
    scrollArea: ScrollArea,
}, {
    foldedInfo: IObject<boolean>,
}> {
    public properties: Property[] = [];
    public state = {
        foldedInfo: {},
    };
    public render() {
        const {
            timelineInfo,
            selectedProperty,
            timeline,
            scrollArea,
        } = this.props;
        const { foldedInfo } = this.state;
        const properties: JSX.Element[] = [];

        this.properties = [];
        let index = -1;

        for (const id in timelineInfo) {
            const propertiesInfo = timelineInfo[id];
            const selected = selectedProperty === id;
            const folded = checkFolded(foldedInfo, propertiesInfo.keys);

            ++index;
            properties.push(
                <Property
                    ref={refs(this, "properties", index)}
                    timeline={timeline}
                    scrollArea={scrollArea}
                    selected={selected}
                    folded={folded}
                    key={id}
                    id={id}
                    index={index}
                    propertiesInfo={propertiesInfo} />,
            );
        }

        return (
            <div className={prefix("properties-area")}>
                <div className={prefix("properties-scroll-area")}>
                    {properties}
                </div>
            </div>
        );
    }
}
