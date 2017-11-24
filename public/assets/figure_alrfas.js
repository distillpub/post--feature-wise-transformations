function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("figure.figure#alrfas-diagram").select("svg");

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
                d3.select(this).select("g.film-generator > text")
                    .text("FiLM generator");
                d3.select(this).select("g.film-generator > rect")
                    .style("fill", "#ef9a9a");
            })
            .on("mouseleave", function () {
                d3.select(this).select("g.film-generator > text")
                    .text("style prediction network");
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
                    .text("style transfer network");
                d3.select(this).select("g.filmed-network > rect")
                    .style("fill", null)
            });
    }

    d3.xml("assets/alrfas.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("figure.figure#alrfas-diagram").each(function () {
            this.insertBefore(xml.documentElement, this.firstChild);
        });
        styleFigure();
    });
}

buildFigure();
