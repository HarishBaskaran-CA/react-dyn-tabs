import React from "react"
import { unmountComponentAtNode } from "react-dom";
import Panel from "./panel.js";
import renderer from 'react-test-renderer';
import Api from '../utils/api/api.js';
let container = document.createElement("div"), realUseContext;
const getDefaultApi = () => ({
    tabs: [
        { id: '1', title: 'tab1', panelComponent: props => <p>{props.api.getTab(props.id).title + ' panel'}</p> },
        { id: '2', title: 'tab2', disable: true, panelComponent: props => <p>{props.api.getTab(props.id).title + ' panel'}</p> },
        { id: '3', title: 'tab3' },
        {
            id: '4', title: 'tab4', panelComponent: props => {
                let panelContent = 'panel 4 is ';
                props.isSelected || (panelContent = panelContent + 'not ');
                panelContent = panelContent + 'selected';
                return (<div class='custom-panel'>{panelContent}</div>);
            }
        },
        { id: '5', title: 'tab5', panelComponent: <span>panel 6</span> }
    ]
});
const setMockUseContext = (op = {}) => {
    const defaultOp = getDefaultApi();
    const instance = new (Api)({ options: Object.assign({}, defaultOp, op) });
    React.useContext = jest.fn(() => instance);
};
beforeAll(() => {
    document.body.appendChild(container);
    realUseContext = React.useContext;
});
beforeEach(() => {
});
afterEach(() => {
    unmountComponentAtNode(container);
    container.innerHTML = "";
    React.useContext = realUseContext;
});
afterAll(() => {
    document.body.removeChild(container);
    container = null;
});
describe('panel structure : ', () => {
    test('default options', () => {
        setMockUseContext();
        const tree = renderer
            .create(<div>
                <Panel id="1" selectedTabID='1'  ></Panel>
                <Panel id="2" selectedTabID='1'  ></Panel>
                <Panel id="3" selectedTabID='1'  ></Panel>
                <Panel id="4" selectedTabID='1'  ></Panel>
                <Panel id="5" selectedTabID='1'  ></Panel>
            </div>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('rtl and none accessibility options', () => {
        setMockUseContext({ direction: 'rtl', accessibility: false });
        const tree = renderer
            .create(<div>
                <Panel id="1" selectedTabID='1'  ></Panel>
                <Panel id="2" selectedTabID='1'  ></Panel>
                <Panel id="3" selectedTabID='1'  ></Panel>
                <Panel id="4" selectedTabID='1'  ></Panel>
                <Panel id="5" selectedTabID='1'  ></Panel>
            </div>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('custom panelComponent', () => {
        setMockUseContext({
            tabs: [{ id: '1', title: 'tab1' }, { id: '2', title: 'tab2' }],
            defaultPanelComponent: props => {
                const panelContent = props.api.getTab(props.id).title + ' panel';
                const className = props.isSelected ? 'custom-panel-selected' : 'custom-panel-none-selected';
                return <span className={className}>{panelContent}</span>;
            }
        });
        const tree = renderer
            .create(<div>
                <Panel id="1" selectedTabID='1'></Panel>
                <Panel id="2" selectedTabID='1'></Panel>
            </div>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('custom panelComponent with rtl and none accessibility options', () => {
        setMockUseContext({
            tabs: [{ id: '1', title: 'tab1' }, { id: '2', title: 'tab2' }],
            direction: 'rtl', accessibility: false,
            defaultPanelComponent: props => {
                const panelContent = props.api.getTab(props.id).title + ' panel';
                const className = props.isSelected ? 'custom-panel-selected' : 'custom-panel-none-selected';
                return <span className={className}>{panelContent}</span>;
            }
        });
        const tree = renderer
            .create(<div>
                <Panel id="1" selectedTabID='1'></Panel>
                <Panel id="2" selectedTabID='1'></Panel>
            </div>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


