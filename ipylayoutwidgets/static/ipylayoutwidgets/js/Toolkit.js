require.config({
  paths:{
    d3: "/nbextensions/ipylayoutwidgets/js/lib/d3.v3.min"
  }
});

define([
    "nbextensions/widgets/widgets/js/manager",
    "nbextensions/widgets/widgets/js/widget",

    "d3",
    "underscore",
    "jquery"
  ],
  function(manager, widget, d3, _, $){
    function register(exports){
      _.each(exports, function(widget, name){
        manager.WidgetManager.register_widget_view(name, widget);
      });
      return exports;
    }

    return {
      register: register,
      widget: widget,
      manager: manager,
      
      d3: d3,
      _: _,
      $: $
    };
  }
);
