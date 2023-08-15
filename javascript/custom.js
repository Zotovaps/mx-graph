/**
 * Function: createSvg
 *
 * Creates and returns the DOM nodes for the SVG display.
 */
mxGraphView.prototype.createSvg = function()
{
    var container = this.graph.container;
    this.canvas = document.createElementNS(mxConstants.NS_SVG, 'g');

    // For background image
    this.backgroundPane = document.createElementNS(mxConstants.NS_SVG, 'g');
    this.canvas.appendChild(this.backgroundPane);

    // Adds two layers (background is early feature)
    this.drawPane = document.createElementNS(mxConstants.NS_SVG, 'g');
    this.canvas.appendChild(this.drawPane);

    this.overlayPane = document.createElementNS(mxConstants.NS_SVG, 'g');
    this.canvas.appendChild(this.overlayPane);

    this.decoratorPane = document.createElementNS(mxConstants.NS_SVG, 'g');
    this.canvas.appendChild(this.decoratorPane);

    var root = document.createElementNS(mxConstants.NS_SVG, 'svg');
    root.style.left = '0px';
    root.style.top = '0px';
    root.style.width = '100%';
    root.style.height = '100%';

    // NOTE: In standards mode, the SVG must have block layout
    // in order for the container DIV to not show scrollbars.
    root.style.display = 'block';
    root.appendChild(this.canvas);

    var defs = document.createElementNS(mxConstants.NS_SVG, 'defs')
    defs.innerHTML = "        <linearGradient id=\"line-gradient-blue\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n" +
        "            <stop offset=\"0%\" stop-color=\"#4A67F4\"></stop>\n" +
        "            <stop offset=\"100%\" stop-color=\"#99DDFF\"></stop>\n" +
        "        </linearGradient>\n" +
        "\n" +
        "        <linearGradient id=\"line-gradient-purple\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n" +
        "            <stop offset=\"0%\" stop-color=\"#4A67F4\"></stop>\n" +
        "            <stop offset=\"100%\" stop-color=\"#9966FF\"></stop>\n" +
        "        </linearGradient>\n" +
        "\n" +
        "        <linearGradient id=\"line-gradient-pink\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n" +
        "            <stop offset=\"0%\" stop-color=\"#9966FF\"></stop>\n" +
        "            <stop offset=\"100%\" stop-color=\"#FF66B2\"></stop>\n" +
        "        </linearGradient>\n" +
        "\n" +
        "        <linearGradient id=\"line-gradient-orange\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n" +
        "            <stop offset=\"0%\" stop-color=\"#FF66B2\"></stop>\n" +
        "            <stop offset=\"100%\" stop-color=\"#FF9999\"></stop>\n" +
        "        </linearGradient>\n"

    root.appendChild(defs);


    // Workaround for scrollbars in IE11 and below
    if (mxClient.IS_IE || mxClient.IS_IE11)
    {
        root.style.overflow = 'hidden';
    }

    if (container != null)
    {
        container.appendChild(root);
        this.updateContainerStyle(container);
    }
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
 * Function: applyCustomSetting
 *
 * Creates custom stylesheets.
 */
mxGraph.prototype.applyCustomSetting = function () {
    mxConstants.VERTEX_SELECTION_COLOR = "#2D49D7";
    mxConstants.VERTEX_SELECTION_DASHED = false;
    mxConstants.VERTEX_SELECTION_STROKEWIDTH = 2;



    // Стили для ребра
    mxMarker.addMarker('circle', function (canvas, shape, type, pe, unitX, unitY, size, source, sw, filled) {
        var a = size / 2;

        var pt = pe.clone();
        pe.x -= unitX * a;
        pe.y -= unitY * a;

        return function () {
            canvas.state.fillColor = "#FFFFFF"
            canvas.state.strokeWidth = 3

            canvas.ellipse(pt.x - a, pt.y - a, size, size);

            if (filled) {
                canvas.fillAndStroke();
            } else {
                canvas.stroke();
            }
        };
    })

    let style = {};
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
    style[mxConstants.STYLE_ROUNDED] = 1;
    style[mxConstants.STYLE_STROKECOLOR] = '#2D49D7';
    style[mxConstants.STYLE_STROKEWIDTH] = 2;
    style[mxConstants.STYLE_ENDSIZE] = 15;
    style[mxConstants.STYLE_STARTSIZE] = 15;
    style[mxConstants.STYLE_ENDARROW] = 'circle';
    style[mxConstants.STYLE_STARTARROW] = 'circle';


    this.getStylesheet().putCellStyle('edge:1', style);


    style = {};
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
    style[mxConstants.STYLE_DASHED] = 1;
    style[mxConstants.STYLE_ROUNDED] = 1;
    style[mxConstants.STYLE_STROKECOLOR] = '#B2002F';
    style[mxConstants.STYLE_STROKEWIDTH] = 2;
    style[mxConstants.STYLE_ENDSIZE] = 15;
    style[mxConstants.STYLE_STARTSIZE] = 15;

    this.getStylesheet().putCellStyle('edge:2', style);


    // Стили для свернутой контейнера
    style = {};
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EntityPerimeter;
    style[mxConstants.STYLE_FILLCOLOR] = '#0A1650';
    style[mxConstants.STYLE_ROUNDED] = 1;
    style[mxConstants.STYLE_ABSOLUTE_ARCSIZE] = 1;
    style[mxConstants.STYLE_ARCSIZE] = "60";
    style[mxConstants.STYLE_FONTSIZE] = "14";
    style[mxConstants.STYLE_FONTCOLOR] = "#FFFFFF";
    style[mxConstants.STYLE_OVERFLOW] = 'fill';

    this.getStylesheet().putCellStyle('collapsedVertex', style);


    // Стили для развернутой контейнера
    style = {};
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EntityPerimeter;
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = 'url(#line-gradient-blue)';
    style[mxConstants.STYLE_STROKEWIDTH] = 2;
    style[mxConstants.STYLE_ROUNDED] = 1;
    style[mxConstants.STYLE_ABSOLUTE_ARCSIZE] = 1;
    style[mxConstants.STYLE_ARCSIZE] = "16";
    style[mxConstants.STYLE_FONTSIZE] = "14";
    style[mxConstants.STYLE_FONTCOLOR] = "#24293D";
    style[mxConstants.STYLE_OVERFLOW] = 'fill';

    this.getStylesheet().putCellStyle('vertex:1', style);


    style = {};
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EntityPerimeter;
    style[mxConstants.STYLE_FILLCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_STROKECOLOR] = 'url(#line-gradient-purple)';
    style[mxConstants.STYLE_STROKEWIDTH] = 2;
    style[mxConstants.STYLE_ROUNDED] = 1;
    style[mxConstants.STYLE_ABSOLUTE_ARCSIZE] = 1;
    style[mxConstants.STYLE_ARCSIZE] = "16";
    style[mxConstants.STYLE_FONTSIZE] = "14";
    style[mxConstants.STYLE_FONTCOLOR] = "#24293D";
    style[mxConstants.STYLE_OVERFLOW] = 'fill';

    this.getStylesheet().putCellStyle('vertex:2', style);
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
    let styleName = this.model.getStyle(cell);
    let style = null;

    // Gets the default style for the cell
    if (this.model.isEdge(cell)) {
        style = this.getStylesheet().getCellStyle(`edge:${cell.type ? cell.type : 1}`);
    } else {
        if (this.model.isCollapsed(cell)) {
            style = this.getStylesheet().getCellStyle('collapsedVertex');
        } else {
            style = this.getStylesheet().getCellStyle(`vertex:${cell.type}`)
        }
    }

    // Resolves the style name using the above as the default
    if (styleName != null) {
        style = this.postProcessCellStyle(this.stylesheet.getCellStyle(styleName, style));
    }

    // Returns a non-null value if no style can be found
    if (style == null) {
        style = {};
    }

    return style;
};


/**
 * Function: isCellResizable
 *
 * Returns true if the given cell is resizable. This returns
 * <cellsResizable> for all given cells if <isCellLocked> does not return
 * true for the given cell and its style does not specify
 * <mxConstants.STYLE_RESIZABLE> to be 0.
 *
 * Parameters:
 *
 * cell - <mxCell> whose resizable state should be returned.
 */
mxGraph.prototype.isCellResizable = function (cell) {
    var style = this.getCurrentCellStyle(cell);

    return this.isCellsResizable() && !this.isCellLocked(cell) &&
        !this.isCellCollapsed(cell) &&
        mxUtils.getValue(style, mxConstants.STYLE_RESIZABLE, '1') != '0';
};


/**
 * Function: createShape
 *
 * Creates and returns the highlight shape for the given state.
 */
mxCellHighlight.prototype.createShape = function () {
    let shape = this.graph.cellRenderer.createShape(this.state);

    shape.svgStrokeTolerance = this.graph.tolerance;
    shape.points = this.state.absolutePoints;
    shape.apply(this.state);
    shape.stroke = this.highlightColor;
    shape.opacity = this.opacity;
    shape.isDashed = this.dashed;
    shape.isShadow = false;

    shape.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML : mxConstants.DIALECT_SVG;
    shape.init(this.graph.getView().getOverlayPane());
    mxEvent.redirectMouseEvents(shape.node, this.graph, this.state);

    if (this.graph.dialect != mxConstants.DIALECT_SVG) {
        shape.pointerEvents = false;
    } else {
        shape.svgPointerEvents = 'stroke';
    }

    return shape;
};


/**
 * Function: createSelectionShape
 *
 * Creates the shape used to draw the selection border.
 */
mxVertexHandler.prototype.createSelectionShape = function (bounds) {
    var shape = new mxRectangleShape(mxRectangle.fromRectangle(bounds), null, this.getSelectionColor());

    shape.strokewidth = this.getSelectionStrokeWidth();
    shape.isDashed = this.isSelectionDashed();

    shape.apply(this.state);

    // shape.isRounded = this.state.style.rounded;
    //
    // shape.style = new Object()
    //
    // shape.style.absoluteArcSize = this.state.style.absoluteArcSize;
    // shape.style.arcSize = this.state.style.arcSize ;

    return shape;
};