(function ($) {
  /* 
  说明：添加浏览器前缀
  实现：判断某个元素的css样式中是否存在transition属性
  参数：dom元素
  返回值：boolean，有则返回浏览器样式前缀，否则返回false
  */
  var _prefix = (function (element) {
    var aPrefix = ["webkit", "Moz", "o", "ms"];
    var props = "";
    for (var i in aPrefix) {
      props = aPrefix[i] + "Transition";
      if (element.style[props] !== undefined) {
        return "-" + aPrefix[i].toLowerCase() + "-";
      }
    }
    return false;
  })(document.createElement(PageSwitch));

  /*  
  说明：通过闭包实现单例模式返回PageSwitch插件
  返回值：PageSwitch构造函数
  */
  var PageSwitch = (function () {
    function PageSwitch(element, options) {
      // 定义默认配置还是手动配置
      this.settings = $.extend(true, $.fn.PageSwitch.defaults, options || {});

      // 当前容器元素
      this.element = element;

      // 初始化插件
      this.init();
    }
    PageSwitch.prototype = {
      construstor: PageSwitch,
      /* 初始化插件 */
      init: function () {
        //  获取选择器，区块大容器，每个区块，显示方向，页数
        this.selectors = this.settings.selectors;
        this.sections = this.element.find(this.selectors.sections);
        this.section = this.sections.find(this.selectors.section);
        this.direction = this.settings.direction == "vertical" ? true : false;
        this.pagesCount = this.pagesCount();

        // 0 < index < 页数，否则重置为0
        this.index = (this.settings.index >= 0 && this.settings.index < this.pagesCount) ?
          this.settings.index :
          0;

        // 判断动画是否正在进行
        this.isScrolling = true;

        if (!this.direction) {
          this._initLayout();
        }
        if (this.settings.pagination) {
          this._initPaging();
        }

        // 初始化所有事件
        this._initEvent();
      },

      /*说明： 获取滑动页面数量 */
      pagesCount: function () {
        return this.section.length;
      },

      /* 说明：获取滑动的宽度或高度 */
      switchLength: function () {
        // 如果是vertical则获取元素高度，如果是horizontal则获取元素宽度
        return this.direction == 1 ? this.element.height() : this.element.width();
      },

      /* 说明：向前滑动即上一页 */
      prve: function () {
        // 如果loop:true，则重置index
        if (this.index > 0) {
          this.index--;
        } else if (this.settings.loop) {
          this.index = this.pagesCount - 1;
        }
        this._scrollPage();
      },

      /* 说明：向后滑动即下一页 */
      next: function () {
        if (this.index < this.pagesCount) {
          this.index++;
        } else if (this.settings.loop) {
          this.index = 0;
        }
        this._scrollPage();
      },


      /* 说明： 针对横屏情况进行页面布局 */
      _initLayout: function () {
        var self = this;

        // 计算父容器总宽度，子容器各占的百分比。
        if (!this.direction) {
          var width = (this.pagesCount * 100) + "%",
            cellWidth = (100 / this.pagesCount).toFixed(2) + "%";
          this.sections.width(width);
          this.section.width(cellWidth).css("float", "left");
        }

        // 如果index存在，允许滚动
        if (this.index) {
          this._scrollPage(true);
        }
      },

      /* 实现分页的DOM结构和CSS样式 */
      _initPaging: function () {
        // 提取Class
        var pagesClass = this.selectors.page.substring(1);
        this.activeClass = this.selectors.active.substring(1);

        // 生成分页DOM结构
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
        } else {
          pages.addClass('horizontal');
        }
      },

      /* 初始化插件事件 */
      _initEvent: function () {
        var self = this;

        /* 绑定鼠标点击切换事件 */
        this.element.on('click', self.selectors.pages + 'li', function (ev) {
          console.log(this);

          self.index = $(this).index();
          self._scrollPage();
        });

        /* 绑定鼠标滚轮事件 */
        this.element.on('mousewheel DOMMouseScroll', function (ev) {
          if (self.isScrolling) {
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
          clearTimeout(resizeId);
          resizeId = setTimeout(function () {
            var currentLength = self.switchLength();

            // 获取当前窗口的位移量
            var offset = self.direction ? self.section.eq(self.index).offset().top : self.section.eq(self.index).offset().left;

            // 判断偏移量是否大于当前屏幕的一半
            if (Math.abs(offset) > currentLength / 2 && self.index < (self.pagesCount - 1)) {
              self.index++;
            }
            if (self.index) {
              self._scrollPage();
            }
          }, 100)
        });

        /* 绑定transitionend事件(即在动画结束后调用起回调函数) */
        if (_prefix) {
          self.sections.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend", function () {
            self.isScrolling = true;
            if (self.settings.callback && $.type(self.settings.callback) === "function") {
              self.settings.callback();
            }
          })
        }
      },

      /* 滑动动画 */
      _scrollPage: function (init) {
        // dest为当前元素偏移量
        var dest = this.section.eq(this.index).position();
        if (!dest) return;

        this.isScrolling = false;
        
        // 如果支持css3动画则使用transition，否则用animate动画
        if (_prefix) {
          var translate = this.direction ? "translateY(-" + dest.top + "px)" : "translateX(-" + dest.left + "px)";
          // var translate = this.direction ? `translateY(-${dest.top}px)` : `translateX(-${dest.left}px)`;
          this.sections.css(_prefix + "transition", "all " + this.settings.duration + "ms " + this.settings.easing);
          this.sections.css(_prefix + "transform", translate);
        } else {
          var animateCss = this.direction ? {
            top: -dest.top
          } : {
            left: -dest.left
          };
          this.sections.animate(animateCss, this.settings.duration, function () {
            this.isScrolling = true;
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
      console.log(this);
      
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
    // $('[data-PageSwitch]').PageSwitch();
  })

})(jQuery);