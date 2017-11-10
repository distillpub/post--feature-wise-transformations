var colors = ["#8ed08b", "#afaed4", "#ecebf4", "#8d89c0", "#fdc692", "#fda057",
              "#89bedc", "#f67824", "#f44f39", "#fcaf93", "#fee3c8", "#d1d2e7",
              "#fc8161"];

var buildFigure = function () {
    // --- Create svg element -------------------------------------------------
    var svg = d3.select("div.figure#clevr-tsne")
      .append("svg")
        // Width corresponds to the width of the body-outset class (744px)
        .attr("viewBox", "0 0 744 500");

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

    // --- Load data ----------------------------------------------------------
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
                    .rangeRound([10, 490])
            );
            yScales.push(
                d3.scaleLinear()
                    .domain([d3.min(dataset, function (d) { return coordinates(d, i).y; }),
                             d3.max(dataset, function (d) { return coordinates(d, i).y; })])
                    .rangeRound([10, 490])
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

    // --- Create UI elements -------------------------------------------------
    var selectedButton = svg.append("rect")
        .classed("figure-rect figure-rounded", true)
        .attrs({
            "x": 0, "y": 0, "width": 100, "height": 40,
            "transform": "translate(520 260)",
        });
    for (var k = 0; k < 6; k++) {
        var button = svg.append("g")
            .attrs({
                "id": k,
                "transform": "translate(520 " + (10 + (5 - k) * 50) + ")"
            })
            .on("click", function () {
                var layer = parseInt(d3.select(this).attr("id"));
                svg.selectAll("circle")
                    .transition()
                    .duration(500)
                    .attrs({
                        "cx": function(d) { return xScales[layer](coordinates(d, layer).x); },
                        "cy": function(d) { return yScales[layer](coordinates(d, layer).y); }
                    });
                selectedButton
                    .transition()
                    .duration(500)
                    .attrs({
                        "transform": "translate(520 " + (10 + (5 - layer) * 50) + ")"
                    });
            });
        button.append("rect")
            .classed("figure-rect figure-rounded", true)
            .attrs({"x": 0, "y": 0, "width": 100, "height": 40})
            .style("stroke", "none");
        button.append("text")
            .classed("figure-text", true)
            .attrs({"x": 50, "y": 20, "dy": "0.4em", "text-anchor": "middle"})
            .text("Layer " + k);
    }
};

buildFigure();
