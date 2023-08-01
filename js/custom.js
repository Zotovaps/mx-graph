/**
 * Function: createSelectionShape
 *
 * Apply a custom Settings
 */
mxGraph.prototype.applyCustomSetting = function () {
    /**
     * Class: mxConstants
     *
     * Defines various global constants.
     *
     * Variable: DEFAULT_HOTSPOT
     *
     */

    mxConstants.VERTEX_SELECTION_COLOR = "#2D49D7";
    mxConstants.VERTEX_SELECTION_DASHED = false;
    mxConstants.VERTEX_SELECTION_STROKEWIDTH = 2;

    let style = {};

    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EntityPerimeter;
    style[mxConstants.STYLE_FILLCOLOR] = '#0A1650';
    style[mxConstants.STYLE_STROKECOLOR] = '#D2D7E3';
    style[mxConstants.STYLE_STROKEWIDTH] = 1;
    style[mxConstants.STYLE_ROUNDED] = 1;
    style[mxConstants.STYLE_ABSOLUTE_ARCSIZE] = 1;
    style[mxConstants.STYLE_ARCSIZE] = "60";
    style[mxConstants.STYLE_FONTSIZE] = "14";
    style[mxConstants.STYLE_FONTCOLOR] = "#FFFFFF";

// Используется для меток HTML, которые занимают все пространство вершин
// (см. graph.cellRenderer.redrawLabel ниже для синхронизации размера)
    style[mxConstants.STYLE_OVERFLOW] = 'fill';
    this.getStylesheet().putCellStyle('collapsedVertex', style);

    style = {};

// Использует периметр объекта (ниже) по умолчанию
// (Uses the entity perimeter (below) as default)
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EntityPerimeter;
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = '#D2D7E3';
    style[mxConstants.STYLE_STROKEWIDTH] = 1;
    style[mxConstants.STYLE_ROUNDED] = 1;
    style[mxConstants.STYLE_ABSOLUTE_ARCSIZE] = 1;
    style[mxConstants.STYLE_ARCSIZE] = "16";
    style[mxConstants.STYLE_FONTSIZE] = "14";
    style[mxConstants.STYLE_FONTCOLOR] = "#24293D";

// Используется для меток HTML, которые занимают все пространство вершин
// (см. graph.cellRenderer.redrawLabel ниже для синхронизации размера)
    style[mxConstants.STYLE_OVERFLOW] = 'fill';
    this.getStylesheet().putCellStyle('vertex', style);
}
/**
 * Function: createSelectionShape
 *
 * Creates the shape used to draw the selection border.
 */
mxVertexHandler.prototype.createSelectionShape = function (bounds) {
    var shape = new mxRectangleShape(
        mxRectangle.fromRectangle(bounds),
        null, this.getSelectionColor());
    shape.strokewidth = this.getSelectionStrokeWidth();
    shape.isDashed = this.isSelectionDashed();


    shape.isRounded = 1;

    shape.style = new Object()

    shape.style.absoluteArcSize = this.state.style.absoluteArcSize;
    shape.style.arcSize = this.state.style.arcSize;

    return shape;
};

/**
 * Function: getControlBounds
 *
 * Returns the bounds to be used to draw the control (folding icon) of the
 * given state.
 */
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
    var stylename = this.model.getStyle(cell);
    var style = null;

    // Gets the default style for the cell
    if (this.model.isEdge(cell)) {
        style = this.stylesheet.getDefaultEdgeStyle();
    } else {
        if (this.model.isCollapsed(cell)) {
            style = this.stylesheet.getCollapsedVertexStyle();
        } else {
            style = this.stylesheet.getVertexStyle();
        }
    }

    // Resolves the stylename using the above as the default
    if (stylename != null) {
        style = this.postProcessCellStyle(this.stylesheet.getCellStyle(stylename, style));
    }

    // Returns a non-null value if no style can be found
    if (style == null) {
        style = {};
    }

    return style;
};


/**
 * Function: getCollapsedVertexStyle
 *
 * Returns the default style for collapsed vertices.
 *
 */
mxStylesheet.prototype.getCollapsedVertexStyle = function () {
    return this.styles['collapsedVertex'];
};

/**
 * Function: getVertexStyle
 *
 * Returns the default style for not collapsed vertices.
 **/
mxStylesheet.prototype.getVertexStyle = function () {
    return this.styles['vertex'];
}