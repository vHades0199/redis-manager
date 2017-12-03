import React from 'react';
import { render } from 'react-dom';

import View from '../containers/homeContainer';
import NavBar from '../containers/navbarContainer';

render(<View />, document.getElementById('react-root'));
render(<NavBar />, document.getElementById('navbarNav'));
