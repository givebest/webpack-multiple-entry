/**
* GB-dialog.js
* @class gbDialog
* @see https://github.com/givebest/GB-dialog
* @author givenlovs@msn.com
* @(c) 2016
**/

require('./GB-dialog.less');


(function() {
  var domBody = document.body, $,
      overlayId = 'GB-overlay', dialogId = 'createDialog',
      overlay, dialog,
      dialogs,
      bodyScrollTop = 0,
      fnEvent = {};

  function init() {
      build();
  }

  /**
   * @param  {String} id
   * @return {Object} HTML element
  */
  $ = function(id) {
      return document.getElementById(id);
  };

  /**
   * Build dialog box
  */
  function build() {
    if ($(overlayId)) {
      var eleChild = document.createElement('div');
      eleChild.id = dialogId;
      eleChild.className = 'gb-dialog';
      $(overlayId).appendChild(eleChild);
    } else {
      var ele = document.createElement('section'),
          eleChild = document.createElement('div');
      ele.id = overlayId;
      ele.className = 'gb-overlay';
      ele.style.display = 'none';
      eleChild.id = dialogId;
      eleChild.className = 'gb-dialog';
      ele.appendChild(eleChild);
      domBody.appendChild(ele);
    }

    overlay = $(overlayId);
  }

  /**
   * 显示一个dialog
   * @param {Object} opts
  */
  function show(opts) {
      var opts = opts || {};

      // bodyScrollTop = domBody.scrollTop || domBody.style.top.replace(/\D|\s/g, '') || 0;
      bodyScrollTop = domBody.scrollTop || -parseFloat(domBody.style.top) || 0;

      if (opts.id) {
        dialog = $(opts.id);
      } else {
        dialog = overlay.lastElementChild || overlay.children[overlay.children.length];
        var btnConfirm = opts.btnConfirm === undefined ? '确定' : (opts.btnConfirm ? opts.btnConfirm : false),
          btnCancel = opts.btnCancel === undefined ? '取消' : (opts.btnCancel ? opts.btnCancel : false);

        var html = [];
        html.push('<div class="gb-dialog-head ' + (!opts.title && !opts.btnClose ? 'gb-hide' : '') + '">');
        if (opts.title) {
          html.push('<div class="gb-dialog-title">' + opts.title + '</div>');
        }
        if (opts.btnClose) {
          html.push('<a href="javascript:;" class="gb-dialog-close icono-cross">X</a>');
        }
        html.push('</div>');
        html.push('<div class="gb-dialog-container">');
        html.push(opts.content);
        html.push('</div>');
        html.push('<div class="gb-dialog-foot  gb-btn-group ' + (!btnConfirm && !btnCancel ? 'gb-hide' : '') + '">');
        if (btnConfirm) {
          html.push('<a href="javascript:;" class="gb-btn gb-dialog-confirm">' + btnConfirm + '</a>');
        }
        if (btnCancel) {
          html.push('<a href="javascript:;" class="gb-btn gb-dialog-cancel">' + btnCancel + '</a>');
        }
        html.push('</div>');
        dialog.innerHTML = html.join('');
      }

      // 隐藏所有 dialog
      dialogs = dialog.querySelectorAll('div.gb-dialog');
      for (var i = 0; i < dialogs.length; i++) {
          dialogs[i].style.display = 'none';
      }

      domBody.style.top = -bodyScrollTop + 'px';
      domBody.style.position = 'fixed';
      domBody.style.overflowY = 'hidden';


      dialog.style.display = 'block';
      overlay.style.display = 'block';

      opts.confirm && (fnEvent.confirm = opts.confirm);
      opts.cancel && (fnEvent.cancel = opts.cancel);
      opts.verify && (fnEvent.verify = opts.verify);
      opts.close && (fnEvent.close = opts.close);

      bind(dialog, 'click', events);
  }

  /*
   * 隐藏一个dialog并解绑 click 事件
  */
  function hide(dialog) {
      unbind(dialog, 'click', events);
      fnEvent = {};

      domBody.style.position = 'static';
      domBody.style.top = 0;
      domBody.style.overflowY = 'auto';
      domBody.scrollTop = bodyScrollTop;

      overlay.style.display = 'none';
      dialog.style.display = 'none';
  }

  /**
   * 事件委托判断点击按钮功能
  */
  function events(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    var dialog = this;

    if (hasClass(target, 'gb-dialog-confirm')) {
      typeof fnEvent.confirm === 'function' && fnEvent.confirm();
      hide(dialog);
    } else if (hasClass(target, 'gb-dialog-cancel')) {
      typeof fnEvent.cancel === 'function' && fnEvent.cancel();
      hide(dialog);
    } else if (hasClass(target, 'gb-dialog-close')) {
      typeof fnEvent.close === 'function' && fnEvent.close();
      hide(dialog);
    } else if (hasClass(target, 'gb-dialog-verify')) {
      e.preventDefault();  //阻止默认事件
      typeof fnEvent.verify === 'function' && fnEvent.verify() && typeof fnEvent.confirm === 'function' && fnEvent.confirm();
    }

  }

  /**
   * Bind events to elements
   * @param {Object}    ele    HTML Object
   * @param {Event}     event  Event to detach
   * @param {Function}  fn     Callback function
  */
  function bind(ele, event, fn) {
      if (typeof addEventListener === 'function') {
          ele.addEventListener(event, fn, false);
      }  else if (ele.attachEvent) {
          ele.attachEvent('on' + event, fn);
      }
  }

  /**
   * Unbind events to elements
   * @param {Object}    ele    HTML Object
   * @param {Event}     event  Event to detach
   * @param {Function}  fn     Callback function
  */
  function unbind(ele, event, fn) {
      if (typeof removeEventListener === 'function') {
          ele.removeEventListener(event, fn, false);
      } else if (ele.detachEvent) {
          ele.detach('on' + event, fn);
      }
  }


  /**
   * hasClass
   * @param {Object} ele   HTML Object
   * @param {String} cls   className
   * @return {Boolean}
  */
  function hasClass(ele, cls) {
    if (!ele || !cls) return false;
    if (ele.classList) {
      return ele.classList.contains(cls);
    } else {
      return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }
  }

  // addClass
/*  function addClass(ele, cls) {
    if (ele.classList) {
      ele.classList.add(cls);
    } else {
      if (!hasClass(ele, cls)) ele.className += '' + cls;
    }
  }

  // removeClass
  function removeClass(ele, cls) {
    if (ele.classList) {
      ele.classList.remove(cls);
    } else {
      ele.className = ele.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }*/

  // init
  init();

  var gbDialog = {
      show: function(opts) {
        return show(opts);
      }
  };


  // AMD (@see https://github.com/jashkenas/underscore/blob/master/underscore.js)
  if (typeof define == 'function' && define.amd) {
    define('GB-dialog', [], function() {
      return gbDialog;
    });
  } else {
    // (@see https://github.com/madrobby/zepto/blob/master/src/zepto.js)
    window.gbDialog === undefined && (window.gbDialog = gbDialog);
  }

}());
