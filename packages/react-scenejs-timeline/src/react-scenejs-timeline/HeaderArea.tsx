import { TimelineInfo } from "./types";
// import KeytimesArea from "./KeytimesArea";
import * as React from "react";
import { prefix } from "./utils";
import { ref } from "framework-utils";
import Timeline from "./Timeline";
import Ruler from "@scena/react-ruler";

export default class HeaderArea extends React.PureComponent<{
    timelineInfo: TimelineInfo,
    zoom: number,
    timeline: Timeline,
}> {
    public ruler!: Ruler;
    public render() {
        // const { timelineInfo, maxTime, maxDuration, zoom, timeline } = this.props;
        return (
            <div className={prefix("header-area")}>
                <div className={prefix("properties-area")}>
                    <div className={prefix("property")}>Name</div>
                </div>
                <div className={prefix("values-area")}>
                    <div className={prefix("value")} >
                        {/* <div className={prefix("add")} onClick={this.openDialog}>+</div> */}
                    </div>
                </div>
                <div className={prefix("keyframes-area")}>
                    <Ruler
                        ref={ref(this, "ruler")}
                        zoom={100}
                        unit={1}
                        negativeRuler={false}
                        textAlign={"center"}
                        mainLineSize={12}
                        longLineSize={6}
                        shortLineSize={6}
                        style={{
                        width: "100%",
                        height: "100%",
                    }}/>
                </div>
            </div>
        );
    }
    public componentDidMount() {
        this.ruler.scroll(-0.1);
    }
}
