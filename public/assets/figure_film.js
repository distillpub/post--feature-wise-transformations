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
        svg.selectAll(".figure-operator").style("fill", null);

        // --- Style sub-figures ----------------------------------------------
        styleMLPFigure();
        styleCNNFigure();
    }

    function styleMLPFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("div.figure#film-diagram").select("svg");

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

        function updateSingle(selection, accessor) {
            selection.selectAll("g.feature").each(function (d, i) {
                var r = accessor(d);
                var s = Math.sign(r) * amplitudeScale(Math.abs(r));
                d3.select(this)
                  .select("g")
                    .attr("transform", "matrix(" + [s, 0, 0, s, 20, 20] + ")");
            });
        }

        function update() {
            updateSingle(svg.select("g#mlp-figure g#input-layer"), function(d) { return d.feature; });
            updateSingle(svg.select("g#mlp-figure g#gamma"), function(d) { return d.gamma; });
            updateSingle(svg.select("g#mlp-figure g#beta"), function(d) { return d.beta; });
            updateSingle(svg.select("g#mlp-figure g#scaled-layer"), function(d) { return d.gamma * d.feature; });
            updateSingle(svg.select("g#mlp-figure g#shifted-layer"), function(d) { return d.gamma * d.feature + d.beta; });
        }

        update();

        svg.select("g#mlp-figure g#gamma")
          .selectAll("g.feature")
            .on("mousemove", function (d) {
                if (d3.event.buttons == 1) {
                    d.gamma = mouseScale(d3.mouse(this)[1]);
                    update();
                }
            });
        svg.select("g#mlp-figure g#beta")
          .selectAll("g.feature")
            .on("mousemove", function (d, i) {
                if (d3.event.buttons == 1) {
                    d.beta = mouseScale(d3.mouse(this)[1]);
                    update();
                }
            });
    }

    function styleCNNFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("div.figure#film-diagram").select("svg");

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

        function updateSingle(selection, accessor, offset) {
            selection.selectAll("g.feature").each(function (d, i) {
                var r = accessor(d);
                var s = Math.sign(r) * amplitudeScale(Math.abs(r));
                d3.select(this)
                  .select("g")
                    .attr("transform", "matrix(" + [s, 0, 0, s, offset, offset] + ")");
            });
        }

        function update() {
            updateSingle(svg.select("g#cnn-figure g#input-layer"), function(d) { return d.feature; }, 15);
            updateSingle(svg.select("g#cnn-figure g#gamma"), function(d) { return d[0].gamma; }, 20);
            updateSingle(svg.select("g#cnn-figure g#beta"), function(d) { return d[0].beta; }, 20);
            updateSingle(svg.select("g#cnn-figure g#scaled-layer"), function(d) { return d.gamma * d.feature; }, 15);
            updateSingle(svg.select("g#cnn-figure g#shifted-layer"), function(d) { return d.gamma * d.feature + d.beta; }, 15);
        }

        update();

        svg.select("g#cnn-figure g#gamma")
          .selectAll("g.feature")
            .on("mousemove", function (d) {
                if (d3.event.buttons == 1) {
                    var newValue = mouseScale(d3.mouse(this)[1]);
                    for (var i = 0; i < 9; i++) {
                        d[i].gamma = newValue;
                    }
                    update();
                }
            });
        svg.select("g#cnn-figure g#beta")
          .selectAll("g.feature")
            .on("mousemove", function (d, i) {
                if (d3.event.buttons == 1) {
                    var newValue = mouseScale(d3.mouse(this)[1]);
                    for (var i = 0; i < 9; i++) {
                        d[i].beta = newValue;
                    }
                    update();
                }
            });
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
