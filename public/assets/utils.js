var todoFigure = function (svg) {
    svg.append("rect")
        .attrs({"x": 10, "y": 10, "width": 724, "height": 480})
        .style("fill", "white")
        .style("stroke", "red")
        .style("stroke-width", 2);
    svg.append("text")
        .classed("label", true)
        .attrs({"x": 372, "y": 250, "dy": "0.4em", "text-anchor": "middle"})
        .style("fill", "red")
        .text("TODO: WRITEME");
};
