import { prefixCSS } from "framework-utils";

export const PREFIX = `scenejs-timeline-`;
export const CSS = prefixCSS(PREFIX, `
{
    position: relative;
    width: 100%;
    font-size: 0;
    background: #000;
    display: flex;
    flex-direction: column;
    --${PREFIX}border-color: #666;
    --${PREFIX}time: 0;
}
* {
    font-family: sans-serif;
    box-sizing: border-box;
    color: #fff;
}
.header-area, .scroll-area {
   width: 100%;
   position: relative;
  display: flex;
  -webkit-align-items: flex-start;
  align-items: flex-start;
}
.header-area {
  position: relative;
  z-index: 10;
  top: 0;
  height: 30px;
  min-height: 30px;
  border-bottom: 1px solid var(--scenejs-timeline-border-color);
}
.header-area .keyframes {
  padding: 0px;
}
.header-area .properties-area,
.header-area .keyframes-area,
.header-area .keyframes-scroll-area {
    height: 100%;
}
.header-area .keyframes-scroll-area {
    overflow: hidden;
}
.header-area .property, .header-area .keyframes {
  height: 100%;
}
.header-area .property {
    padding-left: 10px;
}
.header-area .keyframes-area {
    overflow: hidden;
}

.header-area .keyframes-area::-webkit-scrollbar {
    display: none;
}
.header-area .keyframe-cursor {
    position: absolute;
    border-top: 10px solid #4af;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    width: 0;
    height: 0;
    bottom: 0;
    top: auto;
    background: none;
    cursor: pointer;
    will-change: transform;
}
.keyframes-scroll-area .keyframe-cursor {
    position: absolute;
    top: 0;
    z-index: 1;
    background: #4af;
    width: 1px;
    height: 100%;
    left: 0px;
    transform: translate(-50%);
    potiner-events: none;
    will-change: transform;
}
.control-area .keyframes {
    padding-left: 10px;
}
.play-control-area {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.play-control-area .control {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    color: white;
    margin: 0px 15px;
    cursor: pointer;
}
.play {
    border-left: 14px solid white;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
}
.pause {
    border-left: 4px solid #fff;
    border-right: 4px solid #fff;
    width: 14px;
    height: 16px;
}
.prev {
    border-right: 10px solid white;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
}
.prev:before {
    position: absolute;
    content: "";
    width: 3px;
    height: 10px;
    top: 0;
    right: 100%;
    transform: translate(0, -50%);
    background: white;
}
.next {
    border-left: 10px solid white;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
}
.next:before {
    position: absolute;
    content: "";
    width: 3px;
    height: 10px;
    top: 0;
    transform: translate(0, -50%);
    background: white;
}
.keytime {
  position: relative;
  display: inline-block;
  height: 100%;
  font-size: 13px;
  font-weight: bold;
  color: #777;
}
.keytime:last-child {
  max-width: 0px;
}
.keytime span {
  position: absolute;
  line-height: 1;
  bottom: 12px;
  display: inline-block;
  transform: translate(-50%);
  color: #eee;
}
.keytime .graduation {
  position: absolute;
  bottom: 0;
  width: 1px;
  height: 10px;
  background: #666;
  transform: translate(-50%);
}
.keytime .graduation.half {
  left: 50%;
  height: 7px;
}
.keytime .graduation.quarter {
  left: 25%;
  height: 5px;
}
.keytime .graduation.quarter3 {
  left: 75%;
  height: 5px;
}
.scroll-area {
  position: relative;
  width: 100%;
  height: calc(100% - 60px);
  overflow: auto;
}
.properties-area, .keyframes-area {
  display: inline-block;
  position: relative;
  font-size: 16px;
  overflow: auto;
}

.properties-area::-webkit-scrollbar, .keyframes-area::-webkit-scrollbar {
    display: none;
}
.properties-area {
  width: 250px;
  box-sizing: border-box;
  background: #333;
  border-right: 1px solid var(--scenejs-timeline-border-color);
}

.property {
    position: relative;
    height: 34px;
    line-height: 30px;
    box-sizing: border-box;
    white-space: nowrap;
    z-index: 1;
    font-size: 13px;
    font-weight: bold;
    color: #eee;
    display: flex;
    padding: 2px 0px;
}
.name {
    position: relative;
    flex: 1;
}
.value {
    position: relative;
    display: block;
    width: 40px;
}
:host.alt .value input {
    cursor: ew-resize;
}
.value[data-object="1"] input {
    display: none;
}
.value .add {
    position: relative;
    width: 100%;
    height: 100%;
    display: block;
    cursor: pointer;
}
.value .add:before, .value .add:after {
    position: absolute;
    content: "";
    width: 10px;
    height: 2px;
    border-radius: 1px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
}
.value .add:after {
    width: 2px;
    height: 10px;
}
.value input {
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    background: transparent;
    color: #4af;
    font-weight: bold;
    background: none;
    border: 0;
    box-sizing: border-box;
    text-align: center;
}


.property .remove {
    position: absolute;
    display: inline-block;
    cursor: pointer;
    width: 18px;
    height: 18px;
    top: 0;
    bottom: 0;
    right: 10px;
    margin: auto;
    border-radius: 50%;
    border: 2px solid #fff;
    vertical-align: middle;
    display: none;
    margin-left: 10px;
    box-sizing: border-box;
}
.property .remove:before, .property .remove:after {
    position: absolute;
    content: "";
    width: 8px;
    height: 2px;
    border-radius: 1px;
    background: #fff;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
.property .remove:before {
    transform: rotate(45deg);
}
.property .remove:after {
    transform: rotate(-45deg);
}
.property:hover .remove {
    display: inline-block;
}



.keyframes-area {
    flex: 1;
}
.keyframes-scroll-area {
    position: relative;
    min-width: 100%;
}
.keyframe {
    position: absolute;
    font-size: 0px;
    width: 12px;
    height: 12px;
    top: 50%;
    background: #fff;
    border: 2px solid #383838;
    border-radius: 2px;
    box-sizing: border-box;
    transform: translate(-50%, -50%) rotate(45deg);
    z-index: 1;
    cursor: pointer;
}
.keyframe-line {
    position: absolute;
    height: 8px;
    top: 50%;
    background: #666;
    z-index: 0;
}
.keyframe-group {
    position: absolute;
    top: 50%;
    height: calc(100% - 6px);
    background: #4af;
    opacity: 0.6;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-left-color: rgba(255, 255, 255, 0.2);
    border-top-color: rgba(255, 255, 255, 0.2);
    z-index: 0;
}
.keyframe-delay {
    height: calc(100% - 6px);
    background: #4af;
    opacity: 0.2;
}
@media screen and (max-width: 450px) {
    .properties-area {
        width: 150px;
    }
}
`);
