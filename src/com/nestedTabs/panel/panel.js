import React, { useContext, memo } from 'react';
import './index.css';
import { ApiContext, StateContext } from '../utils/context.js';
const Panel = memo(function Panel(props) {
    const { id } = props;
    const { activeTabId } = useContext(StateContext);
    const { renderedComponent, classNames: { panel: { defaultClass, activeClass } } } =
        useContext(ApiContext).getOptions();
    return (
        <div
            id={`panel_${id}`}
            className={`nestedTab_panel${defaultClass}${activeTabId == id ? ` active${activeClass}` : ''}`}
        >
            {renderedComponent.getById(id)}
        </div>
    )
}, () => true);
export default Panel;
