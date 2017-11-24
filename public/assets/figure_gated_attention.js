function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("figure.figure#gated-attention-diagram").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-element, .figure-group, .figure-line, .figure-path")
            .style("fill", null)
            .style("stroke", null);
        svg.selectAll(".figure-text").style("font-size", null);

        // --- Hoverable content ----------------------------------------------
        svg.selectAll("path.figure-film-generator")
            .style("fill", "#f44336")
            .style("stroke", "#f44336");
        svg.selectAll("g.film-generator")
            .on("mouseenter", function () {
                d3.select(this).select("g.film-generator > text")
                    .text("FiLM generator");
                svg.selectAll("g.film-generator > .figure-film-generator")
                    .style("fill", "#ef9a9a");
            })
            .on("mouseleave", function () {
                d3.select(this).select("g.film-generator > text")
                    .text("");
                svg.selectAll("g.film-generator > .figure-film-generator")
                    .style("fill", null);
            });

        svg.select("g.film-layer")
            .on("mouseenter", function () {
                d3.select(this).select("g.film-layer > text")
                    .text("FiLM layer");
                d3.select(this).select("g.film-layer > .figure-film-layer")
                    .style("fill", "#ffcc80");
            })
            .on("mouseleave", function () {
                d3.select(this).select("g.film-layer > text")
                    .text("");
                d3.select(this).select("g.film-layer > .figure-film-layer")
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
                    .text("gated-attention multimodal fusion unit");
                svg.selectAll("g.filmed-network > .figure-filmed-network")
                    .style("fill", null);
            });
    }

    d3.xml("assets/gated_attention.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("figure.figure#gated-attention-diagram").each(function () {
            this.insertBefore(xml.documentElement, this.firstChild);
        });
        styleFigure();
    });
}

buildFigure();
