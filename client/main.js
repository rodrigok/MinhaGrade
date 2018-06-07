import 'antd/dist/antd.css';
import './style.css';

import '../imports/lib/router';

Meteor.subscribe('Grade');
Meteor.subscribe('Calendar');
Meteor.subscribe('userGradeInfo');
