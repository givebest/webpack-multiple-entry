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
    '005',
    '006'
  ]
};

var html = template('user-list', data);
document.getElementById('wrapper').innerHTML = html;

console.log('user list');
