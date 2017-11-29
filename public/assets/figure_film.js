function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("figure.figure#film-diagram").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-element, .figure-group, .figure-line, .figure-path")
            .style("fill", null)
            .style("stroke", null);
        svg.selectAll(".figure-text").style("font-size", null);

        // --- Style sub-figures ----------------------------------------------
        styleMLPFigure();
        styleCNNFigure();
    }

    function updateSingleColor(selection, accessor, amplitudeScale) {
        selection.selectAll("g.feature").each(function (d, i) {
            var r = accessor(d);
            var s = Math.sign(r) * amplitudeScale(Math.abs(r));
            d3.select(this)
              .select("g")
              .attr("opacity", Math.abs(s))
              .select("use")
              .attr("xlink:href", r < 0 ? "#array-negative-value" : "#array-positive-value")
        });
    }


    function styleMLPFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("figure.figure#film-diagram").select("svg");

        // --- Create data ----------------------------------------------------
        // Features
        var features = [0.9, -0.5, -0.8];
        var gammas = [-1.6, 0.8, 1.8];
        var betas = [1.0, 0.5, -0.5];
        var data = [];
        for (var i = 0; i < 3; i++) {
            data.push({
                feature: features[i],
                gamma: gammas[i],
                beta: betas[i],
            });
        }

        var amplitudeScale = d3.scaleSqrt()
            .domain([0.0, 2.0])
            .range([0.0, 1.0])
            .clamp(true);

        var mouseScale = d3.scaleLinear()
            .domain([0.0, 40.0])
            .range([2.0, -2.0])
            .clamp(true);

        // Scaling and shifting coefficients

        // --- Style figure elements ------------------------------------------
        svg.select("g#mlp-figure g#input-layer").selectAll("g.feature").data(data);
        svg.select("g#mlp-figure g#gamma").selectAll("g.feature").data(data);
        svg.select("g#mlp-figure g#beta").selectAll("g.feature").data(data);
        svg.select("g#mlp-figure g#scaled-layer").selectAll("g.feature").data(data);
        svg.select("g#mlp-figure g#shifted-layer").selectAll("g.feature").data(data);

        function update() {
            updateSingleColor(svg.select("g#mlp-figure g#input-layer"), function(d) { return d.feature; }, amplitudeScale);
            updateSingleColor(svg.select("g#mlp-figure g#scaled-layer"), function(d) { return d.gamma * d.feature; }, amplitudeScale);
            updateSingleColor(svg.select("g#mlp-figure g#shifted-layer"), function(d) { return d.gamma * d.feature + d.beta; }, amplitudeScale);
            updateSingleColor(svg.select("g#mlp-figure g#beta"), function(d) { return d.beta; }, amplitudeScale);
            updateSingleColor(svg.select("g#mlp-figure g#gamma"), function(d) { return d.gamma; }, amplitudeScale);
        }

        update();

        svg.select("g#mlp-figure g#gamma")
          .selectAll("g.feature")
            .on("mousemove", function (d) {
                d.gamma = mouseScale(d3.mouse(this)[1]);
                update();
            });
        svg.select("g#mlp-figure g#beta")
          .selectAll("g.feature")
            .on("mousemove", function (d, i) {
                d.beta = mouseScale(d3.mouse(this)[1]);
                update();
            });
    }

    function styleCNNFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("figure.figure#film-diagram").select("svg");

        // --- Create data ----------------------------------------------------
        // Features
        var features = [
            [[-0.6, -0.6,  0.8], [ 0.6,  0.7,  0.4], [-0.8,  0.8,  0.9]],
            [[ 0.9, -0.1,  0.5], [-0.8, -0.7,  0.5], [-0.3, -0.9, -0.2]],
            [[-0.5, -0.9,  0.6], [-0.2, -0.4,  0.2], [-0.6,  0.1, -0.3]]
        ];
        var gammas = [-1.6, 0.8, 1.8];
        var betas = [1.0, 0.5, -0.5];
        var data = [];
        var featureMapData = [[], [], []];
        for (var k = 0; k < 3; k++) {
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    var d = {
                        feature: features[i][j][k],
                        gamma: gammas[k],
                        beta: betas[k],
                    };
                    data.push(d);
                    featureMapData[2 - k].push(d);
                }
            }
        }

        var amplitudeScale = d3.scaleSqrt()
            .domain([0.0, 2.0])
            .range([0.0, 1.0])
            .clamp(true);

        var mouseScale = d3.scaleLinear()
            .domain([0.0, 40.0])
            .range([2.0, -2.0])
            .clamp(true);

        // Scaling and shifting coefficients

        // --- Style figure elements ------------------------------------------
        svg.select("g#cnn-figure g#input-layer").selectAll("g.feature").data(data);
        svg.select("g#cnn-figure g#gamma").selectAll("g.feature").data(featureMapData);
        svg.select("g#cnn-figure g#beta").selectAll("g.feature").data(featureMapData);
        svg.select("g#cnn-figure g#scaled-layer").selectAll("g.feature").data(data);
        svg.select("g#cnn-figure g#shifted-layer").selectAll("g.feature").data(data);

        function update() {
            updateSingleColor(svg.select("g#cnn-figure g#input-layer"), function(d) { return d.feature; }, amplitudeScale);
            updateSingleColor(svg.select("g#cnn-figure g#gamma"), function(d) { return d[0].gamma; }, amplitudeScale);
            updateSingleColor(svg.select("g#cnn-figure g#beta"), function(d) { return d[0].beta; }, amplitudeScale);
            updateSingleColor(svg.select("g#cnn-figure g#scaled-layer"), function(d) { return d.gamma * d.feature; }, amplitudeScale);
            updateSingleColor(svg.select("g#cnn-figure g#shifted-layer"), function(d) { return d.gamma * d.feature + d.beta; }, amplitudeScale);
        }

        update();

        svg.select("g#cnn-figure g#gamma")
          .selectAll("g.feature")
            .on("mousemove", function (d) {
                var newValue = mouseScale(d3.mouse(this)[1]);
                for (var i = 0; i < 9; i++) {
                    d[i].gamma = newValue;
                }
                update();
            });
        svg.select("g#cnn-figure g#beta")
          .selectAll("g.feature")
            .on("mousemove", function (d, i) {
                var newValue = mouseScale(d3.mouse(this)[1]);
                for (var i = 0; i < 9; i++) {
                    d[i].beta = newValue;
                }
                update();
            });
    }

    d3.xml("assets/film.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("figure.figure#film-diagram").each(function () {
            this.insertBefore(xml.documentElement, this.firstChild);
        });
        styleFigure();
    });
}

buildFigure();
