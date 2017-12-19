import * as React from 'react';
import * as enzyme from 'enzyme';
import NewNotebook from './NewNotebook';

it('renders the button', () => {
  const newNotebook = enzyme.shallow(<NewNotebook />);
  expect(newNotebook.find('.add-notebook')).toHaveLength(1);
});
