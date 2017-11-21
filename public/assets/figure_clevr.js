function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("figure.figure#clevr-diagram").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-element, .figure-group, .figure-line, .figure-path")
            .style("fill", null)
            .style("stroke", null);
        svg.selectAll(".figure-text").style("font-size", null);

        // --- Create figure elements -----------------------------------------
        // Input image
        svg.append("image")
            .attrs({
                "width": 144, "height": 96,
                "x": svg.select("#image-placeholder").attr("x"),
                "y": svg.select("#image-placeholder").attr("y"),
                "href": "assets/clevr_input.jpg",
            });
    }

    d3.xml("assets/clevr.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("figure.figure#clevr-diagram").each(function () {
            this.insertBefore(xml.documentElement, this.firstChild);
        });
        styleFigure();
    });
}

buildFigure();
