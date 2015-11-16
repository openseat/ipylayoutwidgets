require.config({
  paths: {
    screenfull: "/nbextensions/ipylayoutwidgets/js/lib/screenfull"
  },
  shim: {
    screenfull: {
      exports: "screenfull"
    }
  }
});

define([
  "./Toolkit.js",
  "screenfull"
], function(tk, screenfull){
  var d3 = tk.d3,
    $ = tk.$,
    _ = tk._;

  var FullscreenBoxView = tk.manager.ManagerBase._view_types.BoxView.extend({
    render: function(){
      FullscreenBoxView.__super__.render.apply(this, arguments);
      var view = this;

      this.d3 = d3.select(this.el)
        .style(this.min_style);

      // TODO: bind this to trait
      this.maximized = false;

      screenfull.on("change", _.bind(this.fullscreen_changed, this));

      this.buttons = {
        maximize: {icon: "expand"},
        minimize:  {icon: "compress"},
        fullscreen: {icon: "desktop"}
      };

      this.d3.append("div")
        .attr("class", "btn-group")
        .style({position: "absolute", top: "2px", right: "2px"})
        .selectAll(".btn")
        .data(d3.entries(this.buttons))
      .enter()
        .append("button")
        .classed({btn: 1, "btn-default": 1})
        .call(function(btn){
          btn.append("i").attr("class", function(d){
            return "fa fa-" + d.value.icon;
          })
        })
        .on("click", function(d){ view[d.key](); });
      this.update();
    },
    update: function(){
      FullscreenBoxView.__super__.update.apply(this, arguments);
      window.dispatchEvent(new Event('resize'));
    },

    fullscreen: function(){
      this.maximized ? this.minimize() : this.maximize();
      screenfull.toggle(this.el);
      this.update();
    },
    minimize: function(){
      this.maximized = false;
      var style = d3.keys(this.max_style).reduce(function(memo, d){
        memo[d] = null;
        return memo;
      }, {});
      _.extend(style, this.min_style);
      this.d3.style(style);
      this.update();
    },
    maximize: function(){
      this.maximized = true;
      this.d3.style(this.max_style);
      this.update();
    },

    fullscreen_changed: function(evt){
      if(evt.target !== this.el){ return; }
      if(screenfull.element === null){
        this.minimize();
      }
    },

    max_style: {
      position: "fixed",
      width: "100%",
      height: "100%",
      "background-color": "white",
      top: 0,
      left: 0,
      "z-index": 9999
    },
    min_style: {
      position: "relative",
      width: "100%"
    }
  });

  return tk.register({
    FullscreenBoxView: FullscreenBoxView
  });
});