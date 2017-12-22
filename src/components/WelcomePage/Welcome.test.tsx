import * as React from 'react';
import { shallow } from 'enzyme';
import Welcome from './Welcome';

describe('<Welcome />', () => {
  it('should render a <Welcome /> component', () => {
    const wrapper = shallow(<Welcome />);
    expect(wrapper.find('.welcome')).toHaveLength(1);
  });
});