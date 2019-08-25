import { TimelineInfo } from "../types";
import ElementComponent from "../utils/ElementComponent";
import KeyframesArea from "./KeyframesArea/KeyframesArea";
import PropertiesArea from "./PropertiesArea/PropertiesArea";
import ValuesArea from "./ValuesArea/ValuesArea";
import * as React from "react";
import { prefix, fold } from "../utils";
import { ref } from "framework-utils";
import Timeline from "../Timeline";

export default class ScrollArea extends ElementComponent<{
    timeline: Timeline,
    timelineInfo: TimelineInfo,
    maxTime: number,
    maxDuration: number,
    zoom: number,
    selectedProperty: string,
    selectedTime: number,
}> {
    public propertiesArea!: PropertiesArea;
    public valuesArea!: ValuesArea;
    public keyframesArea!: KeyframesArea;
    public render() {
        const {
            zoom, maxDuration, maxTime, timelineInfo,
            selectedProperty, selectedTime, timeline,
        } = this.props;

        return (
            <div className={prefix("scroll-area")}>
                <PropertiesArea
                    ref={ref(this, "propertiesArea")}
                    timeline={timeline}
                    scrollArea={this}
                    timelineInfo={timelineInfo}
                    selectedProperty={selectedProperty}
                />
                <ValuesArea
                    ref={ref(this, "valuesArea")}
                    timeline={timeline}
                    timelineInfo={timelineInfo}
                    selectedProperty={selectedProperty}
                />
                <KeyframesArea
                    ref={ref(this, "keyframesArea")}
                    timeline={timeline}
                    zoom={zoom}
                    maxDuration={maxDuration}
                    timelineInfo={timelineInfo}
                    maxTime={maxTime}
                    selectedProperty={selectedProperty}
                    selectedTime={selectedTime}
                />
            </div>
        );
    }
    public componentDidMount() {
        this.foldAll();
    }
    public foldAll() {
        // fold all
        this.propertiesArea.properties.forEach((property, i) => {
            const { isParent } = property.props.propertiesInfo;

            if (isParent) {
                this.fold(i);
            }
        });
    }
    public fold(index: number, isNotUpdate?: boolean) {
        const selectedProperty = this.propertiesArea.properties[index];
        const foldedId = selectedProperty.props.id;

        fold(this.propertiesArea, foldedId, isNotUpdate);
        fold(this.valuesArea, foldedId, isNotUpdate);
        fold(this.keyframesArea, foldedId, isNotUpdate);
    }
}
