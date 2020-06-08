function optionManager(options = {}) {
    this.currentOptions = {};
    this.defaultClasses = {
        tab: 'rdlt-default-tab',
        activeTab: 'rdlt-active-tab',
        hoverTab: 'rdlt-hover-tab',
        tabList: 'rdlt-default-tabList',
        closeIcon: 'rdlt-default-closeIcon',
        hoverCloseIcon: 'rdlt-hover-closeIcon',
        panel: 'rdlt-default-panel',
        activePanel: 'rdlt-active-panel',
        panelList: 'rdlt-default-panelList'
    };
    this.initialOptions = options || {};
    options && this.setNewOptions(options);
};
optionManager.prototype.reset = function () { this.currentOptions = this.getInitialOptionsCopy(); return this; };
optionManager.prototype.getInitialOptionsCopy = function () { return Object.assign(this.getDefaultOptions(), this.initialOptions); };
optionManager.prototype.getCurrentOptionsCopy = function () { return Object.assign(this.getDefaultOptions(), this.currentOptions); };
optionManager.prototype.getMutableCurrentOptions = function () { return this.currentOptions; };
optionManager.prototype.getData = function () {
    const { data: { activeTabId, openTabsId }, } = this.currentOptions;
    return { activeTabId, openTabsId };
};
optionManager.prototype.setNewOptions = function (newOptions) {
    // Object.keys(this.initialOptions).length ||
    //     (this.initialOptions = Object.assign(this.getDefaultOptions(), newOptions));
    this.currentOptions = Object.assign(this.getDefaultOptions(), newOptions);
    return this;

};
optionManager.prototype.getActiveTab = function () {
    const { data, data: { activeTabId } } = this.currentOptions;
    let panelComponent = null;
    if (activeTabId >= 0) {
        if (!data.allTabs.hasOwnProperty(activeTabId))
            throw new Error('Invalid activeTabId! There is not any corresponding data for given activeTabId');
        panelComponent = data.allTabs[activeTabId].panelComponent;
    }
    return { activeTabId, panelComponent };
};
optionManager.prototype.getDefaultOptions = (function () {
    const checkArrayType = (value, prop) => { if (value.constructor !== Array) throw `passed ${prop} property must be an Array`; };
    const checkObjectType = (value, prop) => { if ((typeof value !== 'object') || (value === null)) throw `type of the passed ${prop} property must be an object`; };
    return function () {
        let option = {}, activeTabEventMode, closeTabEventMode;
        const that = this,
            data = (function () {
                let data = {}
                return {
                    get() { return data; },
                    set(value) {
                        checkObjectType(value, 'option.data');
                        const reducer = function (acc, item) {
                            acc[item] = value[item];
                            return acc;
                        };
                        Object.keys(value).reduce(reducer, data);
                    }
                };
            })()
            , events = (function () {
                let events = {};
                return {
                    get() { return events; },
                    set(value) {
                        checkObjectType(value, 'option.events');
                        const reducer = function (acc, item) {
                            let ev = value[item];
                            if (typeof ev !== 'function')
                                throw `type of the passed option.events.${item} property must be a function`;
                            acc[item] = ev;
                            return acc;
                        };
                        Object.keys(value).reduce(reducer, events);
                    }
                };
            })()
            , classNames = (function () {
                let _classNames = {};
                return {
                    get() { return _classNames; },
                    set(obj) {
                        checkObjectType(obj, 'option.classNames');
                        const reducer = function (acc, key) {
                            let className = obj[key];
                            if (typeof className !== 'string')
                                throw `type of the passed option.classNames.${key} property must be a string`;
                            const defaultClass = that.defaultClasses[key];
                            if (defaultClass) {
                                className = className.trim();
                                if (className === defaultClass)
                                    acc[key] = className;
                                else
                                    acc[key] = className ? (defaultClass + ' ' + className) : defaultClass;
                            }
                            return acc;
                        };
                        Object.keys(obj).reduce(reducer, _classNames);
                    }
                };
            })();
        {
            let possibleValues = ['mousedown', 'mouseenter', 'click', 'mouseup'],
                _activeTabMode = 'click', _closeTabMode = 'click';
            const checkValue = value => {
                if (possibleValues.indexOf(value) == -1)
                    throw `can not set ${value} on closeTabEventMode. possible values are 'mousedown', 'mouseenter', 'click', 'mouseup'`;
                return value;
            };
            activeTabEventMode = {
                get() { return _activeTabMode; },
                set(value) { _activeTabMode = checkValue(value); }
            };
            closeTabEventMode = {
                get() { return _closeTabMode; },
                set(value) { _closeTabMode = checkValue(value); }
            };
        }
        Object.defineProperties(option, { data, events, classNames, activeTabEventMode, closeTabEventMode });
        Object.defineProperties(option.data, {
            allTabs: (function () {
                let allTabs = {};
                return {
                    get() { return allTabs; },
                    set(value) {
                        checkArrayType(value, 'option.data.allTabs');
                        const reducer = function (acc, item, i) {
                            if (!item.id) throw `option.data.allTabs[${i}].id must be a valid number and grater then zero`;
                            acc[item.id] = Object.assign({
                                id: "",
                                title: "unkow",
                                tooltip: "",
                                panelComponent: null,
                                closable: true,
                                iconClass: "",
                            }, item);
                            return acc;
                        };
                        value.reduce(reducer, allTabs);
                    }
                };
            })(),
            openTabsId: (function () {
                let _openTabsId = [];
                return {
                    get() { return _openTabsId; },
                    set(value) { checkArrayType(value); _openTabsId = value; }
                };
            })(),
            activeTabId: (function () {
                let _activeTabId = '';
                return {
                    get() { return _activeTabId; },
                    set(value) {
                        let valueType = typeof value;
                        if (!(valueType === 'string' || (valueType === 'number' && (value > 0))))
                            throw 'type of the passed option.data.activeTabId property must be a string or positive number';
                        _activeTabId = value;
                    }
                };
            })(),
        });
        option.events = {
            onmousedownTab: () => { },
            onclickTab: () => { },
            onmouseupTab: () => { },
            onmousedownTabCloseIcon: () => { },
            onclickTabCloseIcon: () => { },
            onmouseupTabCloseIcon: () => { },

            beforeActiveTab: function (e, tabId) { return true; },
            afterSwitchTab: function ({ tabId, panelId }) {
                console.log(`afterSwitchTab with tabId : ${tabId} and panelId : ${panelId}`);
            },
            beforeDeactiveTab: function () { return true; },
            afterDeactiveTab: () => { },

            tabDidMount: () => { },
            tabDidUpdate: () => { },
            tabWillUnMount: () => { },

            beforeCloseTab: function (e, tabId) { return true; },
            afterCloseTab: (tab) => { debugger; },

            allTabsDidMount: () => { },
            allTabsDidUpdate: () => { },
            allTabsWillUnMount: () => { },
            onSwitchTabs: () => { },
            onChangeOpenTabs: () => { },

            afterOpenTab: (tab) => { },
        };
        option.classNames = {
            tabList: "",
            panelList: "",
            tab: "",
            hoverTab: "",
            activeTab: "",
            closeIcon: "",
            hoverCloseIcon: "",
            panel: "",
            activePanel: "",
        };
        return option;
    };
})();
export default optionManager;