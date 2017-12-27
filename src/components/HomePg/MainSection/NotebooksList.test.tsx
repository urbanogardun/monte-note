import * as React from 'react';
import * as enzyme from 'enzyme';
import NotebooksList from './NotebooksList';

const wrapper = enzyme.shallow(<NotebooksList />);
const instance = wrapper.instance() as NotebooksList; // explicitly declare type

it('renders list of notebooks', () => {
  expect(wrapper.find('.notebooks').text()).toEqual('Add Notebook');
});
