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

        return (state.view.graph.getModel().isEdge(state.cell)) ?
            new mxRectangle(Math.round(cx - w / 2 * s), Math.round(cy - h / 2 * s), Math.round(w * s), Math.round(h * s))
            : new mxRectangle(Math.round(cx - w / 2 * s), Math.round(cy - h / 2 * s), Math.round(w * s), Math.round(h * s));
    }

    return null;
};

/**
 * Function: getCellStyle
 *
 * Returns an array of key, value pairs representing the cell style for the
 * given cell. If no string is defined in the model that specifies the
 * style, then the default style for the cell is returned or an empty object,
 * if no style can be found. Note: You should try and get the cell state
 * for the given cell and use the cached style in the state before using
 * this method.
 *
 * Parameters:
 *
 * cell - <mxCell> whose style should be returned as an array.
 */
mxGraph.prototype.getCellStyle = function (cell) {
    console.log(cell, cell.collapsed)
    var stylename = this.model.getStyle(cell);
    var style = null;

    // Gets the default style for the cell
    if (this.model.isEdge(cell)) {
        style = this.stylesheet.getDefaultEdgeStyle();
    } else {
        if (this.model.isCollapsed(cell)) {
            style = this.stylesheet.getDefaultCollapsedVertexStyle();
        } else {
            style = this.stylesheet.getDefaultVertexStyle();
        }
    }

    // Resolves the stylename using the above as the default
    if (stylename != null) {
        style = this.postProcessCellStyle(this.stylesheet.getCellStyle(stylename, style));
    }

    // Returns a non-null value if no style can be found
    if (style == null) {
        style = new Object();
    }

    return style;
};

/**
 * Function: getDefaultCollapsedVertexStyle
 *
 * Returns the default style for collapsed vertices.
 */
mxStylesheet.prototype.getDefaultCollapsedVertexStyle = function () {



    return this.styles['defaultCollapsedVertex'];
};