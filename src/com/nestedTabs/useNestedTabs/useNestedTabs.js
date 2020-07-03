import React, { useReducer, useEffect, useMemo, useRef, useState } from "react";
import TabList from "../tabList/tabList";
import PanelList from "../panelList/panelList.js";
import { reducer } from "../utils/stateManagement";
import Api from '../utils/api';
import { ApiContext, StateContext, ForceUpdateContext } from "../utils/context.js";
function useNestedTabs(options) {
    const ref = useRef(null);
    if (ref.current === null)
        ref.current = { api: new (Api)({ options }) };
    const { current: { api } } = ref
        , _ref = ref.current
        , [state, dispatch] = useReducer(reducer, api.optionManager.getData());
    api.updateReducer(state, dispatch);
    const tabListEl = (
        <ApiContext.Provider value={_ref.api}>
            <StateContext.Provider value={state}>
                <ForceUpdateContext.Provider value={_ref.api.contextState}>
                    <TabList></TabList>
                </ForceUpdateContext.Provider>
            </StateContext.Provider>
        </ApiContext.Provider>
    )
        , panelListEl = (
            <ApiContext.Provider value={_ref.api}>
                <StateContext.Provider value={state}>
                    <ForceUpdateContext.Provider value={_ref.api.contextState}>
                        <PanelList></PanelList>
                    </ForceUpdateContext.Provider>
                </StateContext.Provider>
            </ApiContext.Provider>
        );
    return [tabListEl, panelListEl, ref.current.api];
}
export default useNestedTabs;
