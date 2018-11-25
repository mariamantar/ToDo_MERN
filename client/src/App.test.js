import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//  shallow rendering to render a mock Dom
import { shallow, mount, render } from 'enzyme';



describe('div container', () => {
  it('div width is always 400', () => {
  expect(shallow(<App />).find('#style').width)toEqual(400)
})
})
