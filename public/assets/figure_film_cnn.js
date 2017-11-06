var buildFigure = function () {
    // --- Create svg element -------------------------------------------------
    var svg = d3.select("div.figure#film-cnn")
      .append("svg")
        // Width corresponds to the width of the body-outset class (744px)
        .attr("viewBox", "0 0 744 500");

    // --- Create data --------------------------------------------------------
    // Input image, in [h, w, c] format
    var image = [[[148,134,128],[136,120,110],[154,139,132],[115,109,115]],
                 [[126,120,130],[167,147,137],[145,122,110],[110, 98,100]],
                 [[134,116,109],[139,108, 90],[129,102, 90],[153,130,114]],
                 [[158,142,138],[166,152,154],[124,112,119],[169,159,164]]];

    // Scaling and shifting coefficients
    var gamma = [1.6, 0.2, 2.0];
    var beta = [-25, 100, -100];

    // Format data to be D3-friendly
    var data = [];
    for (var n = 0; n < 48; n++) {
        var i = Math.floor(n / 12);
        var j = Math.floor(n / 3) % 4;
        var k = n % 3;

        // Tile colors (shade of red, green, or blue, depending on the feature
        // map)
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
        data.push({
            coordinates: [i, j, k],
            color: toRGB(k, image[i][j][k], 1, 0),
            scaledColor: toRGB(k, image[i][j][k], gamma[k], 0),
            scaledShiftedColor: toRGB(k, image[i][j][k], gamma[k], beta[k]),
        });
    }

    // --- Create figure elements ---------------------------------------------
    // Conditioning information label
    var staticConditioningLabel = svg.append("text")
        .attr("class", "label")
        .attr("opacity", 1)
        .attr("x", 10)
        .attr("y", 240)
        .attr("text-anchor", "left")
        .text("Conditioning");
    var conditioningLabel = svg.append("text")
        .attr("class", "label")
        .attr("opacity", 1)
        .attr("x", 10)
        .attr("y", 240)
        .attr("text-anchor", "left")
        .text("Conditioning");

    // FiLM-generator box
    svg.append("line")
        .attr("class", "edge")
        .attr("x1", 10)
        .attr("y1", 250)
        .attr("x2", 150)
        .attr("y2", 250);
    var filmGenerator = svg.append("rect")
        .attr("class", "box")
        .attr("x", 150)
        .attr("y", 100)
        .attr("width", 150)
        .attr("height", 300)
        .style("stroke-width", 3);
    svg.append("line")
        .attr("class", "edge")
        .attr("x1", 300)
        .attr("y1", 315)
        .attr("x2", 420)
        .attr("y2", 315);
    svg.append("line")
        .attr("class", "edge")
        .attr("x1", 300)
        .attr("y1", 185)
        .attr("x2", 420)
        .attr("y2", 185);

    // FiLM-generator label
    var filmGeneratorLabel = svg.append("text")
        .attr("class", "label")
        .attr("x", 225)
        .attr("y", 430) .attr("text-anchor", "middle")
        .text("FiLM generator");

    // Scaling
    var scaling = svg.append("g")
      .selectAll("rect")
        .data(gamma)
      .enter().append("rect")
        .attr("class", "box")
        .attr("x", 420)
        .attr("y", function(d, i) { return 270 + 30 * (2 - i); })
        .attr("width", 30)
        .attr("height", 30)
        .style("fill", "white");

    // Shifting
    var shifting = svg.append("g")
      .selectAll("rect")
        .data(beta)
      .enter().append("rect")
        .attr("class", "box")
        .attr("x", 420)
        .attr("y", function(d, i) { return 140 + 30 * (2 - i); })
        .attr("width", 30)
        .attr("height", 30)
        .style("fill", "white");

    // Scaling operator
    var scalingOperator = svg.append("g")
        .attr("opacity", 0);
    scalingOperator.append("circle")
        .attr("class", "node")
        .attr("cx", 500)
        .attr("cy", 315)
        .attr("r", 15);
    scalingOperator.append("circle")
        .attr("class", "node")
        .attr("cx", 500)
        .attr("cy", 315)
        .attr("r", 1);

    // Shifting operator
    var shiftingOperator = svg.append("g")
        .attr("opacity", 0);
    shiftingOperator.append("circle")
        .attr("class", "node")
        .attr("cx", 500)
        .attr("cy", 185)
        .attr("r", 15);
    shiftingOperator.append("line")
        .attr("class", "edge")
        .attr("x1", 493)
        .attr("y1", 185)
        .attr("x2", 507)
        .attr("y2", 185);
    shiftingOperator.append("line")
        .attr("class", "edge")
        .attr("x1", 500)
        .attr("y1", 178)
        .attr("x2", 500)
        .attr("y2", 192);

    // Helper function to create a group element containing the feature map
    // polygons.
    var createFeatureMaps = function () {
        var featureMaps = svg.append("g");
        featureMaps
          .selectAll("polygon")
            .data(data)
          .enter().append("polygon")
            .attr("class", "pixel")
            .attr("points", "15 0 45 0 30 15 0 15")
            .attr("transform", function(d) {
                var x = 60 - 15 * d.coordinates[1] + 30 * d.coordinates[0];
                var y = 15 * d.coordinates[1] + 12 * (2 - d.coordinates[2]);
                return "translate(" + x +  ", " + y + ")";
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
