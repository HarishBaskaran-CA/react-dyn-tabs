import React, { memo, useEffect } from 'react';
import { ApiContext, StateContext } from '../utils/context.js';
import './index.css';
import Tab from '../tab/tab.js';
import { useCounter, useOldActiveId } from '../utils/helperHooks';
import events from '../utils/events';
const TabList = memo(function TabList(props) {
    const [isFirstCall] = useCounter()
        , { openTabsId, activeTabId } = React.useContext(StateContext)
        , { oldActiveId: oldSelectedTabId, newActiveId: newSelectedTabId, updateOldActiveId } = useOldActiveId(activeTabId)
        , api = React.useContext(ApiContext)
        , { cssClasses, cssClasses: { tabList: defaultClass }, direction } = api.getOptions(),
        publisher = api.observable.publisher;
    const className = defaultClass + ' ' + cssClasses[direction];
    useEffect(() => {
        isFirstCall || publisher.trigger(events.tabListDidUpdateByActiveTabId, { oldSelectedTabId, newSelectedTabId });
        updateOldActiveId();
    }, [activeTabId]);
    useEffect(() => {
        isFirstCall || publisher.trigger(events.tabListDidUpdate, { openTabsId: [...openTabsId], activeTabId });
    });
    return (
        <ul className={className} role='tablist'>
            {openTabsId.map(id => <Tab key={id} id={id} activeTabId={activeTabId}></Tab>)}
        </ul>
    )
}, () => true);
export default TabList;