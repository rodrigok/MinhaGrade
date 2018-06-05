import './Grade.html';


import React from 'react';
import { render } from 'react-dom';

import App from '../app';

Template.Grade.onRendered(() => {
	render(<App />, document.getElementById('render-grade'));
});
