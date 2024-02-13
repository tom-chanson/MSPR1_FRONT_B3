import Tooltip from "@mui/material/Tooltip";

export default function ItemSubmenuEditArticle(props: {
    actionOnClick: () => void,
    tooltip?: string,
    content: string|JSX.Element,
    })
    {
    
    return (
        <li className='navbar-item'>
            {props.tooltip && 
            <Tooltip title={props.tooltip} arrow placement="right">
                <div onClick={props.actionOnClick}>
                    {props.content}
                </div>
            </Tooltip>}
            {!props.tooltip && 
            <div onClick={props.actionOnClick}>
                {props.content}
            </div>}
        </li>
    )
}
