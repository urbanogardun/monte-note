import * as React from 'react';
import * as enzyme from 'enzyme';
// import * as sinon from 'sinon';
import NewNotebookButton from './NewNotebookButton';

it('renders the button', () => {
  const button = enzyme.shallow(<NewNotebookButton />);
  expect(button.find('.add-notebook').text()).toEqual('Add Notebook');
});

it('renders the input', () => {
  const button = enzyme.shallow(<NewNotebookButton />);
  button.find('.add-notebook').simulate('click');
  expect(button.find('.hidden').exists()).toEqual(true);
});
