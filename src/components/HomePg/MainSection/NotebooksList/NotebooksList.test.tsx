import * as React from 'react';
import * as enzyme from 'enzyme';
import NotebooksList from './NotebooksList';

const wrapper = enzyme.shallow(<NotebooksList notebooks={['book-1', 'book-2']} />);

it('renders list of notebooks', () => {
  expect(wrapper.find('ul').children().length).toEqual(2);
});
