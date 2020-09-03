const helper = {};
helper.idTemplate = {
    tab: id => `tab_${id}`,
    panel: id => `panel_${id}`,
    ariaLabelledby: id => `tabPanel_${id}`,
    closeIcon: id => `closeIcon_${id}`
};
helper.checkArrIndex = (index, arrLength) => index >= 0 && (index < arrLength);
helper.getInstance = function (Fn) { new (Function.prototype.bind.apply(Fn, arguments)); };
helper.objDefineNoneEnumerableProps = (function () {
    const { defineProperties, entries } = Object;
    return (obj, props = {}) =>
        defineProperties(obj, entries(props).reduce((acc, [key, value]) => {
            acc[key] = { writable: true, value };
            return acc;
        }, {}))
})();
helper.resolve = result => Promise.resolve(result);
helper.getCopyState = function (state) {
    const newState = { ...state };
    newState.openTabsId = [...newState.openTabsId];
    return newState;
};
helper.getArraysDiff = function (arr1, arr2) {
    const arr1Copy = [...arr1], arr2Copy = [...arr2];
    arr1.map(item => {
        const i = arr2.indexOf(item);
        if (i >= 0) {
            arr1Copy.splice(i, 1);
            arr2Copy.splice(i, 1);
        }
    });
    return [arr1Copy, arr2Copy];
};
export default helper;