import * as React from 'react';
import * as enzyme from 'enzyme';
import Modal from './index';

it('renders add notebook modal', () => {
  const newNotebook = enzyme.shallow(<Modal />);
  expect(newNotebook.find('.notebook-name').text()).toEqual('Notebook Name:');
});
