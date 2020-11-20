import React from 'react';
import { render } from 'enzyme';
import { App } from './App';

/** TODO: Add tests once MVP is written */
test('Renders fine', () => {
  const component = render(<App />);
  expect(component).toMatchSnapshot();
});
