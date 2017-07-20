/**
* GB-respond.js
* @see https://github.com/givebest/GB-html5-respond
* @author givenlovs[at]msn.com
* @(c) 2017
**/
;(function (win) {
  var doc = win.document,
    docEl = doc.documentElement,
    defaultFontSize = parseFloat(window.getComputedStyle(docEl, null).getPropertyValue('font-size') || 16),
    designWidth = 750 / 2,   // 设计稿宽度
    maxWidth = 1280 / 2;   // 最大支持宽度（无限制会导致 Pad 等大屏设备展示内容过少、图像失真等）

  win.addEventListener('resize', function() {
    throttle(refreshRem);
  }, false);

  // @see https://github.com/amfe/lib-flexible/blob/master/src/flexible.js
  win.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      throttle(refreshRem);
    }
  }, false);

  // 初始化
  refreshRem();

  /**
   * 计算字体大小
   * @return {[type]} [description]
   */
  function refreshRem () {
    var width = parseFloat(docEl.getBoundingClientRect().width || docEl.clientWidth),
      fontSize = 100 / 2 / designWidth * (width > maxWidth ? maxWidth : width),
      // Android webView 会被设备字体大小(默认为16px)影响 @see https://github.com/hbxeagle/rem 
      finalFontSize = (defaultFontSize !== 16) ? (fontSize * (16 / defaultFontSize)) : fontSize;
      console.log(finalFontSize)
      docEl.style.fontSize = finalFontSize + 'px';
  }

  /**
   * 节流函数
   * @param  {[type]} method  [description]
   * @param  {[type]} context [description]
   * @return {[type]}         [description]
   */
  function throttle (method, context) {
    clearTimeout(method.tId);
    method.tId = setTimeout (function () {
      method.call(context);
    }, 100);
  }
})(window);