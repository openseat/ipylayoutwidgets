import codecs

from ipywidgets import widgets, widget_serialization
import traitlets


class SVGLayoutBox(widgets.Box):
    """
    A container that positions its `children` according to the
    bounding boxes of the inkscape layers in its
    
    TODO
    scale_mode: fit or stretch
    center?
    """
    _view_name = traitlets.Unicode('SVGLayoutBoxView', sync=True)
    _view_module = traitlets.Unicode(
        "/nbextensions/ipylayoutwidgets/js/SVGLayoutBoxView.js",
        sync=True
    )
    _model_name = traitlets.Unicode('SVGLayoutBoxModel', sync=True)
    _model_module = traitlets.Unicode(
        "/nbextensions/ipylayoutwidgets/js/SVGLayoutBoxModel.js",
        sync=True
    )

    svg = traitlets.Unicode(sync=True)
    svg_file = traitlets.Unicode(sync=True)
    show_svg = traitlets.Bool(True, sync=True)
    widget_map = traitlets.Dict(
        sync=True, **widget_serialization,
        help="a dictionary of widget instances keyed by the inkscape:label of a layer. Accepts * as wildcard.")
    visible_layers = traitlets.Tuple(
        ["*"],
        sync=True,
        help="a list of inkscape:label for inkscape layers to show. Accepts * as wildcard.")
    
    def _svg_file_changed(self, name, old_val, new_val):
        with codecs.open(new_val, "r", "utf-8") as f:
            self.svg = f.read()
