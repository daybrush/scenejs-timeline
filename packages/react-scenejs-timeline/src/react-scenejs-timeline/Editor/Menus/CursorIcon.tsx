import React from "react";
import { prefix } from "../../utils";

export default class CursorIcon extends React.PureComponent {
    public render() {
        return (
            <div className={prefix("icon")}>
                <svg viewBox="0 0 80 80">
                    <path
                        d="M 21,21 L 35,60 L 40,44 L 54,58 A 3,3 0,0,0, 58,54 L 44,40 L 60,35 L 21,21Z"
                        fill="#222" strokeLinejoin="round"
                        strokeWidth="3" stroke="#eee"
                        style={{ transformOrigin: "42px 42px", transform: "rotate(10deg)" }} />
                </svg>
            </div>
        );
    }
}
