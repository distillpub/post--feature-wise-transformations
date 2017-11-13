function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("div.figure#film-architecture-diagram").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-layer").style("fill", null);
        svg.selectAll(".figure-network").style("fill", null);
        svg.selectAll(".figure-text").style("font-size", null);
        svg.selectAll(".figure-line").style("stroke", null);
        svg.selectAll(".figure-path").style("fill", null);
    }

    d3.xml("assets/film_architecture.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("div.figure#film-architecture-diagram").each(function () {
            this.appendChild(xml.documentElement);
        });
        styleFigure();
    });
}

buildFigure();
