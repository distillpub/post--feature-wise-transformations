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

        // --- Hoverable content ----------------------------------------------
        svg.select("g.film-generator")
            .on("mouseenter", function () {
                d3.select(this).select("g.film-generator > text")
                    .text("FiLM generator");
                d3.select(this).select("g.film-generator > rect")
                    .style("fill", "#ef9a9a");
            })
            .on("mouseleave", function () {
                d3.select(this).select("g.film-generator > text")
                    .text("linguistic pipeline");
                d3.select(this).select("g.film-generator > rect")
                    .style("fill", null)
            });

        svg.selectAll("g.film-layer")
            .on("mouseenter", function () {
                svg.selectAll("g.film-layer").select("g.film-layer > text")
                    .text("FiLM layer");
                svg.selectAll("g.film-layer").select("g.film-layer > rect")
                    .style("fill", "#ffcc80");
            })
            .on("mouseleave", function () {
                svg.selectAll("g.film-layer").select("g.film-layer > text")
                    .text("affine transformation");
                svg.selectAll("g.film-layer").select("g.film-layer > rect")
                    .style("fill", null)
            });

        svg.select("g.filmed-network")
            .on("mouseenter", function () {
                d3.select(this).select("g.filmed-network > text")
                    .text("FiLM-ed network");
                d3.select(this).select("g.filmed-network > rect")
                    .style("fill", "#90caf9");
            })
            .on("mouseleave", function () {
                d3.select(this).select("g.filmed-network > text")
                    .text("visual pipeline");
                d3.select(this).select("g.filmed-network > rect")
                    .style("fill", null)
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
