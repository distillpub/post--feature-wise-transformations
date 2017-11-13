var colors = ["#8ed08b", "#afaed4", "#ecebf4", "#8d89c0", "#fdc692", "#fda057",
              "#89bedc", "#f67824", "#f44f39", "#fcaf93", "#fee3c8", "#d1d2e7",
              "#fc8161"];

function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("div.figure#clevr-tsne").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-layer").style("fill", null);
        svg.selectAll(".figure-network").style("fill", null);
        svg.selectAll(".figure-text").style("font-size", null);
        svg.selectAll(".figure-line").style("stroke", null);
        svg.selectAll(".figure-path").style("fill", null);
        svg.selectAll(".figure-operator").style("fill", null);

        // --- Load data ------------------------------------------------------
        var scatterPlot = svg.select("#scatter-plot");
        var xMin = parseInt(scatterPlot.attr("x"));
        var xMax = xMin + parseInt(scatterPlot.attr("width"));
        var yMin = parseInt(scatterPlot.attr("y"));
        var yMax = yMin + parseInt(scatterPlot.attr("height"));

        var coordinates = function(d, i) {
            switch (i) {
                case 0: return d.layer_0;
                case 1: return d.layer_1;
                case 2: return d.layer_2;
                case 3: return d.layer_3;
                case 4: return d.layer_4;
                case 5: return d.layer_5;
            }
        }

        var dataset;
        var xScales;
        var yScales;
        d3.json("assets/clevr_res_baseline6.json", function(data) {
            dataset = data;
            xScales = [];
            yScales = [];
            for (var i = 0; i < 6; i++) {
                xScales.push(
                    d3.scaleLinear()
                        .domain([d3.min(dataset, function (d) { return coordinates(d, i).x; }),
                                 d3.max(dataset, function (d) { return coordinates(d, i).x; })])
                        .rangeRound([xMin, xMax])
                );
                yScales.push(
                    d3.scaleLinear()
                        .domain([d3.min(dataset, function (d) { return coordinates(d, i).y; }),
                                 d3.max(dataset, function (d) { return coordinates(d, i).y; })])
                        .rangeRound([yMin, yMax])
                );
            }

            svg.selectAll("circle")
                .data(dataset)
              .enter().append("circle")
                .attrs({
                    "cx": function(d) { return xScales[0](d.layer_0.x); },
                    "cy": function(d) { return yScales[0](d.layer_0.y); },
                    "r": 4,
                })
                .style("fill", function(d) { return colors[d.question_type]; })
                .style("opacity", 0.6)
                .style("stroke", "#666")
                .style("stroke-width", 1.5);
        });

        // --- Program UI elements --------------------------------------------
        for (var k = 0; k < 6; k++) {
            svg.select("#film-layer-" + (k + 1))
                .on("click", function () {
                    var layer = parseInt(d3.select(this).attr("id").charAt(11)) - 1;
                    svg.selectAll("circle")
                        .transition()
                        .duration(500)
                        .attrs({
                            "cx": function(d) { return xScales[layer](coordinates(d, layer).x); },
                            "cy": function(d) { return yScales[layer](coordinates(d, layer).y); }
                        });
                });
        }
    }

    d3.xml("assets/clevr_tsne.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("div.figure#clevr-tsne").each(function () {
            this.appendChild(xml.documentElement);
        });
        styleFigure();
    });
}

buildFigure();
