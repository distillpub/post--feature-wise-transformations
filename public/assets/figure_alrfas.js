function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("div.figure#alrfas-diagram").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-layer").style("fill", null);
        svg.selectAll(".figure-network").style("fill", null);
        svg.selectAll(".figure-text").style("font-size", null);
        svg.selectAll(".figure-line").style("stroke", null);
        svg.selectAll(".figure-path").style("fill", null);

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
        svg.select("g.style-transfer-network")
            .on("mouseenter", function () {
                d3.select(this).select("g.style-transfer-network > text")
                    .text("FiLM-ed network");
                d3.select(this).select("g.style-transfer-network > rect")
                    .style("fill", "#f8ed62")
                    .style("fill-opacity", 0.5)
                    .style("stroke", "#f8ed62");
            })
            .on("mouseleave", function () {
                d3.select(this).select("g.style-transfer-network > text")
                    .text("style transfer network");
                d3.select(this).select("g.style-transfer-network > rect")
                    .style("fill", null)
                    .style("fill-opacity", null)
                    .style("stroke", "#dab600");
            })
          .select("rect")
            .style("stroke", "#dab600");

        svg.select("g.style-prediction-network")
            .on("mouseenter", function () {
                d3.select(this).select("text").text("FiLM generator");
                d3.select(this).select("rect")
                    .style("fill", "#f8ed62")
                    .style("fill-opacity", 0.5)
                    .style("stroke", "#f8ed62");
            })
            .on("mouseleave", function () {
                d3.select(this).select("text").text("style prediction network");
                d3.select(this).select("rect")
                    .style("fill", null)
                    .style("fill-opacity", null)
                    .style("stroke", "#dab600");
            })
          .select("rect")
            .style("stroke", "#dab600");

        svg.selectAll("g.film-layer")
            .on("mouseenter", function () {
                d3.selectAll("g.film-layer").select("text").text("FiLM");
                d3.selectAll("g.film-layer").select("rect")
                    .style("fill", "#f8ed62")
                    .style("fill-opacity", 0.5)
                    .style("stroke", "#f8ed62");
            })
            .on("mouseleave", function () {
                d3.selectAll("g.film-layer").select("text").text("affine transformation");
                d3.selectAll("g.film-layer").select("rect")
                    .style("fill", null)
                    .style("fill-opacity", null)
                    .style("stroke", "#dab600");
            })
          .select("rect")
            .style("stroke", "#dab600");
    }

    d3.xml("assets/alrfas.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("div.figure#alrfas-diagram").each(function () {
            this.appendChild(xml.documentElement);
        });
        styleFigure();
    });
}

buildFigure();
