import * as React from 'react';
import * as enzyme from 'enzyme';
import NewNotebookButton from './NewNotebookButton';

const wrapper = enzyme.shallow(<NewNotebookButton goToRoute={() => { return; }} notebooks={[]} />);
const instance = wrapper.instance() as NewNotebookButton; // explicitly declare type

it('renders the button', () => {
  const button = enzyme.shallow(<NewNotebookButton goToRoute={() => { return; }} notebooks={[]} />);
  expect(button.find('li.sidebar-link').text().trim()).toEqual('New Notebook');
});

it('renders the input on button click', () => {
  let input = enzyme.mount(<NewNotebookButton goToRoute={() => { return; }} notebooks={[]} />);
  input.find('.add-notebook').simulate('submit');
  expect(input.find('.hidden').exists()).toEqual(true);
});

it('resets component state when input field gets out of focus', () => {
  wrapper.setState({inputValue: 'test-notebook'});
  instance.handleFocusOut();
  expect(wrapper.state('inputValue')).toEqual('');
});

it('strips leading and trailing whitespace from input field', () => {
  expect(instance.prepareNotebook(' testing-notebook     ')).toEqual('testing-notebook');
});
