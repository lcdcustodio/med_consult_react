import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import TextValue from '../src/components/TextValue';

it('renders correctly', () => {
  const textValue = renderer.create(<TextValue />).toJSON();
  expect(textValue).toMatchSnapshot();
});

it('renders correctly', () => {
  const textValue = renderer.create(<TextValue />).toJSON();
  expect(textValue).toMatchSnapshot();
});
