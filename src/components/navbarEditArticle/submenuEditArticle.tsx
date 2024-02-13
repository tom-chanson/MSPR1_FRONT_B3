import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import Tooltip from "@mui/material/Tooltip";

export default function SubmenuEditArticle(
    props: {
        icon: IconDefinition,
        actionOnMouseEnter: (subMenu: React.RefObject<HTMLUListElement>) => void,
        actionOnMouseLeave: (subMenu: React.RefObject<HTMLUListElement>) => void,
        actionOnClickSubmenu: (subMenu: React.RefObject<HTMLUListElement>) => void,
        listSubmenu: JSX.Element[],
        tooltip?: string
    }
) {
    const submenuRef = useRef<HTMLUListElement>(null);
    return(
    <li className='navbar-item' onMouseLeave={() => props.actionOnMouseLeave(submenuRef)} onMouseEnter={() => props.actionOnMouseEnter(submenuRef)}>
        {props.tooltip &&
        <Tooltip title={props.tooltip} arrow>
            <div>
                <FontAwesomeIcon icon={props.icon} />
            </div>
        </Tooltip>}
        {!props.tooltip &&
        <div>
            <FontAwesomeIcon icon={props.icon} />
        </div>}
        <ul className='navbar-submenu' ref={submenuRef} onClick={() => props.actionOnClickSubmenu(submenuRef)}>
            {props.listSubmenu}
        </ul>
    </li>
    )
}