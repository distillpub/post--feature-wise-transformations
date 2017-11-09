var buildFigure = function () {
    // --- Create group element -----------------------------------------------
    var group = d3.select("div.figure#film-diagram").select("svg")
      .append("g")
        .attrs({"id": "architecture", "visibility": "hidden"});

    // --- Create data --------------------------------------------------------
    var data = ["Sub-network", "FiLM", "Sub-network", "FiLM", "Sub-network"];

    // --- Create figure elements ---------------------------------------------
    // Conditioning information label
    group.append("text")
        .classed("figure-text", true)
        .attrs({"x": 10, "y": 240, "text-anchor": "left", "opacity": 1})
        .text("Conditioning");

    // FiLM-generator box
    group.append("rect")
        .classed("figure-rect figure-rounded", true)
        .attrs({"x": 150, "y": 100, "width": 150, "height": 300});

    // FiLM-generator label
    group.append("text")
        .classed("figure-text", true)
        .attrs({"x": 225, "y": 430, "text-anchor": "middle"})
        .text("FiLM generator");

    // FiLM-ed network
    filmedNetwork = group.append("g");
    filmedNetwork.selectAll("rect")
        .data(data)
      .enter().append("rect")
        .classed("figure-rect figure-rounded", true)
        .attrs({"x": 484, "width": 250, "height": 50,
                "y": function(d, i) { return 415 - 75 * (4 - i); }});
    filmedNetwork.selectAll("text")
        .data(data)
      .enter().append("text")
        .classed("figure-text", true)
        .attrs({"x": 609, "text-anchor": "middle", "dy": "0.4em",
                "y": function(d, i) { return 440 - 75 * (4 - i); }})
        .text(function (d) { return d; });
};

buildFigure();
