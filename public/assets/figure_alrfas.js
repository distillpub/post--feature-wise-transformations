var createImage = function (selection, x, y, href, caption) {
    var image = selection.append("g")
        .attr("transform", "translate(" + x + " " + y + ")");
    image.append("image")
        .attrs({"width": 96, "height": 96, "x": 0, "y": 0, "href": href});
    image.append("text")
        .classed("figure-text", true)
        .attrs({"x": 48, "y": 106, "dy": "0.4em", "text-anchor": "middle"})
        .text(caption);
    return image;
};

var buildFigure = function () {
    // --- Create svg element -------------------------------------------------
    var svg = d3.select("div.figure#alrfas-diagram")
      .append("svg")
        // Width corresponds to the width of the body-outset class (744px)
        .attr("viewBox", "0 0 744 500");

    // --- Create defs element ------------------------------------------------
    var defs = svg.append("defs");
    var linearGradient = defs.append("linearGradient")
        .attrs({"id": "fadeGrad", "y2": 0, "x2": 1});
    linearGradient.append("stop")
        .attrs({"offset": 0.0, "stop-color": "white", "stop-opacity": 1.0});
    linearGradient.append("stop")
        .attrs({"offset": 0.9, "stop-color": "white", "stop-opacity": 0.0});
    defs.append("mask")
        .attrs({"id": "fade", "maskContentUnits": "objectBoundingBox"})
      .append("rect")
        .attrs({"width": 1, "height": 1, "fill": "url(#fadeGrad)"});

    // --- Create figure elements ---------------------------------------------
    // Content image
    createImage(svg, 10, 10, "assets/tuebingen_neckarfront.jpg", "content image");

    // Stylized image
    createImage(svg, 506, 186, "assets/tuebingen_neckarfront_cassis_cap_lombard_opus_196.jpg", "style image");

    // Style image
    createImage(svg, 10, 362, "assets/cassis_cap_lombard_opus_196.jpg", "style image");

    // Style transfer network
    var styleTransferNetwork = svg.append("g")
        .attr("transform", "translate(126 78)");
    figureNetwork(styleTransferNetwork, 0, 0, 360, 200, "style transfer network");
    var styleLayers = styleTransferNetwork.append("g")
        .attr("transform", "translate(0 10)");
    styleLayers.append("g").selectAll("g")
        .data(["convolution", "batch normalization", "FiLM",
               "convolution", "batch normalization", "FiLM"])
      .enter().each(function (d, i) {
          figureLayer(d3.select(this), 17.14 + i * (40 + 17.14), 0, 40, 180, d);
      });
    styleLayers.append("g").selectAll("g")
        .data([0, 1, 2, 3, 4])
      .enter().each(function (d) {
          figureArrow(
              d3.select(this),
              "right",
              40 + 17.14 + d * (40 + 17.14),
              90,
              40 + 17.14 + 17.14 + d * (40 + 17.14),
              90,
          );
      });

    // Style prediction network
    var stylePredictionNetwork = svg.append("g")
        .attr("transform", "translate(146 328)");
    figureNetwork(stylePredictionNetwork, 0, 0, 320, 100, "style prediction network");

    // Loss
    var loss = svg.append("g")
        .attr("transform", "translate(624 50)");
    loss.append("rect")
        .attrs({"x": 0, "y": 0, "rx": 10, "ry": 10, "width": 130, "height": 400,
                "mask": "url(#fade)"})
        .style("fill", "#f0f0f5");
    loss.append("text")
        .classed("figure-text", true)
        .attrs({"x": 10, "y": 410, "dy": "0.4em",  "text-anchor": "left"})
        .text("style transfer loss");

    // Misc arrows
    var arrows = svg.append("g");
    figureArrow(arrows, "right", 106, 58, 143.14, 178);
    figureArrow(arrows, "right", 468.84, 178, 506, 234);
};

buildFigure();
