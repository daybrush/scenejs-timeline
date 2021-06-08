import { prefixCSS } from "framework-utils";

export const PREFIX = `scenejs-timeline-`;
export const CSS = prefixCSS(PREFIX, `
{
    position: relative;
    width: 100%;
    font-size: 0;
    display: flex;
    flex-direction: column;
    --${PREFIX}background-color: #333;
    --${PREFIX}border-color: #666;
    --${PREFIX}time: 0;
    background: var(--${PREFIX}background-color);
}
* {
    font-family: sans-serif;
    box-sizing: border-box;
    color: #fff;
}
.top-area, .scroll-area {
   width: 100%;
   position: relative;
  display: flex;
  -webkit-align-items: flex-start;
  align-items: flex-start;
}
.top-area {
  position: relative;
  z-index: 10;
  top: 0;
  height: 30px;
  min-height: 30px;
}
.top-area .keyframes {
  padding: 0px;
}
.top-area .properties-area,
.top-area .keyframes-area,
.top-area .keyframes-scroll-area {
    height: 100%;
}
.top-area .keyframes-scroll-area {
    overflow: hidden;
}
.top-area .property, .top-area .keyframes {
  height: 100%;
}
.top-area .property {
    padding-left: 10px;
}
.top-area .keyframes-area {
    overflow: hidden;
}

/*
Control Area
*/
.control-area {
    border-bottom: 1px solid var(--scenejs-timeline-border-color);
}
.time-area {
    position: absolute;
    top: 0;
    left: 10px;
    font-size: 13px;
    color: #4af;
    line-height: 30px;
    font-weight: bold;
    height: 100%;
    line-height: 30px;
    border: 0;
    background: transparent;
    outline: 0;
}

.control-area .keyframes-area {
    background: var(--${PREFIX}background-color);
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
/*
Header Area
*/
.header-area .border {
    position: absolute;
    width: 100%;
    height: 1px;
    background: var(--scenejs-timeline-border-color);
    bottom: 0px;
    left: 0px;
}
.header-area .properties-area {
    border-bottom: 1px solid var(--scenejs-timeline-border-color);
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
    pointer-events: none;
    will-change: transform;
}
.top-area .duration {
    position: absolute;
    height: 2px;
    left: 0;
    bottom: 0px;
    background: #4fa;
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
  width: 300px;
  box-sizing: border-box;
  background: #333;
  border-right: 1px solid var(--scenejs-timeline-border-color);
}

.property {
    position: relative;
    height: 32px;
    line-height: 28px;
    box-sizing: border-box;
    white-space: nowrap;
    z-index: 1;
    font-size: 13px;
    font-weight: bold;
    color: #eee;
    display: flex;
    padding: 2px 0px;
}
.property.root .name {
    color: #4fa;
}
.property.option .name {
    color: #fa4;
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
    right: 40px;
    margin: auto;
    border-radius: 50%;
    border: 2px solid #fff;
    vertical-align: middle;
    display: none;
    margin-left: 10px;
    box-sizing: border-box;
}
.property:not(.option):hover .remove {
    display: block;
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
.root .keyframe-group {
    background: #4fa;
}
.keyframe-delay {
    height: calc(100% - 6px);
    background: #4af;
    opacity: 0.2;
}
`);
