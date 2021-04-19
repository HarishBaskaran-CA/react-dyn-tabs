import Helper from '../helper.js';
const { throwMissingParam: missingParamEr, throwInvalidParam: invalidParamEr } = Helper;
export const apiConstructor = function (getDeps, param = { options: {} }) {
    const { optionsManager, helper, activedTabsHistory } = getDeps.call(this, param.options);
    helper.setNoneEnumProps(this, { optionsManager, helper, activedTabsHistory });
    this._setUserProxy()._subscribeSelectedTabsHistory()._subscribeCallbacksOptions();//._subscribeOnChange();
};
const _apiProps = {
    _setUserProxy: function () {
        const userProxy = {}, that = this;
        for (var prop in this)
            if (prop[0] !== '_' && prop !== 'constructor') {
                const propValue = this[prop];
                if (typeof propValue === 'function') {
                    userProxy[prop] = function () {
                        const result = propValue.apply(that, arguments);
                        return result === that ? userProxy : result;
                    };
                } else {
                    userProxy[prop] = propValue;
                }
            }
        this.userProxy = userProxy;
        return this;
    },
    _subscribeCallbacksOptions: function () {
        const op = this.optionsManager.options;
        Object.keys(this._publishers).map(eventName => {
            this.on(eventName, function () {
                op[eventName].apply(this, arguments);
            });
        });
        return this;
    },
    _subscribeSelectedTabsHistory: function () {
        this.on('onChange', ({ isSwitched, oldState }) => {
            isSwitched && this.activedTabsHistory.add(oldState.selectedTabID);
        });
        return this;
    },
    getOption: function (name) { return this.optionsManager.getOption(name); },
    setOption: function (name, value) { return this.optionsManager.setOption(name, value); },
    getCopyPerviousData: function () { return this.helper.getCopyState(this._perviousState); },
    getCopyData: function () { return this.helper.getCopyState(this.stateRef); },
    isSelected: function (id = missingParamEr('isSelected')) { return this.stateRef.selectedTabID == id; },
    isOpen: function (id = missingParamEr('isOpen')) { return this.stateRef.openTabIDs.indexOf(id) >= 0; },
    _getOnChangePromise: function () {
        return new (Promise)(resolve => { this.one('onChange', () => { resolve.call(this.userProxy); }); });
    },
    select: function (id = missingParamEr('select')) {
        const result = this._getOnChangePromise();
        this._select(id);
        return result;
    },
    _findTabIdForSwitching: (function () {
        const _findOpenedAndNoneDisableTabId = function (tabsIdArr, isRightToLeft) {
            return (this.helper.arrFilterUntilFirstValue(tabsIdArr, id => this.isOpen(id) && (!this.getTab(id).disable)
                && (!this.isSelected(id)), isRightToLeft) || '');
        }
            , _getPreSelectedTabId = function () {
                return _findOpenedAndNoneDisableTabId.call(this, [...this.activedTabsHistory.tabsId], true);
            }
            , _getPreSiblingTabId = function () {
                const data = this.stateRef, arr = data.openTabIDs;
                return _findOpenedAndNoneDisableTabId.call(this, arr.slice(0, arr.indexOf(data.selectedTabID)), true);
            }
            , _getNextSiblingTabId = function () {
                const data = this.stateRef, arr = data.openTabIDs;
                return _findOpenedAndNoneDisableTabId.call(this, arr.slice(arr.indexOf(data.selectedTabID) + 1));
            };
        return function () {
            let tabId = '';
            tabId = _getPreSelectedTabId.call(this);
            tabId = tabId || _getPreSiblingTabId.call(this);
            tabId = tabId || _getNextSiblingTabId.call(this);
            return tabId;
        };
    })(),
    setTab: function (id, newData) {
        this._setTab(id, newData, this.getOption('defaultPanelComponent'));
        return this;
    },
    open: function (tabObj = missingParamEr('open')) {
        const result = this._getOnChangePromise();
        this._open(tabObj.id);
        this._addTab(tabObj, { defaultPanelComponent: this.getOption('defaultPanelComponent') });
        return result;
    },
    __close: function (id) {
        const result = this._getOnChangePromise();
        this._close(id);
        this._removeTab(id);
        return result;
    },
    close: function (id = missingParamEr('close')) {
        if (this.isSelected(id)) {
            const _openTabsId = [...this.stateRef.openTabIDs];
            _openTabsId.splice(_openTabsId.indexOf(id), 1);
            this.select(this._findTabIdForSwitching());
            return this.__close(id);
        }
        else
            return this.__close(id);
    },
    refresh: function () {
        const result = this._getOnChangePromise();
        this._refresh();
        return result;
    }
};
Helper.setNoneEnumProps(_apiProps, {
    getInitialState: function () {
        if (!this._initialState) {
            const { selectedTabID, tabs, defaultPanelComponent } = this.optionsManager.options, openTabIDs = [];
            tabs.map(tab => {
                this._addTab(tab, { defaultPanelComponent });
                openTabIDs.push(tab.id);
            });
            this._initialState = { selectedTabID, openTabIDs };
        }
        return this._initialState;
    },
    onChange: function ({ newState, oldState, closedTabsId, openedTabsId, isSwitched }) {
        if (isSwitched || openedTabsId.length || closedTabsId.length) {
            this.trigger('onChange', this.userProxy, {
                currentData: { ...newState },
                perviousData: { ...oldState }
            });
            openedTabsId.length && this.trigger('onOpen', this.userProxy, openedTabsId);
            closedTabsId.length && this.trigger('onClose', this.userProxy, closedTabsId);
            isSwitched && this.trigger('onSelect', this.userProxy, {
                currentSelectedTabId: newState.selectedTabID,
                perviousSelectedTabId: oldState.selectedTabID
            });
        }
        return this;
    },
    eventHandlerFactory: function ({ e, id }) {
        const el = e.target, parentEl = el.parentElement, { closeClass, tabClass } = this.optionsManager.setting;
        if (el.className.includes(closeClass) && parentEl && parentEl.lastChild && (parentEl.lastChild == el)
            && parentEl.className.includes(tabClass)) {
            (this.getOption('beforeClose').call(this.userProxy, e, id) !== false) && this.close(id);
        }
        else {
            (this.getOption('beforeSelect').call(this.userProxy, e, id) !== false) && this.select(id);
        }
    }
});
export const apiProps = _apiProps;
