require('../../css/base.css');
require('../../css/common.less');
require('./index.less');

console.log('About us');

import Dialog from '../../compenent/dialog/GB-dialog';

document.getElementById('btnDialog').addEventListener('click', function () {
    Dialog.show({
      title: '标题',
      content: '这里是弹出层内容'
    });
  }, false);

// Arrow FN
var c = x => x * x;
console.log(c(3));
console.log(c(4))

