import DefaultOptions from './defaultOptions.js';
import DefaultTabInnerComponent from '../../../tab/defaulTabInner.js';
describe('DefaultOptions.prototype.getOptions : ', () => {
  test('returned options should have a correct structure and format', () => {
    const expected = {
      tabs: [],
      selectedTabID: '',
      beforeSelect: expect.any(Function),
      beforeClose: expect.any(Function),
      onOpen: expect.any(Function),
      onClose: expect.any(Function),
      onSelect: expect.any(Function),
      onChange: expect.any(Function),
      onLoad: expect.any(Function),
      onDestroy: expect.any(Function),
      onInit: expect.any(Function),
      accessibility: true,
      defaultPanelComponent: expect.any(Function),
      direction: 'ltr',
      tabComponent: expect.any(Function),
    };
    const received = new DefaultOptions(DefaultTabInnerComponent).getOptions();
    expect(received).toEqual(expected);
  });
});
