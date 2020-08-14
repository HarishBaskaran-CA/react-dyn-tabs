const getDefaultTabObj = function () {
    return {
        title: "unkow",
        tooltip: "",
        panelComponent: null,
        closable: true,
        iconClass: "",
        disable: false
    };
};
const getSetting = function () {
    return {
        defaultCssClasses: {
            tab: 'reactHookTab-default-tab',
            tabTitle: 'tabTitle',
            activeTab: 'reactHookTab-active-tab',
            hoverTab: 'reactHookTab-hover-tab',
            tabList: 'reactHookTab-default-tabList',
            closeIcon: 'reactHookTab-default-closeIcon',
            hoverCloseIcon: 'reactHookTab-hover-closeIcon',
            panel: 'reactHookTab-default-panel',
            activePanel: 'reactHookTab-active-panel',
            panelList: 'reactHookTab-default-panelList',
            disable: 'disable',
            ltr: 'ltr',
            rtl: 'rtl'
        },
        defaultEvents: {
            onmousedownTab: () => { return true; },
            onclickTab: () => { },
            onmouseupTab: () => { },
            onmousedownCloseIcon: () => { },
            onclickCloseIcon: () => { },
            onmouseupCloseIcon: () => { },

            beforeSwitchTab: function (e, tabId) { return true; },
            afterSwitchTab: function ({ tabId, panelId }) { },
            beforeOpenTab: (tabID) => { },
            afterOpenTab: (tab) => { },
            beforeCloseTab: function (e, tabId) { return true; },
            afterCloseTab: (tab) => { },

            allTabsDidMount: () => { },
            allTabsDidUpdate: (param) => { debugger; },
            allTabsWillUnMount: () => { }
        },
        getDefaultTabObj,
        eventModes: ['mousedown', 'mouseenter', 'click', 'mouseup'],
        defaultSwitchTabEventMode: 'click',
        defaultCloseTabEventMode: 'click',
        directions: ['ltr', 'rtl'],
        defaultDirection: 'ltr'
    };
};
export default getSetting;
