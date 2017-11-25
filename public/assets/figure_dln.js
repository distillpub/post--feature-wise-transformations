function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("figure.figure#dln-diagram").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-element, .figure-group, .figure-line, .figure-path")
            .style("fill", null)
            .style("stroke", null);
        svg.selectAll(".figure-text").style("font-size", null);

        // --- Hoverable content ----------------------------------------------
        svg.selectAll("g.film-generator")
            .on("mouseenter", function () {
                svg.selectAll("g.film-generator > text")
                    .text("FiLM gen.");
                svg.selectAll("g.film-generator > .figure-film-generator")
                    .style("fill", "#ef9a9a");
            })
            .on("mouseleave", function () {
                svg.select("#film-gen-linear > text")
                    .text("linear");
                svg.select("#film-gen-utt-sum > text")
                    .text("utt. sum.");
                svg.selectAll("g.film-generator > .figure-film-generator")
                    .style("fill", null);
            });

        svg.select("g.film-layer")
            .on("mouseenter", function () {
                svg.selectAll("g.film-layer > text")
                    .text("FiLM");
                svg.selectAll("g.film-layer > .figure-film-layer")
                    .style("fill", "#ffcc80");
            })
            .on("mouseleave", function () {
                svg.selectAll("g.film-layer > text")
                    .text("affine");
                svg.selectAll("g.film-layer > .figure-film-layer")
                    .style("fill", null);
            });

        svg.select("g.filmed-network")
            .on("mouseenter", function () {
                d3.select(this).select("g.filmed-network > text")
                    .text("FiLM-ed layer");
                svg.selectAll("g.filmed-network > .figure-filmed-network")
                    .style("fill", "#90caf9");
            })
            .on("mouseleave", function () {
                d3.select(this).select("g.filmed-network > text")
                    .text("LSTM layer");
                svg.selectAll("g.filmed-network > .figure-filmed-network")
                    .style("fill", null);
            });
    }

    d3.xml("assets/dln.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("figure.figure#dln-diagram").each(function () {
            this.insertBefore(xml.documentElement, this.firstChild);
        });
        styleFigure();
    });
}

buildFigure();
