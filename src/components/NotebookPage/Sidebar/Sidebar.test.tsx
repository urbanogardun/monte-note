import * as React from 'react';
import * as enzyme from 'enzyme';
import Sidebar from './index';

const sidebar = enzyme.shallow(
<Sidebar 
    notebookName="test-notebook" 
    notes={['note-1']}
    noteContent={'<p>Test content</p>'}
    lastOpenedNote="note-1"
    updateNotes={() => { return; }}
    updateLastOpenedNote={() => { return; }}
    updateNoteContent={() => { return; }} 
/>
);
const instance = sidebar.instance() as Sidebar; // explicitly declare type

it('renders the sidebar', () => {
  expect(sidebar.find('.sidebar')).toHaveLength(1);
});

it('renders the input on button click', () => {
    sidebar.find('.add-note-sidebar').first().simulate('submit');
    expect(sidebar.find('.hidden').exists()).toEqual(true);
});

it('resets component state when input field gets out of focus', () => {
    sidebar.setState({inputValue: 'test-note'});
    instance.handleFocusOut();
    expect(sidebar.state('inputValue')).toEqual('');
});

it('strips leading and trailing whitespace from input field', () => {
    expect(instance.prepareNote(' testing-note     ')).toEqual('testing-note');
});