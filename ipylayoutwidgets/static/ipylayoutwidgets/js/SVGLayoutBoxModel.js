define([
  "./Toolkit.js"
], function(tk){
  var _ = tk._,
    BoxModel = tk.manager.ManagerBase._model_types.BoxModel;

  var SVGLayoutBoxModel = BoxModel.extend({}, {
    serializers: _.extend({
      widget_map: {deserialize: tk.widget.unpack_models}
    }, BoxModel.serializers)
  });

  return {
    SVGLayoutBoxModel: SVGLayoutBoxModel
  };
});