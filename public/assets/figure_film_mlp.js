var buildFigure = function () {
    // --- Create group element -----------------------------------------------
    var group = d3.select("div.figure#film-diagram").select("svg")
      .append("g")
        .attrs({"id": "mlp", "visibility": "visible"});

    // --- Create data --------------------------------------------------------
    // Features
    var features = [30, 200, 100, 230];

    // Scaling and shifting coefficients
    var gamma = [1.6, 0.2, 2.0, 0.0];
    var beta = [-25, 100, -100, 0];

    // Helper function to convert a feature value to RGB string representation
    var toRGB = function (value, scale, shift) {
        var intensity = Math.min(
            Math.max(Math.floor(scale * value + shift), 0),
            255
        );
        return "rgb(" + intensity + ", " + intensity + ", " + intensity + ")";
    };

    // Format data to be D3-friendly
    var data = [];
    for (var i = 0; i < 4; i++) {
        data.push({
            index: i,
            color: toRGB(features[i], 1, 0),
            scaledColor: toRGB(features[i], gamma[i], 0),
            scaledShiftedColor: toRGB(features[i], gamma[i], beta[i]),
        });
    }

    // --- Create figure elements ---------------------------------------------
    // Conditioning information label
    var staticConditioningLabel = group.append("text")
        .classed("figure-text", true)
        .attrs({"x": 10, "y": 240, "text-anchor": "left", "opacity": 1})
        .text("Conditioning");
    var conditioningLabel = group.append("text")
        .classed("figure-text", true)
        .attrs({"x": 10, "y": 240, "text-anchor": "left", "opacity": 1})
        .text("Conditioning");

    // FiLM-generator box
    var filmGenerator = group.append("rect")
        .classed("figure-rect figure-rounded", true)
        .attrs({"x": 150, "y": 100, "width": 150, "height": 300});
    figureArrow(group, "right", 10, 250, 150, 250);
    figureArrow(group, "right", 300, 296.5, 341, 296.5);
    figureArrow(group, "right", 300, 164.5, 341, 164.5);

    // FiLM-generator label
    var filmGeneratorLabel = group.append("text")
        .classed("figure-text", true)
        .attrs({"x": 225, "y": 430, "text-anchor": "middle"})
        .text("FiLM generator");

    // Scaling
    var scaling = group.append("g")
        .attr("transform", "translate(341, 281.5)")
      .selectAll("rect")
        .data(gamma)
      .enter().append("rect")
        .classed("figure-rect", true)
        .attrs({
            "width": 30, "height": 30,
            "transform": function(d, i) {
                return "translate(" + 30 * i +  ", 0)";
            }
        })
        .style("fill", "white");

    // Shifting
    var shifting = group.append("g")
        .attr("transform", "translate(341, 149.5)")
      .selectAll("rect")
        .data(beta)
      .enter().append("rect")
        .classed("figure-rect", true)
        .attrs({
            "width": 30, "height": 30,
            "transform": function(d, i) {
                return "translate(" + 30 * i +  ", 0)";
            }
        })
        .style("fill", "white");

    // Scaling operator
    var scalingOperator = group.append("g")
        .attr("opacity", 0);
    scalingOperator.append("circle")
        .classed("figure-circle", true)
        .attrs({"cx": 500, "cy": 296.5, "r": 15});
    scalingOperator.append("circle")
        .classed("figure-circle", true)
        .attrs({"cx": 500, "cy": 296.5, "r": 1});

    // Shifting operator
    var shiftingOperator = group.append("g")
        .attr("opacity", 0);
    shiftingOperator.append("circle")
        .classed("figure-circle", true)
        .attrs({"cx": 500, "cy": 164.5, "r": 15});
    shiftingOperator.append("line")
        .classed("figure-line", true)
        .attrs({"x1": 493, "y1": 164.5, "x2": 507, "y2": 164.5});
    shiftingOperator.append("line")
        .classed("figure-line", true)
        .attrs({"x1": 500, "y1": 157.5, "x2": 500, "y2": 171.5});

    // Helper function to create a group element containing the feature
    // rectangles.
    var createFeatureVector = function () {
        var featureVector = group.append("g");
        featureVector
          .selectAll("rect")
            .data(data)
          .enter().append("rect")
            .classed("figure-rect", true)
            .attrs({
                "x": 0, "y": 0, "width": 45, "height": 45,
                "transform": function(d) {
                    return "translate(" + 45 *  d.index +  ", 0)";
                }
            })
            .style("fill", function(d) { return d.color; });
        return featureVector;
    }

    // Input feature maps
    createFeatureVector()
        .attr("transform", "translate(539, 406)");
    // Output feature maps
    createFeatureVector()
        .attr("transform", "translate(539, 10)")
      // Output feature map is blank
      .selectAll("rect")
        .style("fill", "white");
    var featureVector = createFeatureVector()
        .attr("transform", "translate(539, 406)");

    // --- Animate figure elements --------------------------------------------
    var loopFunction = function() {
        // Animate feature vector group
        featureVector
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

        // Animate feature rectangles
        featureVector.selectAll("rect")
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
                    .attr("opacity", 1);
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
