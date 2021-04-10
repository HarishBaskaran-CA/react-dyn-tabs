import Helper from '../../helper.js';
const { throwMissingParam: missingParamEr } = Helper;
function OptionManager(getDeps, { options }) {
    const { globalDefaultOptions } = getDeps();
    this._defaultOptions = globalDefaultOptions;
    this._validateOptions(options);
    this.options = Object.assign({}, this._defaultOptions, options);
    this._setSetting();
};
OptionManager.prototype.getOption = function (OptionName) {
    return this.options[OptionName];
};
OptionManager.prototype.setOption = function (name = missingParamEr('setOption'), value = missingParamEr('setOption')) {
    if (name.toUpperCase() === ('SELECTEDTABID' || 'OPENTABIDS' || 'DATA'))
        return this;
    if (this._defaultOptions.hasOwnProperty(name))
        this.options[name] = value;
    return this;
};
OptionManager.prototype._validateOptions = function (options) {
    if (Object.prototype.toString.call(options) !== '[object Object]')
        throw 'Invalid argument in "useDynamicTabs" function. Argument must be type of an object';
    return this;
};
OptionManager.prototype._setSetting = function () {
    this.setting = {
        tabClass: 'rc-dyn-tabs-tab',
        titleClass: 'rc-dyn-tabs-title',
        iconClass: 'rc-dyn-tabs-icon',
        selectedClass: 'rc-dyn-tabs-selected',
        hoverClass: 'rc-dyn-tabs-hover',
        tablistClass: 'rc-dyn-tabs-tablist',
        closeClass: 'rc-dyn-tabs-close',
        panelClass: 'rc-dyn-tabs-panel',
        panellistClass: 'rc-dyn-tabs-panellist',
        disableClass: 'rc-dyn-tabs-disable',
        ltrClass: 'rc-dyn-tabs-ltr',
        rtlClass: 'rc-dyn-tabs-rtl',
        panelIdTemplate: id => `rc-dyn-tabs-p-${id}`,
        ariaLabelledbyIdTemplate: id => `rc-dyn-tabs-l-${id}`
    };
    return this;
};
export default OptionManager;