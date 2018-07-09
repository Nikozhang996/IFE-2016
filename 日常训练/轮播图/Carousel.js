function Carousel(element, URL, interval) {
  this.wrapper = element;
  this.banner = $.firstChild(this.wrapper);
  this.tips = $.children(this.wrapper, 'ul')[0];
  this.links = $.children(this.tips, 'li');
  this.buttonLeft = this.links[0];
  this.buttonRight = this.links[1];
  this.divList = this.banner.getElementsByTagName('div');
  this.imgList = this.banner.getElementsByTagName('img');
  this.tipsList = this.tips.getElementsByTagName('li');

  this.jsonData = null;

  this.intervel = interval || 2000;

  this.timer = null;

  this.step = 0;

  this.URL = URL;

  return this.init();
}

Carousel.prototype = {
  constructor: Carousel,
  /*请求数据*/
  getData: function () {
    var _this = this;

    var xhr = new XMLHttpRequest;
    xhr.open('get', this.URL + '?_=' + Math.random(), false);
    xhr.onreadystatechange = function () {
      console.log(xhr.readyState, xhr.status);
      if (xhr.readyState === 4 && /^2\d{2}/.test(xhr.status)) {
        _this.jsonData = JSON.parse(xhr.responseText);
      }
    }
    xhr.send(null);
  },

  /*实现数据绑定*/
  bindData: function () {
    var fragmentBanner = document.createDocumentFragment(),
      fragmentTips = document.createDocumentFragment();

    if (this.jsonData) {
      for (var i = 0; i < this.jsonData.length; i++) {
        var curData = this.jsonData[i];

        // 准备DOM结构的，div>img，li
        var div = document.createElement('div'),
          img = document.createElement('img'),
          li = document.createElement('li');

        // 为第一个li添加默认样式
        if (i === 0) {
          li.className = 'bg';
        }

        // 为img标签设置自定义属性
        img.mySrc = curData.src;

        // 添加数据绑定
        div.appendChild(img);
        fragmentBanner.appendChild(div);
        fragmentTips.appendChild(li);
      }
    }

    // 数据渲染到HTML上
    this.banner.appendChild(fragmentBanner);
    this.tips.appendChild(fragmentTips);
  },

  /*图片懒加载*/
  lazyLoding: function () {
    var _this = this;

    function loop(j) {
      var curImg = _this.imgList[j];
      var tempImg = new Image;
      tempImg.src = curImg.mySrc;

      tempImg.onload = function () {
        curImg.src = this.src;
        curImg.style.display = 'block';

        //只对第一张做处理
        if (j === 0) {
          var curDiv = curImg.parentNode;
          curDiv.style.zIndex = 1;
          animate(curDiv, {opacity: 1}, 200);
        }
        tempImg = null;
      }
    }

    for (var i = 0; i < this.imgList.length; i++) {
      loop(i);
    }
  },

  /*自动轮播*/
  autoMove: function () {
    // console.log(this.step);
    if (this.step === this.jsonData.length - 1) {
      this.step = -1;
    }
    this.step++;
    this.setBanner();
  },

  /*切换效果和焦点对齐*/
  setBanner: function () {
    for (var i = 0; i < this.divList.length; i++) {
      var curDiv = this.divList[i];

      if (i === this.step) {
        $.css(curDiv, 'zIndex', 1);
        // console.log(i);

        animate(curDiv, {opacity: 1}, 2000, function () {
          var curDivSib = $.siblings(this);
          // console.log(curDivSib);
          for (var k = 0; k < curDivSib.length; k++) {
            // console.log(curDivSib[k]);
            $.css(curDivSib[k], {opacity: 0})
          }
        });
        continue;
      }
      $.css(curDiv, {zIndex: 0});
    }

    // 焦点对齐
    for (var j = 0; j < this.tipsList.length; j++) {
      j === this.step ? $.addClass(this.tipsList[j], 'bg') : $.removeClass(this.tipsList[j], 'bg')
    }
  },

  /*控制自动轮播*/
  mouseEvent: function () {
    var _this = this;
    this.banner.onmouseover = function () {
      window.clearInterval(_this.timer);
    }
    this.banner.onmouseout = function () {
      _this.timer = window.setInterval(function () {
        console.log(_this.intervel);
        _this.autoMove();
      }, _this.intervel);
    }
  },

  /*点击焦点切换*/
  tipsEvent: function () {
    var _this = this;
    for (var i = 0; i < this.tipsList.length; i++) {
      var curLi = this.tipsList[i];
      curLi.index = i;
      curLi.onclick = function () {
        _this.step = this.index;
        _this.setBanner();
      }
    }
  },

  /*左右切换*/
  switchLR: function () {
    var _this = this;
    this.buttonLeft = function () {
      _this.autoMove();
    }
    this.buttonRight = function () {
      if (_this.step === 0) {
        _this.step = _this.jsonData.length;
      }
      _this.step--;
      _this.setBanner();
    }
  },

  /*初始化*/
  init: function () {
    var _this = this;

    this.getData();
    this.bindData();
    window.setTimeout(function () {
      _this.lazyLoding();
    }, 300);
    this.timer = window.setInterval(function () {
      _this.autoMove();
    }, _this.intervel);
    this.mouseEvent()

    return this;
  }
};

var box = document.getElementById('banner');
var a = new Carousel(box, 'app/js/data.json', 1000)