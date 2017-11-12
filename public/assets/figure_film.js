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
    }

    function styleMLPFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("div.figure#film-diagram").select("svg");

        // --- Create data ----------------------------------------------------
        // Features
        var features = [0.9, 0.0, -0.5, -0.8];
        var gammas = [-1.6, -1.4, 0.8, 1.8];
        var betas = [0.0, 1.3, 0.5, -0.5];
        var data = [];
        for (var i = 0; i < 4; i++) {
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
        svg.select("g#mlp-figure text#gamma-label").style("font-size", 26);
        svg.select("g#mlp-figure text#beta-label").style("font-size", 26);

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

    d3.xml("assets/film.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("div.figure#film-diagram").each(function () {
            this.appendChild(xml.documentElement);
        });
        styleFigure();
    });
}

buildFigure();
