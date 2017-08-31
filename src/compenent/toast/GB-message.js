// GB-Message.js
// (c) 2016-2016 givebest(givenlovs@msn.com)

/**
* GBMessage
* @class gbmsg
* @see https://github.com/givebest/gb-message
* @author givenlovs@msn.com
**/

/*
使用：
gbmsg.success('恭喜', '您的提供已经成功。');
gbmsg.failure('抱歉', '网络异常，请重试。');
gbmsg.info('警告', '您确定要删除这个吗？');
gbmsg.waitting('加载中，请稍候。');
gbmsg.loading('加载中...');
gbmsg.loading();
gbmsg.frown('很遗憾', '亲未能抽中大奖');
gbmsg.smile('恭喜', '小手一点，大奖到手');
*/

require('./gb-message.less');

(function (root, factory) {
  'use strict';

  // @see https://github.com/umdjs/umd
  // @see https://github.com/ruyadorno/generator-umd  
  if (typeof module === "object" && typeof module.exports === "object") {
    // @see https://github.com/mzabriskie/axios/blob/master/dist/axios.js
    // @see https://github.com/jquery/jquery/blob/master/src/wrapper.js
    // Node. Does not work with strict CommonJS, but only CommonJs-like
    // environments that support module.exports, like Node.
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function () {
      return (root.returnExportsGlobal = factory());
    });
  } else {
    // Browser globals ( root is window )
    root.gbmsg = factory();
  }
}(this, function () {

  var domBody = document.body,
    overlay,   // 遮罩层
    dialog,    // 信息层
    hideTimeoutId = undefined,
    timeoutId = undefined;

  function init(){
    var eleDiv = document.createElement('div');
    eleDiv.id = 'GBMsg';
    eleDiv.className = 'gbmsg-overlay';
    eleDiv.innerHTML = '<div class="gbmsg-dialog"></div>';
    domBody.appendChild(eleDiv);

    overlay = document.getElementById('GBMsg');
    dialog = overlay.firstElementChild || overlay.children[0];
  }

  function showDialog(title, msg, opts){
    var _this = this,
      title = title,
      msg = msg,
      opts = opts || {},
      optsTime = opts.timeout || 1,
      html = [],
      htmlContainer = '',
      iconClass = opts.iconClass;

    if (iconClass) {
      html.push('<div class="gbmsg-dialog-icon">');
      html.push('<i class="' + iconClass + '"></i>');
      html.push('</div>');
    }

    // msg为空，移除title，msg展示title内容
    /* !!msg ?
      html.push('<div class="gbmsg-dialog-container"><h5 class="gbmsg-dialog-title">' + title + '</h5>') :
      msg = title;*/
    if(!!msg){
      html.push('<div class="gbmsg-dialog-container">');
      html.push('<h5 class="gbmsg-dialog-title">' + title + '</h5>')
    }else{
      msg = title;
      htmlContainer = '<div class="gbmsg-dialog-container">';
    }

    // msg依然为空，移除msg，只展示icon
    !!msg ?
      html.push( htmlContainer + '<div class="gbmsg-dialog-content">' + msg + '</div>') :
      '';

    html.push('</div></div>');

    dialog.innerHTML = html.join('');
    overlay.style.display = 'block';


    // @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearTimeout
    if(!!optsTime && optsTime < 100){
      timeoutId && clearTimeout(timeoutId);
      timeoutId = setTimeout(function(){
        // hide();
        overlay.style.display = 'none';
        timeoutId = undefined;
      }, optsTime * 1500);
    }
  }

  function hideDialog(){
    var hideTimeoutId = undefined;
    addClass(overlay, 'gbmsg-fadeOut');

    clearTimeout && clearTimeout(timeoutId);
    hideTimeoutId = setTimeout(function(){
      removeClass(overlay, 'gbmsg-fadeOut');
      overlay.style.display = 'none';
      clearTimeout = undefined;
    }, 400);
  }

  // success
  function success(title, msg){
    showDialog(title, msg, {
      'iconClass': 'icono-checkCircle'
    });
  }

  // failure
  function failure(title, msg){
    showDialog(title, msg, {
      'iconClass': 'icono-crossCircle'
    });
  }

  // info
  function info(title, msg){
    showDialog(title, msg, {
      'iconClass': 'icono-exclamationCircle'
    });
  }

  // waitting
  function waitting(title, msg){
    showDialog(title, msg, {
      'iconClass': 'icono-clock',
      'timeout': 100
    });
  }

  // loading
  function loading(title, msg){
    showDialog(title, msg, {
      'iconClass': 'icono-reset',
      'timeout': 100
    });
  }

  // frown
  function frown(title, msg){
    showDialog(title, msg, {
      'iconClass': 'icono-frown'
    });
  }

  // smile
  function smile(title, msg){
    showDialog(title, msg, {
      'iconClass': 'icono-smile'
    });
  }

  // no icon
  function noicon (title, msg) {
    showDialog(title, msg);
  }

  // hide
  function hide(){
    timeoutId && clearTimeout(timeoutId);
    overlay.style.display = 'none';
    timeoutId = undefined;
  }

  /*
    classList (@see https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
    support: http://caniuse.com/#search=classList
    so: 以下 hasClass/addClass/removeClass 仅满足此处需求
  */

  // hasClass
  function hasClass(ele, name){
    if(!ele || !name) return;
    return ele.classList.contains(name);
  }

  // addClass
  function addClass(ele, name){
    if(!ele || !name) return;
    ele.classList.add(name);
  }

  // removeClass
  function removeClass(ele, name){
    if(!ele || !name) return;
    ele.classList.remove(name);
  }


  // 初始化
  init();

  return {
    success: success,
    failure: failure,
    info: info,
    waitting: waitting,
    loading: loading,
    frown: frown,
    smile: smile,
    hide: hide,
    show: noicon
  }
}));
