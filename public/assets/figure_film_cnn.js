var buildFigure = function () {
    // --- Create group element -----------------------------------------------
    var group = d3.select("div.figure#film-diagram").select("svg")
      .append("g")
        .attrs({"id": "cnn", "visibility": "hidden"});

    // --- Create data --------------------------------------------------------
    // Input image, in [h, w, c] format
    var image = [[[148,134,128],[136,120,110],[154,139,132],[115,109,115]],
                 [[126,120,130],[167,147,137],[145,122,110],[110, 98,100]],
                 [[134,116,109],[139,108, 90],[129,102, 90],[153,130,114]],
                 [[158,142,138],[166,152,154],[124,112,119],[169,159,164]]];

    // Scaling and shifting coefficients
    var gamma = [1.6, 0.2, 2.0];
    var beta = [-25, 100, -100];

    // Helper function to convert a pixel value to RGB string representation
    var toRGB = function (k, value, scale, shift) {
        var intensity = Math.min(
            Math.max(Math.floor(scale * value + shift), 0),
            255
        );
        switch (k) {
            case 0: return "rgb(0, 0, " + intensity + ")";
            case 1: return "rgb(0, " + intensity + ", 0)";
            case 2: return "rgb(" + intensity + ", 0, 0)";
        }
    };

    // Format data to be D3-friendly
    var data = [];
    for (var n = 0; n < 48; n++) {
        var i = Math.floor(n / 12);
        var j = Math.floor(n / 3) % 4;
        var k = n % 3;

        data.push({
            coordinates: [i, j, k],
            color: toRGB(k, image[i][j][k], 1, 0),
            scaledColor: toRGB(k, image[i][j][k], gamma[k], 0),
            scaledShiftedColor: toRGB(k, image[i][j][k], gamma[k], beta[k]),
        });
    }

    // --- Create figure elements ---------------------------------------------
    // Conditioning information label
    var staticConditioningLabel = group.append("text")
        .classed("figure-text", true)
        .attrs({"x": 10, "y": 240, "text-anchor": "left"})
        .text("Conditioning");
    var conditioningLabel = group.append("text")
        .classed("figure-text", true)
        .attrs({"x": 10, "y": 240, "text-anchor": "left", "opacity": 0.6})
        .text("Conditioning");

    // FiLM-generator box
    var filmGenerator = group.append("rect")
        .classed("figure-rect figure-rounded", true)
        .attrs({"x": 150, "y": 100, "width": 150, "height": 300});
    figureRightArrow(group, "right", 10, 250, 150, 250);
    figureRightArrow(group, "right", 300, 315, 420, 315);
    figureRightArrow(group, "right", 300, 185, 420, 185);

    // FiLM-generator label
    var filmGeneratorLabel = group.append("text")
        .classed("figure-text", true)
        .attrs({"x": 225, "y": 430, "text-anchor": "middle"})
        .text("FiLM generator");

    // Scaling
    var scaling = group.append("g")
      .selectAll("rect")
        .data(gamma)
      .enter().append("rect")
        .classed("figure-rect", true)
        .attrs({"x": 420, "width": 30, "height": 30,
                "y": function(d, i) { return 270 + 30 * (2 - i); }})
        .style("fill", "white");

    // Shifting
    var shifting = group.append("g")
      .selectAll("rect")
        .data(beta)
      .enter().append("rect")
        .classed("figure-rect", true)
        .attrs({"x": 420, "width": 30, "height": 30,
                "y": function(d, i) { return 140 + 30 * (2 - i); }})
        .style("fill", "white");

    // Scaling operator
    var scalingOperator = group.append("g")
        .attr("opacity", 0);
    scalingOperator.append("circle")
        .classed("figure-circle", true)
        .attrs({"cx": 500, "cy": 315, "r": 15});
    scalingOperator.append("circle")
        .classed("figure-circle", true)
        .attrs({"cx": 500, "cy": 315, "r": 1});

    // Shifting operator
    var shiftingOperator = group.append("g")
        .attr("opacity", 0);
    shiftingOperator.append("circle")
        .classed("figure-circle", true)
        .attrs({"cx": 500, "cy": 185, "r": 15});
    shiftingOperator.append("line")
        .classed("figure-line", true)
        .attrs({"x1": 493, "y1": 185, "x2": 507, "y2": 185});
    shiftingOperator.append("line")
        .classed("figure-line", true)
        .attrs({"x1": 500, "y1": 178, "x2": 500, "y2": 192});

    // Helper function to create a group element containing the feature map
    // polygons.
    var createFeatureMaps = function () {
        var featureMaps = group.append("g");
        featureMaps
          .selectAll("polygon")
            .data(data)
          .enter().append("polygon")
            .classed("figure-polygon", true)
            .attrs({
                "points": "15 0 45 0 30 15 0 15",
                "transform": function(d) {
                    var x = 60 - 15 * d.coordinates[1] + 30 * d.coordinates[0];
                    var y = 15 * d.coordinates[1] + 12 * (2 - d.coordinates[2]);
                    return "translate(" + x +  ", " + y + ")";
                }
            })
            .style("fill", function(d) { return d.color; });
        return featureMaps;
    }

    // Input feature maps
    createFeatureMaps()
        .attr("transform", "translate(539, 406)");
    // Output feature maps
    createFeatureMaps()
        .attr("transform", "translate(539, 10)")
      // Output feature map is blank
      .selectAll("polygon")
        .style("fill", "white");
    var featureMaps = createFeatureMaps()
        .attr("transform", "translate(539, 406)");

    // --- Animate figure elements --------------------------------------------
    var loopFunction = function() {
        // Animate feature maps group
        featureMaps
            // First transition: translate to scaling "station"
            .transition()
            .delay(1000)
            .duration(1000)
            .attr("transform", "translate(539, 274)")
            // Second transition: translate to shifting "station"
            .transition()
            .delay(1000)
            .duration(1000)
            .attr("transform", "translate(539, 142)")
            // Third transition: translate to output
            .transition()
            .delay(1000)
            .duration(1000)
            .attr("transform", "translate(539, 10)")
            // Final transition: loop back
            .transition()
            .delay(1000)
            .duration(0)
            .on("end", function() {
                d3.select(this)
                    // Replace feature maps over input
                    .attr("transform", "translate(539, 406)");
                loopFunction();
            });

        // Animate feature map polygons
        featureMaps.selectAll("polygon")
            // First transition: scale
            .transition()
            .delay(2000)
            .duration(1000)
            .style("fill", function(d) { return d.scaledColor; })
            // First transition: shift
            .transition()
            .delay(1000)
            .duration(1000)
            .style("fill", function(d) { return d.scaledShiftedColor; })
            // Final transition: loop back
            .transition()
            .delay(2000)
            .duration(0)
            .on("end", function() {
                d3.select(this)
                    // Revert feature map colors to match input
                    .style("fill", function(d) { return d.color; });
            });

        // Animate conditioning label
        conditioningLabel
            // Translate and fade text
            .transition()
            .duration(1000)
            .attr("x", 160)
            .attr("opacity", 0)
            // Final transition: loop back
            .transition()
            .delay(6000) // Delay by 6 seconds before looping back
            .duration(0)
            .on("end", function() {
                d3.select(this)
                    .attr("x", 10)
                    .attr("opacity", 0.6);
            });

        // Animate scaling vector
        scaling
            // First transition: darken fill
            .transition()
            .duration(1000)
            .style("fill", function(d) {
                value = Math.floor(96 * d);
                return "rgb(" + value + ", " + value + ", " + value + ")";
            })
            // Final transition: loop back
            .transition()
            .delay(6000)
            .duration(0)
            .on("end", function() {
                d3.select(this)
                    .style("fill", "white");
            });

        // Animate shifting vector
        shifting
            // First transition: darken fill
            .transition()
            .duration(1000)
            .style("fill", function(d) {
                value = Math.floor(d + 100);
                return "rgb(" + value + ", " + value + ", " + value + ")";
            })
            // Final transition: loop back
            .transition()
            .delay(6000)
            .duration(0)
            .on("end", function() {
                d3.select(this)
                    .style("fill", "white");
            });

        // Animate scaling operator
        scalingOperator
            // First transition: opaque
            .transition()
            .delay(1000)
            .duration(1000)
            .attr("opacity", 1)
            // Final transition: loop back
            .transition()
            .delay(5000)
            .duration(0)
            .on("end", function() {
                d3.select(this)
                    .attr("opacity", 0);
            });

        // Animate shifting operator
        shiftingOperator
            // First transition: opaque
            .transition()
            .delay(3000)
            .duration(1000)
            .attr("opacity", 1)
            // Final transition: loop back
            .transition()
            .delay(3000)
            .duration(0)
            .on("end", function() {
                d3.select(this)
                    .attr("opacity", 0);
            });
    };

    loopFunction();
};

buildFigure();
