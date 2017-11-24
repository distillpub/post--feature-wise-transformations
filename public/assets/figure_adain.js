function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("figure.figure#adain-diagram").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-element, .figure-group, .figure-line, .figure-path")
            .style("fill", null)
            .style("stroke", null);
        svg.selectAll(".figure-text").style("font-size", null);

        // --- Create figure elements -----------------------------------------
        // Content image
        svg.append("image")
            .attrs({
                "width": 96, "height": 96,
                "x": svg.select("#content-image-placeholder").attr("x"),
                "y": svg.select("#content-image-placeholder").attr("y"),
                "href": "assets/tuebingen_neckarfront.jpg",
            });
        // Style image
        svg.append("image")
            .attrs({
                "width": 96, "height": 96,
                "x": svg.select("#style-image-placeholder").attr("x"),
                "y": svg.select("#style-image-placeholder").attr("y"),
                "href": "assets/cassis_cap_lombard_opus_196.jpg",
            });
        // Stylized image
        svg.append("image")
            .attrs({
                "width": 96, "height": 96,
                "x": svg.select("#stylized-image-placeholder").attr("x"),
                "y": svg.select("#stylized-image-placeholder").attr("y"),
                "href": "assets/tuebingen_neckarfront_cassis_cap_lombard_opus_196.jpg",
            });

        // --- Hoverable content ----------------------------------------------
        svg.select("g.film-generator")
            .on("mouseenter", function () {
                d3.select("g.filmed-network > path.figure-filmed-network")
                    .style("stroke", "none");
                d3.select(this).select("g.film-generator > text")
                    .text("FiLM generator");
                svg.selectAll("g#encoder > rect, g#adain > rect")
                    .classed("figure-film-generator", true)
                    .style("fill", "#ef9a9a");
                svg.selectAll(".figure-film-generator-edge")
                    .style("stroke", "#c62828");
                svg.selectAll(".figure-film-generator-arrow")
                    .style("fill", "#c62828")
                    .style("stroke", "#c62828");
            })
            .on("mouseleave", function () {
                d3.select("g.filmed-network > path.figure-filmed-network")
                    .style("stroke", null);
                d3.select(this).select("g.film-generator > text")
                    .text("");
                svg.selectAll("g#encoder > rect, g#adain > rect")
                    .classed("figure-film-generator", false)
                    .style("fill", null);
                svg.selectAll(".figure-film-generator-edge")
                    .style("stroke", null);
                svg.selectAll(".figure-film-generator-arrow")
                    .style("fill", null)
                    .style("stroke", null);
            });

        svg.select("g.film-layer")
            .on("mouseenter", function () {
                d3.select(this).select("g.film-layer > text")
                    .text("FiLM layer");
                d3.select(this).select("g.film-layer > rect")
                    .style("fill", "#ffcc80");
            })
            .on("mouseleave", function () {
                d3.select(this).select("g.film-layer > text")
                    .text("affine transformation");
                d3.select(this).select("g.film-layer > rect")
                    .style("fill", null)
            });

        svg.select("g.filmed-network")
            .on("mouseenter", function () {
                d3.select("g.film-generator > path.figure-film-generator")
                    .style("stroke", "none");
                d3.select(this).select("g.filmed-network > text")
                    .text("FiLM-ed network");
                svg.selectAll("g#encoder > rect, g#adain > rect, g#decoder > rect")
                    .classed("figure-filmed-network", true)
                    .style("fill", "#90caf9");
                svg.selectAll(".figure-filmed-network-edge")
                    .style("stroke", "#1e88e5");
                svg.selectAll(".figure-filmed-network-arrow")
                    .style("fill", "#1e88e5")
                    .style("stroke", "#1e88e5");
            })
            .on("mouseleave", function () {
                d3.select("g.film-generator > path.figure-film-generator")
                    .style("stroke", null);
                d3.select(this).select("g.filmed-network > text")
                    .text("");
                svg.selectAll("g#encoder > rect, g#adain > rect, g#decoder > rect")
                    .classed("figure-filmed-network", false)
                    .style("fill", null);
                svg.selectAll(".figure-filmed-network-edge")
                    .style("stroke", null);
                svg.selectAll(".figure-filmed-network-arrow")
                    .style("fill", null)
                    .style("stroke", null);
            });
    }

    d3.xml("assets/adain.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("figure.figure#adain-diagram").each(function () {
            this.insertBefore(xml.documentElement, this.firstChild);
        });
        styleFigure();
    });
}

buildFigure();
