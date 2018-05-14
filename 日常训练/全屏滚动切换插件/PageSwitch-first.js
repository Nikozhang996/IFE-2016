(function ($) {
  /* 添加浏览器前缀 */
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

  /*  */
  var PageSwitch = (function () {
    function PageSwitch(element, options) {
      this.settings = $.extend(true, $.fn.PageSwitch.defaults, options || {});
      this.element = element;
      this.init();
    }
    PageSwitch.prototype = {
      construstor: PageSwitch,
      /* 初始化插件 */
      init: function () {
        var self = this;
        self.selectors = self.settings.selectors;
        self.sections = self.element.find(self.selectors.sections);
        self.section = self.sections.find(self.selectors.section);

        self.direction = self.settings.direction == "vertical" ? true : false;
        self.pagesCount = self.pagesCount();

        self.index = (self.settings.index >= 0 && self.settings.index < self.pagesCount) ?
          self.settings.index :
          0;

        self.canScroll = true;

        if (!self.direction) {
          self._initLayout();
        }

        if (self.settings.pagination) {
          self._initPaging();
        }

        this._initEvent();
      },

      /* 获取滑动页面数量 */
      pagesCount: function () {
        return this.section.length;
      },

      /* 获取滑动的宽度或高度 */
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


      /* 针对横屏情况进行页面布局 */
      _initLayout: function () {
        var self = this;
        if (!this.direction) {
          var width = (this.pagesCount * 100) + "%",
            cellWidth = (100 / this.pagesCount).toFixed(2) + "%";
          this.sections.width(width);
          this.section.width(cellWidth).css("float", "left");
        }
        if (this.index) {
          this._scrollPage(true);
        }
      },

      /* 实现分页的DOM结构和CSS样式 */
      _initPaging: function () {
        var pagesClass = this.selectors.page.substring(1);
        this.activeClass = this.selectors.active.substring(1);

        var pageHtml = 'ul class=' + pagesClass + '>';
        for (var i = 0; i < this.pagesCount; i++) {
          pageHtml += '<li></li>';
        }
        pageHtml += '</ul>';

        this.element.append(pageHtml);

        var pages = this.element.find(this.selectors.page);
        this.pageItem = pages.find('li');
        this.pageItem.eq(this.index).addClass(this.activeClass);

        if (this.direction) {
          pages.addClass('vertical');
        } else if (this.settings.pagination) {
          pages.addClass('horizontal');
        }
      },

      /* 初始化插件事件 */
      _initEvent: function () {
        var self = this;

        /* 绑定鼠标点击切换事件 */
        this.element.on('click', self.selectors.pages + 'li', function (ev) {
          self.index = $(this).index();
          self._scrollPage();
        });

        /* 绑定鼠标滚轮事件 */
        this.element.on('mousewheel DOMMouseScroll', function (ev) {
          if (self.canScroll) {
            var delta = ev.originalEvent.wheelDelta || -ev.originalEvent.detail;

            if (delta > 0 && (self.index && !self.settings.loop || self.settings.loop)) {
              self.prve();
            } else if (delta < 0 && (self.index < (self.pagesCount - 1) && !self.settings.loop || self.settings
                .loop)) {
              self.next();
            }
          }
        });

        /* 绑定键盘事件 */
        if (self.settings.keyboard) {
          $(window).on('keydown', function (ev) {
            var keyCode = ev.keyCode;
            if (keyCode == 37 || keyCode == 38) {
              self.prve();
            } else if (keyCode == 39 || keyCode == 40) {
              self.next();
            }
          });
        }

        /* 绑定窗口改变事件 */
        var resizeId;
        $(window).resize(function () {
          clearTiselfout(resizeId);
          resizeId = setTiselfout(function () {
            var currentLength = self.switchLength();
            var offset = self.settings.direction ? self.section.eq(self.index).offset().top : self.section
              .eq(
                self.index).offset().left;
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

      /* 滑动动画 */
      _scrollPage: function (init) {
        var dest = this.section.eq(this.index).position();
        if (!dest) return;

        this.canscroll = false;
        if (_prefix) {
          //var translate = this.direction ? "translateY(-" + dest.top + "px)" : "translateX(-" + dest.left + "px)";
          var translate = this.direction ? `translateY(-${dest.top}px)` : `translateX(-${dest.left}px)`;
          this.sections.css(_prefix + "transition", "all " + this.settings.duration + "ms " + this.settings.easing);
          this.sections.css(_prefix + "transform", translate);
        } else {
          var animateCss = this.direction ? {
            top: -dest.top
          } : {
            left: -dest.left
          };
          this.sections.animate(animateCss, this.settings.duration, function () {
            this.canscroll = true;
            if (this.settings.callback) {
              this.settings.callback();
            }
          });
        }
        if (this.settings.pagination && !init) {
          this.pageItem.eq(this.index).addClass(this.activeClass).siblings("li").removeClass(this.activeClass);
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

  }
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
  }


  $(function () {
    $('[data-PageSwitch]').PageSwitch();
  })

})(jQuery);