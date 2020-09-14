require('@/css/base.css');
require('@/css/common.less');
require('@/css/test.css')
require('./demo.less')

console.log('Demo');

import Dialog from '@/component/dialog/GB-dialog';
import Toast from '@/component/toast/GB-message.js';

document.getElementById('btnDialog').addEventListener('click', function () {
    Dialog.show({
      title: '标题',
      content: '这里是弹出层内容'
    });
  }, false);

  $('#btnToast').on('click', function () {
    Toast.show('Toast');
  });

// Arrow FN
var c = x => x * x;
console.log(c(3));
console.log(c(4))

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

