(function ($) {
  "use strict";

  //说明:获取浏览器前缀
  //实现：判断某个元素的css样式中是否存在transition属性
  //参数：dom元素
  //返回值：boolean，有则返回浏览器样式前缀，否则返回false
  var _prefix = (function (temp) {
    var aPrefix = ["webkit", "Moz", "o", "ms"];
    var props = "";
    for (var i in aPrefix) {
      props = aPrefix[i] + "Transition";
      if (temp.style[props] !== undefined) {
        return "-" + aPrefix[i].toLowerCase() + "-";
      }
    }
    return false;
  })(document.createElement(PageSwitch));

  var PageSwitch = (function () {
    function PageSwitch(element, options) {
      this.settings = $.extend(true, $.fn.PageSwitch.defaults, options || {});
      this.element = element;
      this.init();
    }

    PageSwitch.prototype = {
      //说明：初始化插件
      //实现：初始化dom结构，布局，分页及绑定事件
      init: function () {
        var self = this;
        self.selectors = self.settings.selectors;
        self.sections = self.element.find(self.selectors.sections);
        self.section = self.sections.find(self.selectors.section);

        self.direction = self.settings.direction == "vertical" ? true : false;
        self.pagesCount = self.pagesCount();
        self.index = (self.settings.index >= 0 && self.settings.index < self.pagesCount) ? self.settings.index : 0;

        self.canscroll = true;

        if (!self.direction || self.index) {
          self._initLayout();
        }

        if (self.settings.pagination) {
          self._initPaging();
        }
        
        self._initEvent();
      },

      //说明：获取滑动页面数量
      pagesCount: function () {
        return this.section.length;
      },

      //说明：获取滑动的宽度（横屏滑动）或高度（竖屏滑动）
      switchLength: function () {
        return this.direction == 1 ? this.element.height() : this.element.width();
      },

      //说明：向前滑动即上一页
      prve: function () {
        var self = this;
        if (self.index > 0) {
          self.index--;
        } else if (self.settings.loop) {
          self.index = self.pagesCount - 1;
        }
        self._scrollPage();
      },

      //说明：向后滑动即下一页
      next: function () {
        var self = this;
        if (self.index < self.pagesCount) {
          self.index++;
        } else if (self.settings.loop) {
          self.index = 0;
        }
        self._scrollPage();
      },

      //说明：主要针对横屏情况进行页面布局
      _initLayout: function () {
        var self = this;
        if (!self.direction) {
          var width = (self.pagesCount * 100) + "%",
            cellWidth = (100 / self.pagesCount).toFixed(2) + "%";
          self.sections.width(width);
          self.section.width(cellWidth).css("float", "left");
        }
        if (self.index) {
          self._scrollPage(true);
        }
      },

      //说明：主要针对横屏情况进行页面布局
      _initPaging: function () {
        var self = this;
        var pagesClass = self.selectors.page.substring(1);
        self.activeClass = self.selectors.active.substring(1);

        //var pageHtml = "<ul class=" + pagesClass + ">";
        var pageHtml = `<ul class=${pagesClass}>`;
        for (var i = 0; i < self.pagesCount; i++) {
          pageHtml += `<li></li>`;
        }
        pageHtml += "</ul>";
        self.element.append(pageHtml);
        var pages = self.element.find(self.selectors.page);
        self.pageItem = pages.find("li");
        self.pageItem.eq(self.index).addClass(self.activeClass);

        if (self.direction) {
          pages.addClass("vertical");
        } else {
          pages.addClass("horizontal");
        }
      },

      //说明：初始化插件事件
      _initEvent: function () {
        var self = this;

        //绑定分页click事件
        self.element.on("click", self.selectors.page + " li", function () {
          self.index = $(this).index();
          self._scrollPage();
        });

        //绑定鼠标滚轮事件
        self.element.on("mousewheel DOMMouseScroll", function (e) {
          e.preventDefault();
          var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
          if (self.canscroll) {
            if (delta > 0 && (self.index && !self.settings.loop || self.settings.loop)) {
              self.prve();
            } else if (delta < 0 && (self.index < (self.pagesCount - 1) && !self.settings.loop || self.settings.loop)) {
              self.next();
            }
          }
        });

        //绑定键盘事件
        if (self.settings.keyboard) {
          $(window).keydown(function (e) {
            var keyCode = e.keyCode;
            if (keyCode == 37 || keyCode == 38) {
              self.prve();
            } else if (keyCode == 39 || keyCode == 40) {
              self.next();
            }
          });
        }

        //绑定窗口改变事件
        //为了不频繁调用resize的回调方法，做了延迟
        var resizeId;
        $(window).resize(function () {
          clearTimeout(resizeId);
          resizeId = setTimeout(function () {
            var currentLength = self.switchLength();
            var offset = self.settings.direction ? self.section.eq(self.index).offset().top : self.section.eq(self.index).offset().left;
            if (Math.abs(offset) > currentLength / 2 && self.index < (self.pagesCount - 1)) {
              self.index++;
            }
            if (self.index) {
              self._scrollPage();
            }
          }, 500);
        });

        //支持CSS3动画的浏览器，绑定transitionend事件(即在动画结束后调用起回调函数)
        if (_prefix) {
          self.sections.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend", function () {
            self.canscroll = true;
            if (self.settings.callback && $.type(self.settings.callback) === "function") {
              self.settings.callback();
            }
          })
        }
      },

      //滑动动画
      _scrollPage: function (init) {
        var self = this;
        var dest = self.section.eq(self.index).position();
        if (!dest) return;

        self.canscroll = false;
        if (_prefix) {
          //var translate = self.direction ? "translateY(-" + dest.top + "px)" : "translateX(-" + dest.left + "px)";
          var translate = self.direction ? `translateY(-${dest.top}px)` : `translateX(-${dest.left}px)`;
          self.sections.css(_prefix + "transition", "all " + self.settings.duration + "ms " + self.settings.easing);
          self.sections.css(_prefix + "transform", translate);
        } else {
          var animateCss = self.direction ? {
            top: -dest.top
          } : {
            left: -dest.left
          };
          self.sections.animate(animateCss, self.settings.duration, function () {
            self.canscroll = true;
            if (self.settings.callback) {
              self.settings.callback();
            }
          });
        }
        if (self.settings.pagination && !init) {
          self.pageItem.eq(self.index).addClass(self.activeClass).siblings("li").removeClass(self.activeClass);
        }
      }
    };
    return PageSwitch;
  })();

  $.fn.PageSwitch = function (options) {
    return this.each(function () {
      var self = $(this),
        instance = self.data("PageSwitch");

      if (!instance) {
        self.data("PageSwitch", (instance = new PageSwitch(self, options)));
      }

      if ($.type(options) === "string") return instance[options]();
    });
  };

  $.fn.PageSwitch.defaults = {
    selectors: {
      sections: ".sections",
      section: ".section",
      page: ".pages",
      active: ".active",
    },
    index: 0, //页面开始的索引
    easing: "ease", //动画效果
    duration: 500, //动画执行时间
    loop: false, //是否循环切换
    pagination: true, //是否进行分页
    keyboard: true, //是否触发键盘事件
    direction: "vertical", //滑动方向vertical,horizontal
    callback: "" //回调函数
  };

  $(function () {
    $('[data-PageSwitch]').PageSwitch();
  });
})(jQuery);