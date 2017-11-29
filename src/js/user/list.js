require('../../css/base.css');
require('../../css/common.less');

import template from '../commons/template';

var data = {
  title: '用户列表',
  list: [
    '001',
    '002',
    '003',
    '004',
    '005'
  ]
};

var html = template('user-list', data);
$('#wrapper').html(html);

console.log('user list', $);
