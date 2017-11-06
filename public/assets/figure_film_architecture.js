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
        .classed("label", true)
        .attrs({"x": 10, "y": 240, "text-anchor": "left", "opacity": 1})
        .text("Conditioning");

    // FiLM-generator box
    group.append("line")
        .classed("edge", true)
        .attrs({"x1": 10, "y1": 250, "x2": 150, "y2": 250});
    group.append("rect")
        .classed("box", true)
        .attrs({"x": 150, "y": 100, "width": 150, "height": 300})
        .style("stroke-width", 3);

    // FiLM-generator label
    group.append("text")
        .classed("label", true)
        .attrs({"x": 225, "y": 430, "text-anchor": "middle"})
        .text("FiLM generator");

    // FiLM-ed network
    filmedNetwork = group.append("g");
    filmedNetwork.selectAll("rect")
        .data(data)
      .enter().append("rect")
        .classed("box", true)
        .attrs({"x": 484, "width": 250, "height": 50,
                "y": function(d, i) { return 415 - 75 * (4 - i); }});
    filmedNetwork.selectAll("line")
        .data(data)
      .enter().append("line")
        .classed("edge", true)
        .attrs({"x1": 609, "x2": 609,
                "y1": function(d, i) { return 415 - 75 * (4 - i); },
                "y2": function(d, i) { return 390 - 75 * (4 - i); }});
    filmedNetwork.append("line")
        .classed("edge", true)
        .attrs({"x1": 609, "y1": 465, "x2": 609, "y2": 490});
    filmedNetwork.selectAll("text")
        .data(data)
      .enter().append("text")
        .classed("label", true)
        .attrs({"x": 609, "text-anchor": "middle", "dy": "0.4em",
                "y": function(d, i) { return 440 - 75 * (4 - i); }})
        .text(function (d) { return d; });
    filmedNetwork.selectAll("line#gen-to-net")
        .data(data)
      .enter().append("line")
        .classed("edge", true)
        .attrs({"id": "gen-to-net", "x1": 300, "x2": 484,
                "opacity": function(d) { return d == "FiLM" ? 1 : 0; },
                "y1": function(d, i) { return 440 - 75 * (4 - i); },
                "y2": function(d, i) { return 440 - 75 * (4 - i); }});
};

buildFigure();
