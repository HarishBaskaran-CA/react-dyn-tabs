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
            onclickTab: () => true,
            onmouseupTab: () => true,
            onmousedownCloseIcon: () => true,
            onclickCloseIcon: () => true,
            onmouseupCloseIcon: () => true,
            onChange: function ({ newState, oldState, changes, api }) { },
            onLoad: function ({ api }) { },
            onDestroy: function () { }
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
