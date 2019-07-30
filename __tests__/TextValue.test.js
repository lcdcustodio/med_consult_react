import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import TextValue from '../src/components/TextValue';

describe('my beverage', () => {

	it('Deve renderizar TextValue corretamente', () => {
		const textValue = renderer.create(<TextValue />).toJSON();
		expect(textValue).toMatchSnapshot();
	});

});