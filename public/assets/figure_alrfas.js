var buildFigure = function () {
    // --- Create svg element -------------------------------------------------
    var svg = d3.select("div.figure#alrfas-diagram")
      .append("svg")
        // Width corresponds to the width of the body-outset class (744px)
        .attr("viewBox", "0 0 744 500");

    // --- Create figure elements ---------------------------------------------
    // Content image
    svg.append("image")
        .attrs({
            "width": 96, "height": 96, "x": 10, "y": 10,
            "href": "assets/tuebingen_neckarfront.jpg"
        });

    // Stylized image
    svg.append("image")
        .attrs({
            "width": 96, "height": 96, "x": 606, "y": 186,
            "href": "assets/tuebingen_neckarfront_cassis_cap_lombard_opus_196.jpg"
        });

    // Style image
    svg.append("image")
        .attrs({
            "width": 96, "height": 96, "x": 10, "y": 362,
            "href": "assets/cassis_cap_lombard_opus_196.jpg"
        });

    // FiLM-generator box
    svg.append("rect")
        .attrs({"x": 150, "y": 10, "rx": 10, "ry": 10, "width": 400, "height": 300})
        .style("fill", "#f0f0f5");
    svg.append("rect")
        .classed("figure-rect figure-rounded", true)
        .attrs({"x": 160, "y": 20, "width": 50, "height": 280})
        .style("fill", "#fff")
        .style("fill-opacity", 0.8);
    svg.append("text")
        .classed("figure-text", true)
        .attrs({"x": 300, "y": 45, "text-anchor": "middle"})
        .text("FiLM generator");
};

buildFigure();
