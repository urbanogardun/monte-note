import * as React from 'react';
import * as enzyme from 'enzyme';
import NewNotebookButton from './index';

it('renders the button', () => {
  const button = enzyme.shallow(<NewNotebookButton />);
  expect(button.find('.add-notebook').text()).toEqual('Add Notebook');
});
