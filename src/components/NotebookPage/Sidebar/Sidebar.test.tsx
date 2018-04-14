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
    noteToRename={{notebook: 'test', note: 'test-note'}}
/>
);
const instance = sidebar.instance() as Sidebar; // explicitly declare type

it('renders the sidebar', () => {
  expect(sidebar.find('.sidebar')).toHaveLength(1);
});

it('types new note name for renaming', () => {
    let newName = 'new-note-name'
    sidebar.setState({inputValue: newName});
    expect(sidebar.state('inputValue')).toEqual(newName);
});

it('strips leading and trailing whitespace from input field', () => {
    expect(instance.prepareNote(' testing-note     ')).toEqual('testing-note');
});