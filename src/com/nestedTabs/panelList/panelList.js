import React, { useEffect, memo } from 'react';
import './index.css';
import Panel from '../panel/panel.js';
import { ApiContext, StateContext } from '../utils/context.js';
import { useCounter, useOldActiveId } from '../utils/helperHooks';
import events from '../utils/events';
const PanelList = memo(function PanelList(props) {
    const [isFirstCall] = useCounter()
        , { openTabsId, activeTabId } = React.useContext(StateContext)
        , { oldActiveId, newActiveId, updateOldActiveId } = useOldActiveId(activeTabId)
        , api = React.useContext(ApiContext)
        , { cssClasses, cssClasses: { panelList: defaultClass }, direction } = api.getMutableCurrentOptions()
        , publisher = api.observable.publisher
        , className = defaultClass + ' ' + cssClasses[direction];
    useEffect(() => {
        isFirstCall || publisher.trigger(events.panelListDidUpdateByActiveTabId, { oldActiveId, newActiveId });
        updateOldActiveId();
    }, [activeTabId]);
    useEffect(() => {
        isFirstCall || publisher.trigger(events.panelListUpdate);
    });
    return (
        <div className={className}>
            {openTabsId.map(id =>
                <Panel key={id} id={id} activeTabId={activeTabId}></Panel>
            )}
        </div>
    )
}, () => true);

export default PanelList;