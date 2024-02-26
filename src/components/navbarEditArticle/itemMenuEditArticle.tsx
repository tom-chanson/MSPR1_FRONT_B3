import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "@mui/material/Tooltip";

export default function ItemMenuEditArticle(props: { tooltip?: string, actionOnClick: () => void, icon: IconDefinition }) {

    return (
        <li className='navbar-item'>
            {props.tooltip && 
            <Tooltip title={props.tooltip} arrow>
                <div onClick={props.actionOnClick}>
                    <FontAwesomeIcon icon={props.icon} />
                </div>
            </Tooltip>}
            {!props.tooltip && 
            <div onClick={props.actionOnClick}>
                <FontAwesomeIcon icon={props.icon} />
            </div>}
        </li>
    )
}