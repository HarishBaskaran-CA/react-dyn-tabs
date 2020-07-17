import React, { memo, useEffect } from "react";
import "./index.css";
import { ApiContext, ForceUpdateContext } from "../utils/context.js";
import { useCounter } from '../utils/helperHooks';
import helper from '../utils/helper';
import events from '../utils/events';
import TabTitle from './tabTitle';
const Tab = memo(
    function Tab(props) {
        React.useContext(ForceUpdateContext);
        const [isFirstCall] = useCounter()
            , { id, activeTabId } = props
            , api = React.useContext(ApiContext)
            , { data: { allTabs }, cssClasses: { tab: defaultClass, activeTab: activeClass, closeIcon, disable: disableClass } }
                = api.getMutableCurrentOptions()
            , tab = allTabs[id]
            , isActive = activeTabId === id
            , clkHandler = function (e) { api.eventHandlerFactory({ e, id }); }
            , basedOnIsActive = {
                tabClass: defaultClass,
                tabIndex: -1,
                ariaExpanded: false,
                ariaSelected: false
            };
        isActive && Object.assign(basedOnIsActive, {
            tabClass: defaultClass + ' ' + activeClass,
            tabIndex: 0,
            ariaExpanded: true,
            ariaSelected: true
        });
        tab.disable && (basedOnIsActive.tabClass += ' ' + disableClass);
        useEffect(() => {
            api.observable.publisher.trigger(events.tabDidMount, { id });
        }, [id]);
        useEffect(() => {
            return () => {
                api.observable.publisher.trigger(events.tabWillUnmount, { id });
            }
        });
        return (
            <li role='tab' id={helper.idTemplate.tab(id)} className={basedOnIsActive.tabClass}
                tabIndex={basedOnIsActive.tabIndex}
                aria-controls={helper.idTemplate.panel(id)} aria-labelledby={helper.idTemplate.ariaLabelledby(id)}
                aria-selected={basedOnIsActive.ariaSelected} aria-expanded={basedOnIsActive.ariaExpanded}
                onMouseUp={clkHandler} onMouseDown={clkHandler} onClick={clkHandler}>
                <TabTitle tabId={id} api={api.userProxy} isActive={isActive}></TabTitle>
                {
                    tab.closable ? (<span role='presentation' className={closeIcon}>
                        &times;
                    </span>) : null
                }
            </li>
        );
    },
    (oldProps, newProps) => {
        const { id, activeTabId: oldActiveId } = oldProps, { activeTabId: newActiveId } = newProps;
        return oldActiveId === newActiveId || (id !== oldActiveId && (id !== newActiveId));
    }
);
export default Tab;
