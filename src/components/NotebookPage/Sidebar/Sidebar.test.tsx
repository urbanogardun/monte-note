import * as React from 'react';
import * as enzyme from 'enzyme';
import Sidebar from './index';

const sidebar = enzyme.shallow(<Sidebar />);

it('renders the sidebar', () => {
  expect(sidebar.find('.sidebar')).toHaveLength(1);
});