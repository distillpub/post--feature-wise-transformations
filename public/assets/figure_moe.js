function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("figure.figure#moe-diagram").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-element, .figure-group, .figure-line, .figure-path")
            .style("fill", null)
            .style("stroke", null);
        svg.selectAll(".figure-text").style("font-size", null);
    }

    d3.xml("assets/moe.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("figure.figure#moe-diagram").each(function () {
            this.insertBefore(xml.documentElement, this.firstChild);
        });
        styleFigure();
    });
}

buildFigure();
