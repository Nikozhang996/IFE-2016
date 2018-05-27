/*工具库*/
var $ = (function () {
  var flag = window.getComputedStyle;

  function children(element, tagName) {
    // IE6-8下不支持children属性，所以我们要自己实现
    // /MSIE (6 | 7 | 8)/i.test(navigator.userAgent
    if (flag) {
      var nodeList = element.childNodes;
      var ary = [];
      for (var i = 0, len = nodeList.length; i < len; i++) {
        if (nodeList[i].nodeType === 1) {
          ary.push(nodeList[i]);
        }
      }
    } else {
      //如果浏览器支持，则直接支持，为了保持一致所以需要把类数组转化为数组
      // ary = Array.prototype.slice.call(element.children);
      return element.children
    }
    if (typeof tagName === 'string') {
      for (var k = 0; k < ary.length; k++) {
        if (ary[k].nodeName.toLowerCase() !== tagName.toLowerCase()) {
          ary.splice(k, 1);
          k--;
        }
      }
    }
    return ary;
  }

  function prev(element) {
    if (flag) {
      return element.previousElementSibling;
    }
    var pre = element.previousSibling;
    while (pre && element.nodeType !== 1) {
      pre = pre.previousSibling;
    }
    return pre;
  }

  function prevAll(element) {
    var ary = [];
    var pre = prev(element);
    while (pre) {
      ary.unshift(pre);
      pre = prev(pre);
    }
    return ary;
  }

  function next(element) {
    if (flag) {
      return element.nextElementSibling;
    }
    var nex = element.nextSibling;
    while (nex && element.nodeType !== 1) {
      nex = nex.nextSibling;
    }
    return nex;
  }

  function nextAll(element) {
    var ary = [];
    var nex = this.next(element);
    while (nex) {
      ary.push(nex);
      nex = this.next(nex);
    }
    return ary;
  }

  function siblings(element) {
    return prevAll(element).concat(this.nextAll(element));
  }

  function getElementsByClass(strName, context) {
    context = context || document;
    if (flag) {
      return context.getElementsByClassName(strName);
    } else {
      var ary = [];
      var strClassAry = strName.replace(/(^ +| +$)/g, "").split(/ +/g)
      var nodeList = context.getElementsByTagName("*");
      for (var i = 0, len = nodeList.length; i < len; i++) {
        var curNode = nodeList[i];
        var isOk = true;
        for (var k = 0; k < strClassAry.length; k++) {
          var reg = new RegExp("(^| +)" + strClassAry[k] + "( +|$)");
          if (!reg.test(curNode.className)) {
            isOk = false;
            break;
          }
        }
        if (isOk) {
          ary[ary.length] = curNode;
        }
      }
      return ary;
    }
  }

  function firstChild(element) {
    var cur = children(element);
    if (cur.length > 0) {
      return cur[0];
    } else {
      return null;
    }
  }

  function lastChild(element) {
    var cur = children(element);
    if (cur.length > 0) {
      return cur[cur.length - 1];
    } else {
      return null;
    }
  }

  function removeClass(element, className) {
    var ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
    for (var i = 0, len = ary.length; i < len; i++) {
      var curName = ary[i];
      if (hasClass(element, curName)) {
        var reg = new RegExp("(^| +)" + curName + "( +|$)", "g");
        element.className = element.className.replace(reg, " ");
      }
    }
  }

  function addClass(element, className) {
    // 防止className传递进来的值包含多个样式类名，我们把传递进来的字符串按空格拆分成数组中的第一项
    var ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
    // 循环数组，对每项进行验证
    for (var i = 0, len = ary.length; i < len; i++) {
      var curName = ary[i];
      if (!hasClass(element, className)) {
        element.className += ' ' + className;
      }
    }
  }

  function hasClass(element, className) {
    var reg = new RegExp("(^| +)" + className + "( +|$)");
    return reg.test(element.className);
  }

  function getCss(attr) {
    var val = null,
      reg = /^(-?\d+(\.\d+)?)(px|pt|rem|em)?$/i;
    if (flag) {
      val = window.getComputedStyle(this, null)[attr];
    } else {
      if (attr === 'opacity') {
        val = this.currentStyle['filter'];
        reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
        val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
      } else {
        val = this.currentStyle[attr];
      }
    }
    return reg.test(val) ? parseFloat(val) : val;
  }

  function setCss(attr, value) {
    // 针对float做兼容
    if (attr === 'float') {
      this['style']['cssFloat'] = value;
      this['style']['styleFloat'] = value;
      return;
    }
    // 针对透明度做兼容
    if (attr === 'opacity') {
      this['style']['opacity'] = value;
      this['style']['filter'] = 'alpha(opacity=' + value * 100 + ')';
      return;
    }
    // 针对部分情况加单位px
    var reg = /^(width|height|top|bottom|left|right|fontSize|((margin|padding)(Top|Bottom|Left|Right)?))$/;
    if (reg.test(attr)) {
      // 判断是否为有效数字，如果是一个有效数字则需要加默认单位px
      if (!isNaN(value)) {
        value += 'px';
      }
    }
    console.log(this);
    this['style'][attr] = value;
  }

  function setGlobalCss(options) {
    options = options || null;
    if (options.toString() === '[object Object]') {
      for (var key in options) {
        if (options.hasOwnProperty(key)) {
          setCss.call(this, key, options[key]);
        }
      }
    }
  }

  function css(elements) {
    var ary = Array.prototype.slice.call(arguments, 1);
    var secendArgument = arguments[1];
    if (typeof secendArgument === 'string') {
      if (!arguments[2]) {
        return getCss.apply(elements, ary);
      }
      setCss.apply(elements, ary);
    }
    secendArgument = secendArgument || 0;
    if (myTypeof(secendArgument) === 'Object') {
      setGlobalCss.apply(elements, ary);
    }
  }

  function myTypeof(attr) {
    return Object.prototype.toString.call(attr).slice(8, -1);
  }

  function index(element) {
    return prevAll(element).length;
  }

  /* 事件类封装 */
  function addEventHandler(element, type, fn, boolean) {
    boolean = boolean || false
    if (element.addEventListener) {
      element.addEventListener(type, fn, boolean);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, fn, boolean);
    } else {
      element['on' + type] = fn;
    }
  }

  function removeEventHandler(element, type, fn, boolean) {
    boolean = boolean || false
    if (element.removeEventListener) {
      element.removeEventListener(type, fn, boolean);
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, fn, boolean);
    } else {
      element['on' + type] = null;
    }
  }

  return {
    children: children,
    prev: prev,
    prevAll: prevAll,
    next: next,
    nextAll: nextAll,
    siblings: siblings,
    index: index,
    getElementsByClass: getElementsByClass,
    firstChild: firstChild,
    lastChild: lastChild,
    addClass: addClass,
    removeClass: removeClass,
    hasClass: hasClass,
    getCss: getCss,
    setCss: setCss,
    setGlobalCss: setGlobalCss,
    css: css,
    myTypeof: myTypeof,
    addEventHandler: addEventHandler,
    removeEventHandler: removeEventHandler
  }
})()