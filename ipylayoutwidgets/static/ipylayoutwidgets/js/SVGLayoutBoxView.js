define([
  "./Toolkit.js"
],
function(tk){
  var _ = tk._,
    d3 = tk.d3;

  d3.ns.prefix.inkscape = "http://www.inkscape.org/namespaces/inkscape";

  var SVGLayoutBoxView = tk.manager.ManagerBase._view_types.BoxView.extend({
    initialize: function(){
      this.d3 = d3.select(this.el)
        .style({
          position: "relative",
          "text-align": "center"
        });
      d3.select(window).on("resize", _.bind(this.update, this));

      this.model.on("change:svg", _.bind(this.load_svg, this));

      SVGLayoutBoxView.__super__.initialize.apply(this, arguments);

      this.update();
    },

    parser: new DOMParser(),

    update: function(){
      this.layout();
      SVGLayoutBoxView.__super__.update.apply(this, arguments);
    },

    layout: function(){
      var view = this,
        el = this.el.parentNode;

      if(!el){ return _.delay(_.bind(this.layout, this)); }

      if(this.last_svg !== this.model.get("svg")){
        this.load_svg();
      }

      this.resize();
    },

    load_svg: function(){
      var view = this,
        el = this.el.parentNode;

      view.last_layout = this.model.get("svg");

      var layout = this.d3.selectAll(".ipnbdbtk-svg-layout").data([1])
      layout.remove();
      layout.enter()
        .call(function(){
          var xml = view.parser.parseFromString(view.last_layout, "image/svg+xml"),
            importedNode = document.importNode(xml.documentElement, true),
            layout = view.d3.insert(
                function(){return importedNode; },
                ":first-child"
              )
              .classed({"ipnbdbtk-svg-layout": 1})
              .style({
                "z-index": -1
              });

            // find all of the `svg:g`s that are groups
            var children = layout.selectAll("g").filter(function(){
              return this.parentNode === layout.node() &&
                d3.select(this).attr("inkscape:groupmode") === "layer";
            });

            var root = layout.append("g").attr("id", "ROOT-"+ view.cid);

            children.each(function(){ root.node().appendChild(this); });

            view.original = {
              height: parseInt(layout.attr("height")),
              width: parseInt(layout.attr("width")),
            };

            layout.attr({
              width: el.clientWidth,
              height: el.clientHeight,
            });
        });
    },

    patternToRegexp: function(pattern){
      return new RegExp(
        pattern
          .replace(".", "\\.")
          .replace("*", ".*")
      )
    },

    resize: function(){
      var view = this,
        layout = this.d3.select(".ipnbdbtk-svg-layout"),
        el = this.el.parentNode,
        doc = document.documentElement,
        aspect_ratio = this.original.width / this.original.height,
        width = Math.min(el.clientWidth, doc.clientWidth),
        height = width / aspect_ratio,
        label_map = {},
        visible_layers = this.model.get("visible_layers")
          .map(this.patternToRegexp),
        scale = width / this.original.width;

      if(scale * this.original.height > doc.clientHeight){
        scale = doc.clientHeight / this.original.height;
        height = doc.clientHeight;
        width = height * aspect_ratio;
      }

      layout.attr({
          width: width,
          height: height
        })
        .style({
          opacity: this.model.get("show_svg") ? 1 : 0
        })
        .select("#ROOT-"+ view.cid)
        .attr({
          transform: "scale(" + scale + ")"
        });

      var layer = layout.selectAll("g"),
        named = layer.filter(function(){
          var label = d3.select(this).attr("inkscape:label");

          return label && visible_layers.find(function(visible_re){
            return label.match(visible_re);
          });
        });

      layer.each(function(){
        var layer = this,
          el = d3.select(this),
          label = el.attr("inkscape:label"),
          visible = named[0].indexOf(layer) > -1 ||
            _.any(named[0], function(child){ return layer.contains(child); });

        if(label && visible){
          label_map[label] = this;
        }

        el.style({
          display: visible ? "inline" : "none"
        });
      });

      var el_bb = view.el.getBoundingClientRect();

      _(view.model.get("widget_map"))
        .map(function(item, label){
          var label_re = view.patternToRegexp(label),
              layer = _(label_map).find(function(layer, layer_label){
                return layer_label.match(label_re);
              }),
              bb = layer && layer.getBoundingClientRect(),
              changed = false;

          if(!layer){
            _(item.views).map(function(child){
              child.then(function(child){
                d3.select(child.el)
                  .transition()
                  .style({opacity: 0})
                  .transition().style({display: "none"});
              })
            });

            return;
          }

          ["width", "height"].map(function(attr){
            if(!item.has(attr)){ return; }
            item.set(attr, bb[attr]);
            changed = true;
          });

          _(item.views).map(function(child){
            child.then(function(child){
              d3.select(child.el)
                .transition()
                .style({
                  position: "absolute",
                  display: "block",
                  opacity: 1.0,
                  top: (bb.top - el_bb.top) + "px",
                  left: (bb.left - el_bb.left) + "px",
                  width: bb.width + "px",
                  height: bb.height + "px"
                });
              child.touch();
            })
          });
        });
    }
  });

  return {
    SVGLayoutBoxView: SVGLayoutBoxView
  };
});