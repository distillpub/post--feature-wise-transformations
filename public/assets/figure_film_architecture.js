function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("figure.figure#film-architecture-diagram").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-element, .figure-group, .figure-line, .figure-path")
            .style("fill", null)
            .style("stroke", null);
        svg.selectAll(".figure-text").style("font-size", null);

        // --- Hoverable content ----------------------------------------------
        svg.selectAll("g.film-generator")
            .on("mouseenter", function () {
                d3.select(this).select("g.film-generator > rect")
                    .style("fill", "#ef9a9a");
            })
            .on("mouseleave", function () {
                d3.select(this).select("g.film-generator > rect")
                    .style("fill", null)
            });

        svg.selectAll("g.film-layer")
            .on("mouseenter", function () {
                svg.selectAll("g.film-layer > rect")
                    .style("fill", "#ffcc80");
            })
            .on("mouseleave", function () {
                svg.selectAll("g.film-layer > rect")
                    .style("fill", null)
            });

        svg.selectAll("g.filmed-network")
            .on("mouseenter", function () {
                d3.select(this).select("g.filmed-network > rect")
                    .style("fill", "#90caf9");
            })
            .on("mouseleave", function () {
                d3.select(this).select("g.filmed-network > rect")
                    .style("fill", null)
            });
    }

    d3.xml("assets/film_architecture.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("figure.figure#film-architecture-diagram").each(function () {
            this.insertBefore(xml.documentElement, this.firstChild);
        });
        styleFigure();
    });
}

buildFigure();
