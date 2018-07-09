{
  const _prefix = element => {
    var aPrefix = ["webkit", "Moz", "o", "ms"];
    var props = "";
    for (var i in aPrefix) {
      props = aPrefix[i] + "Transition";
      if (element.style[props] !== undefined) {
        return "-" + aPrefix[i].toLowerCase() + "-";
      }
    }
    return false;
  };

  class PageSwitch {
    constructor(options) {
      this.selectors = {
        sections: options.selectors.sections || ".sections",
        section: options.selectors.section || ".section",
        page: options.selectors.page || ".pages",
        active: options.selectors.active || ".active",
      }
      this.index = options.index;
      this.easing = options.easing;
      this.duration = options.duration;
      this.loop = options.loop;
      this.pagination = options.pagination;
      this.keyboard = options.keyboard;
      this.direction = options.direction;
      this.callback = options.callback;

      this.init()
    }

    init() {
      console.log(this);
      
    }
  }

  window.PageSwitch = PageSwitch;
}