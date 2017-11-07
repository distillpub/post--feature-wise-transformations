var buildFigure = function () {
    // --- Create svg element -------------------------------------------------
    var svg = d3.select("div.figure#film-diagram")
      .append("svg")
        // Width corresponds to the width of the body-outset class (744px)
        .attr("viewBox", "0 0 744 500");

    // --- Create UI elements -------------------------------------------------
    // MLP button
    var mlpButton = svg.append("g")
        .attr("id", "mlp-button")
        .on("click", function () {
            svg.select("g#mlp-button")
              .select("rect")
                .style("fill", "#f0f0f0");
            svg.select("g#mlp").attr("visibility", "visible");

            svg.select("g#cnn-button")
              .select("rect")
                .style("fill", "none");
            svg.select("g#cnn").attr("visibility", "hidden");

            svg.select("g#architecture-button")
              .select("rect")
                .style("fill", "none");
            svg.select("g#architecture").attr("visibility", "hidden");
        });
    mlpButton.append("rect")
        .classed("figure-rect figure-rounded", true)
        .attrs({"x": 10, "y": 450, "width": 100, "height": 40})
        .style("fill", "f0f0f0");
    mlpButton.append("text")
        .classed("figure-text", true)
        .attrs({"x": 60, "y": 470, "dy": "0.4em", "text-anchor": "middle"})
        .text("MLP");

    // CNN button
    cnnButton = svg.append("g")
        .attr("id", "cnn-button")
        .on("click", function () {
            svg.select("g#mlp-button")
              .select("rect")
                .style("fill", "none");
            svg.select("g#mlp").attr("visibility", "hidden");

            svg.select("g#cnn-button")
              .select("rect")
                .style("fill", "#f0f0f0");
            svg.select("g#cnn").attr("visibility", "visible");

            svg.select("g#architecture-button")
              .select("rect")
                .style("fill", "none");
            svg.select("g#architecture").attr("visibility", "hidden");
        });
    cnnButton.append("rect")
        .classed("figure-rect figure-rounded", true)
        .attrs({"x": 120, "y": 450, "width": 100, "height": 40})
    cnnButton.append("text")
        .classed("figure-text", true)
        .attrs({"x": 170, "y": 470, "dy": "0.4em", "text-anchor": "middle"})
        .text("CNN");

    // Architecture button
    architectureButton = svg.append("g")
        .attr("id", "architecture-button")
        .on("click", function () {
            svg.select("g#mlp-button")
              .select("rect")
                .style("fill", "none");
            svg.select("g#mlp").attr("visibility", "hidden");

            svg.select("g#cnn-button")
              .select("rect")
                .style("fill", "none");
            svg.select("g#cnn").attr("visibility", "hidden");

            svg.select("g#architecture-button")
              .select("rect")
                .style("fill", "#f0f0f0");
            svg.select("g#architecture").attr("visibility", "visible");
        });
    architectureButton.append("rect")
        .classed("figure-rect figure-rounded", true)
        .attrs({"x": 230, "y": 450, "width": 100, "height": 40});
    architectureButton.append("text")
        .classed("figure-text", true)
        .attrs({"x": 280, "y": 470, "dy": "0.4em", "text-anchor": "middle"})
        .text("All");
};

buildFigure();
