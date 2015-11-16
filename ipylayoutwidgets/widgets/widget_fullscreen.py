# Widget definitions
from ipywidgets import widgets
import traitlets

class FullscreenBox(widgets.Box):
    _view_name = traitlets.Unicode('FullscreenBoxView', sync=True)
    _view_module = traitlets.Unicode(
        "/nbextensions/ipylayoutwidgets/js/FullscreenBoxView.js",
        sync=True
    )