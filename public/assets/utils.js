var todoFigure = function (svg) {
    svg.append("rect")
        .classed("figure-rect", true)
        .attrs({"x": 10, "y": 10, "width": 724, "height": 480})
        .style("stroke", "red");
    svg.append("text")
        .classed("figure-text", true)
        .attrs({"x": 372, "y": 250, "dy": "0.4em", "text-anchor": "middle"})
        .style("fill", "red")
        .text("TODO: WRITEME");
};

var figureArrow = function (selection, orientation, x1, y1, x2, y2) {
    var group = selection.append("g");
    group.append("line")
        .classed("figure-line", true)
        .attrs({"x1": x1, "y1": y1, "x2": x2, "y2": y2});
    var dString;
    switch (orientation) {
        case "left":
            dString = "M0,0a27.2,27.2,0,0,0,7.69-4.28L6.14,0l1.55,4.28A27.18,27.18,0,0,0,0,0Z";
            break;
        case "right":
            dString = "M0,0a27.2,27.2,0,0,0-7.69,4.28L-6.14,0l-1.55-4.28A27.18,27.18,0,0,0,0,0Z";
            break;
        case "up":
            dString = "M0,0a27.2,27.2,0,0,0,4.28,7.69L0,6.14l-4.28,1.55A27.17,27.17,0,0,0,0,0Z";
            break;
        case "down":
            dString = "M0,0a27.2,27.2,0,0,0-4.28-7.69l4.28,1.55,4.28-1.55A27.18,27.18,0,0,0,0,0Z";
            break;
        default:
            dString = "M0,0a27.2,27.2,0,0,0-7.69,4.28L-6.14,0l-1.55-4.28A27.18,27.18,0,0,0,0,0Z";
    }
    group.append("path")
        .classed("figure-path", true)
        .attr("d", dString)
        .attr("transform", "translate(" + x2 + "," + y2 + ")");
    return group;
};

var figureLayer = function (selection, x, y, width, height, caption) {
    var xText = width / 2;
    var yText = height / 2;
    var group = selection.append("g")
        .attr("transform", "translate(" + x + " " + y + ")");
    group.append("rect")
        .classed("figure-rect figure-rounded", true)
        .attrs({"x": 0, "y": 0, "width": width, "height": height})
        .style("fill", "#fff")
        .style("fill-opacity", 0.8);
    group.append("text")
        .classed("figure-text", true)
        .attrs({"x": xText, "y": yText, "dy": "0.4em", "text-anchor": "middle",
                "transform": "rotate(270 " + xText + " " + yText + ")"})
        .text(caption);
    return group;
};

var figureNetwork = function(selection, x, y, width, height, caption) {
    var group = selection.append("g")
        .attr("transform", "translate(" + x + " " + y + ")");
    group.append("rect")
        .attrs({"x": 0, "y": 0, "rx": 10, "ry": 10, "width": width, "height": height})
        .style("fill", "#f0f0f5");
    group.append("text")
        .classed("figure-text", true)
        .attrs({"x": width / 2, "y": height + 10, "dy": "0.4em",
                "text-anchor": "middle"})
        .text(caption);
    return group
};
