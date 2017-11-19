function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("figure.figure#guesswhat-diagram").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-element, .figure-group, .figure-line, .figure-path")
            .style("fill", null)
            .style("stroke", null);
        svg.selectAll(".figure-text").style("font-size", null);

        // --- Create figure elements -----------------------------------------
        // Input image
        svg.append("image")
            .attrs({
                "width": 64, "height": 64,
                "x": svg.select("#image-placeholder").attr("x"),
                "y": svg.select("#image-placeholder").attr("y"),
                "href": "assets/guesswhat_input.jpg",
            });
    }

    d3.xml("assets/guesswhat.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("figure.figure#guesswhat-diagram").each(function () {
            this.insertBefore(xml.documentElement, this.firstChild);
        });
        styleFigure();
    });
}

buildFigure();
