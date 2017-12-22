import * as React from 'react';
import * as enzyme from 'enzyme';
import Button from './index';

it('renders the button', () => {
  const button = enzyme.shallow(<Button />);
  expect(button.find('.add-notebook').text()).toEqual('Add Notebook');
});
