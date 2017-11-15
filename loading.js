function setStatusTitle (status_title) {
      var elem;
      if (this.status_timer) {
        clearInterval(this.status_timer);
      }
      elem = $(".status-title");
      if (status_title === elem.text()) {
        return;
      }
      if (status_title === "") {
        elem.css("display", "none");
        return;
      }
      elem.css("transform", "translateY(20px)").css("opacity", 0);
      return this.status_timer = setTimeout(((function(_this) {
        return function() {
          elem.text(status_title);
          elem.css("transition", "none");
          elem.css("transform", "translateY(-20px)").css("opacity", 0);
          return _this.status_timer = setTimeout((function() {
            elem.css("transition", "");
            return elem.css("transform", "translateY(0px)").css("opacity", 0.6);
          }), 10);
        };
      })(this)), 600);
    };