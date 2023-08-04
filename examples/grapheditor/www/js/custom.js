mxGraph.prototype.applyCustomSetting = function () {
    this.collapsedImage = new mxImage('./icons/arrow-right.svg', 24, 24);
    this.expandedImage = new mxImage('./icons/arrow-left.svg', 24, 24);
}

mxCellRenderer.prototype.getControlBounds = function (state, w, h) {
    if (state.control != null) {
        var s = state.view.scale;
        var cx = state.getCenterX();
        var cy = state.getCenterY();

        if (!state.view.graph.getModel().isEdge(state.cell)) {
            cx = state.x + state.width - w * s;
            cy = state.y + h * s;

            if (state.shape != null) {
                // TODO: Factor out common code
                var rot = state.shape.getShapeRotation();

                if (this.legacyControlPosition) {
                    rot = mxUtils.getValue(state.style, mxConstants.STYLE_ROTATION, 0);
                } else {
                    if (state.shape.isPaintBoundsInverted()) {
                        var t = (state.width - state.height) / 2;
                        cx += t;
                        cy -= t;
                    }
                }

                if (rot != 0) {
                    var rad = mxUtils.toRadians(rot);
                    var cos = Math.cos(rad);
                    var sin = Math.sin(rad);

                    var point = mxUtils.getRotatedPoint(new mxPoint(cx, cy), cos, sin,
                        new mxPoint(state.getCenterX(), state.getCenterY()));
                    cx = point.x;
                    cy = point.y;
                }
            }
        }

        if (state.style.startSize) {
            return (state.view.graph.getModel().isEdge(state.cell)) ?
                new mxRectangle(Math.round(cx), Math.round(state.y - (h - state.style.startSize) / 2 * s), Math.round(w * s), Math.round(h * s))
                : new mxRectangle(Math.round(cx), Math.round(state.y - (h - state.style.startSize) / 2 * s), Math.round(w * s), Math.round(h * s));
        } else {
            return (state.view.graph.getModel().isEdge(state.cell)) ?
                new mxRectangle(Math.round(cx - w / 2 * s), Math.round(cy - h / 2 * s), Math.round(w * s), Math.round(h * s))
                : new mxRectangle(Math.round(cx - w / 2 * s), Math.round(cy - h / 2 * s), Math.round(w * s), Math.round(h * s));
        }

    }

    return null;
};