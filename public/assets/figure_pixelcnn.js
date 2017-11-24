function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("figure.figure#pixelcnn-diagram").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-element, .figure-group, .figure-line, .figure-path")
            .style("fill", null)
            .style("stroke", null);
        svg.selectAll(".figure-text").style("font-size", null);

        // --- Hoverable content ----------------------------------------------
        svg.selectAll(".figure-path.figure-film-generator")
            .style("fill", "#f44336");
        svg.select("g.film-generator")
            .on("mouseenter", function () {
                d3.select(this).select("g.film-generator > text")
                    .text("FiLM generator");
                svg.selectAll("g.film-generator > .figure-film-generator")
                    .style("fill", "#ef9a9a");
            })
            .on("mouseleave", function () {
                d3.select(this).select("g.film-generator > text")
                    .text("linear");
                svg.selectAll("g.film-generator > .figure-film-generator")
                    .style("fill", null);
            });

        svg.select("g.film-layer")
            .on("mouseenter", function () {
                svg.selectAll("g.film-layer > text")
                    .text("FiLM layer");
                svg.selectAll("g.film-layer > .figure-film-layer")
                    .style("fill", "#ffcc80");
            })
            .on("mouseleave", function () {
                svg.selectAll("g.film-layer > text")
                    .text("conditional bias");
                svg.selectAll("g.film-layer > .figure-film-layer")
                    .style("fill", null);
            });

        svg.select("g.filmed-network")
            .on("mouseenter", function () {
                d3.select(this).select("g.filmed-network > text")
                    .text("FiLM-ed layer");
                d3.select(this).select("g.filmed-network > .figure-filmed-network")
                    .style("fill", "#90caf9");
            })
            .on("mouseleave", function () {
                d3.select(this).select("g.filmed-network > text")
                    .text("PixelCNN layer");
                d3.select(this).select("g.filmed-network > .figure-filmed-network")
                    .style("fill", null);
            });
    }

    d3.xml("assets/pixelcnn.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("figure.figure#pixelcnn-diagram").each(function () {
            this.insertBefore(xml.documentElement, this.firstChild);
        });
        styleFigure();
    });
}

buildFigure();
