import * as React from "react";
import { prefix } from "../../utils";
import Menu from "./Menu";
import styler from "react-css-styler";
import { MENUS_CSS } from "../../consts";
import CursorIcon from "./CursorIcon";
import AutoCursorIcon from "./AutoCursorIcon";
import TextIcon from "./TextIcon";
import PolyIcon from "./PolyIcon";
import OvalIcon from "./OvalIcon";
import RectIcon from "./RectIcon";
import StarIcon from "./StarIcon";

const MenusElement = styler("div", MENUS_CSS);

export default class Menus extends React.Component<{
}> {
    public render() {
        return (
            <MenusElement className={prefix("menus")}>
                <Menu icon={CursorIcon} selected={true} />
                <Menu icon={AutoCursorIcon} />
                <Menu icon={TextIcon} />
                <Menu icon={RectIcon} />
                <Menu icon={PolyIcon} />
                <Menu icon={StarIcon} />
                <Menu icon={OvalIcon} />
            </MenusElement>);
    }
}
