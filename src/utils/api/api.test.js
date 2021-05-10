import API from './api.js';
beforeEach(() => {

});
describe('user api : ', () => {
    test('list all available props for consumer', () => {
        const obj = new (API)();
        const userApi = ['getTab', 'setTab', 'off', 'on', 'one', 'getOption', 'setOption', 'getCopyPerviousData', 'getCopyData',
            'isSelected', 'isOpen', 'select', 'open', 'close', 'refresh'];
        expect(Object.keys(obj.userProxy).length === userApi.length).toBe(true);
        let _isEqual = true;
        userApi.map((value) => {
            if (!obj.userProxy.hasOwnProperty(value)) {
                _isEqual = false;
            }
        });
        expect(_isEqual).toBe(true);
    });
    test('calling Api constructor with option parameter correctly', () => {
        const obj1 = new (API)(), obj2 = new (API)({ mockProp: 1 }), obj3 = new (API)({ options: { mockProp: 1 } });
        expect(obj1.helper != undefined).toBe(true);
        expect(!obj2.getOption('mockProp') == true).toBe(true);
        expect(obj3.getOption('mockProp') === 1).toBe(true);
    });
});


