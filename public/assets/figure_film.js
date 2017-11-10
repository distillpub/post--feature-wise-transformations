
function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("div.figure#film-diagram").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-layer").style("fill", null);
        svg.selectAll(".figure-network").style("fill", null);
        svg.selectAll(".figure-text").style("font-size", null);
        svg.selectAll(".figure-line").style("stroke", null);
        svg.selectAll(".figure-path").style("fill", null);

        // --- Set initial visibility -----------------------------------------
        svg.select("g#mlp-figure").attr("visibility", "visible");
        svg.select("g#cnn-figure").attr("visibility", "hidden");
        svg.select("g#full-figure").attr("visibility", "hidden");

        // --- Program UI elements --------------------------------------------
        svg.select("g#mlp-button")
            .on("click", function () {
                svg.select("g#mlp-figure").attr("visibility", "visible");
                svg.select("g#cnn-figure").attr("visibility", "hidden");
                svg.select("g#full-figure").attr("visibility", "hidden");
            });
        svg.select("g#cnn-button")
            .on("click", function () {
                svg.select("g#mlp-figure").attr("visibility", "hidden");
                svg.select("g#cnn-figure").attr("visibility", "visible");
                svg.select("g#full-figure").attr("visibility", "hidden");
            });
        svg.select("g#full-button")
            .on("click", function () {
                svg.select("g#mlp-figure").attr("visibility", "hidden");
                svg.select("g#cnn-figure").attr("visibility", "hidden");
                svg.select("g#full-figure").attr("visibility", "visible");
            });

        // --- Style sub-figures ----------------------------------------------
        styleMLPFigure();
    }

    function styleMLPFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("div.figure#film-diagram").select("svg");

        // --- Create data ----------------------------------------------------
        // Features
        var features = [30, 200, 100, 230];

        var colorScale = d3.scaleLinear()
            .domain([0, 255])
            .range(["#0089c1", "#ffffff"])
            .clamp(true);

        // Scaling and shifting coefficients
        var gamma = [1.6, 0.2, 2.0, 0.0];
        var beta = [-25, 100, -100, 0];

        // Helper function to convert a feature value to RGB string representation
        var toRGB = function (value, scale, shift) {
            var intensity = Math.min(
                Math.max(Math.floor(scale * value + shift), 0),
                255
            );
            return colorScale(intensity);
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

        // --- Style figure elements ------------------------------------------
        svg.select("g#mlp-figure g#input-layer")
          .selectAll("rect")
            .data(data)
            .style("fill", function(d) { return d.color; });
        svg.select("g#mlp-figure g#intermediate-layer")
          .selectAll("rect")
            .data(data)
            .style("fill", function(d) { return d.color; });
        svg.select("g#mlp-figure g#output-layer")
          .selectAll("rect")
            .style("fill", "#ffffff");

        // --- Animate dynamic elements ---------------------------------------
        function loopFunction() {
            svg.select("g#mlp-figure g#intermediate-layer")
                // First transition: translate to scaling "station"
                .transition()
                .delay(1000)
                .duration(1000)
                .attr("transform", svg.select("g#mlp-figure rect#scaling-guide").attr("transform"))
                // Second transition: translate to shifting "station"
                .transition()
                .delay(1000)
                .duration(1000)
                .attr("transform", svg.select("g#mlp-figure rect#shifting-guide").attr("transform"))
                // Third transition: translate to output
                .transition()
                .delay(1000)
                .duration(1000)
                .attr("transform", svg.select("g#mlp-figure g#output-layer").attr("transform"))
                // Final transition: loop back
                .transition()
                .delay(1000)
                .duration(0)
                .on("end", function() {
                    d3.select(this)
                        // Replace feature maps over input
                        .attr("transform", svg.select("g#mlp-figure g#input-layer").attr("transform"))
                    loopFunction();
                });
        }
        loopFunction();
    }

    d3.xml("assets/film.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("div.figure#film-diagram").each(function () {
            this.appendChild(xml.documentElement);
        });
        styleFigure();
    });
}

buildFigure();
