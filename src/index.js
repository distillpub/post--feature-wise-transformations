(function() {
    d3.selectAll(".collapsible")
        .on("click", function() {
            d3.selectAll('.content[content-name="' + d3.select(this).attr("content-name") + '"]')
                .style("display", function() {
                    return d3.select(this).style("display") === "block" ? "none" : "block";
                });
            var symbolSpan = d3.select(this).select("span");
            symbolSpan.html(symbolSpan.html() === "+" ? "-" : "+");
        });
    d3.selectAll(".expand-collapse-button")
        .on("click", function() {
            var mode = d3.select(this).html();
            var contentType = d3.select(this).attr("content-type");
            d3.select(this).html(mode === "expand all" ? "collapse all" : "expand all");
            d3.selectAll('.content[content-type="' + contentType + '"]')
                .style("display", function() {
                    return mode === "expand all" ? "block" : "none";
                });
            d3.selectAll('.collapsible[content-type="' + contentType + '"]').select("span")
                .html(function() {
                    return mode === "expand all" ? "-" : "+";
                });
        });
})();

(function() {
    var svg = d3.select("#film-layer-diagram > svg");
    var features = [0.9, -0.5, -0.8];
    var featureMaps = [
        [[-0.6, -0.6,  0.8], [ 0.6,  0.7,  0.4], [-0.8,  0.8,  0.9]],
        [[ 0.9, -0.1,  0.5], [-0.8, -0.7,  0.5], [-0.3, -0.9, -0.2]],
        [[-0.5, -0.9,  0.6], [-0.2, -0.4,  0.2], [-0.6,  0.1, -0.3]]
    ];
    var gammas = [-1.6, 0.8, 1.8];
    var betas = [1.0, 0.5, -0.5];
    var data = [];
    for (var i = 0; i < 3; i++) {
        data.push({feature: features[i], featureMap: [], gamma: gammas[i], beta: betas[i]});
    }
    var convData = [];
    for (var k = 0; k < 3; k++) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var d = {feature: featureMaps[i][j][k], gamma: gammas[k], beta: betas[k]};
                convData.push(d);
                data[2 - k].featureMap.push(d);
            }
        }
    }
    var amplitudeScale = d3.scaleSqrt().domain([0.0, 2.0]).range([0.0, 0.8]).clamp(true);
    var mouseScale = d3.scaleLinear().domain([0.0, 40.0]).range([2.0, -2.0]).clamp(true);
    svg.select("g#mlp-figure g#input-layer").selectAll("g.feature").data(data);
    svg.select("g#mlp-figure g#gamma").selectAll("g.feature").data(data);
    svg.select("g#mlp-figure g#beta").selectAll("g.feature").data(data);
    svg.select("g#mlp-figure g#scaled-layer").selectAll("g.feature").data(data);
    svg.select("g#mlp-figure g#shifted-layer").selectAll("g.feature").data(data);
    svg.select("g#cnn-figure g#input-layer").selectAll("g.feature").data(convData);
    svg.select("g#cnn-figure g#scaled-layer").selectAll("g.feature").data(convData);
    svg.select("g#cnn-figure g#shifted-layer").selectAll("g.feature").data(convData);


    function updateSingle(selection, accessor) {
        selection.selectAll("g.feature").each(function (d, i) {
            var r = accessor(d);
            var s = Math.sign(r) * amplitudeScale(Math.abs(r));
            d3.select(this)
              .select(".vector-patch")
                .attr("opacity", Math.abs(s))
                .attr("href", r < 0 ? "#vector-patch-negative" : "#vector-patch-positive");
            d3.select(this)
              .select(".figure-line")
                .attr("transform", "matrix(" + [s, 0, 0, s, 20, 20] + ")");
        });
    }
    function updateSingleConv(selection, accessor) {
        selection.selectAll("g.feature").each(function (d, i) {
            var r = accessor(d);
            var s = Math.sign(r) * amplitudeScale(Math.abs(r));
            d3.select(this)
              .select(".convolutional-patch")
                .attr("opacity", Math.abs(s))
                .attr("href", r < 0 ?  "#convolutional-patch-negative" : "#convolutional-patch-positive");
            d3.select(this)
              .select(".vector-patch")
                .attr("opacity", Math.abs(s))
                .attr("href", r < 0 ?  "#vector-patch-negative" : "#vector-patch-positive");
            d3.select(this)
              .select(".figure-line")
                .attr("transform", "matrix(" + [s, 0, 0, s, 15, 15] + ")");
        });
    }
    function update() {
        updateSingle(svg.select("g#mlp-figure g#input-layer"), function(d) { return d.feature; });
        updateSingle(svg.select("g#mlp-figure g#gamma"), function(d) { return d.gamma; });
        updateSingle(svg.select("g#mlp-figure g#beta"), function(d) { return d.beta; });
        updateSingle(svg.select("g#mlp-figure g#scaled-layer"), function(d) { return d.gamma * d.feature; });
        updateSingle(svg.select("g#mlp-figure g#shifted-layer"), function(d) { return d.gamma * d.feature + d.beta; });
        updateSingleConv(svg.select("g#cnn-figure g#input-layer"), function(d) { return d.feature; });
        updateSingleConv(svg.select("g#cnn-figure g#scaled-layer"), function(d) { return d.gamma * d.feature; });
        updateSingleConv(svg.select("g#cnn-figure g#shifted-layer"), function(d) { return d.gamma * d.feature + d.beta; });
    }
    update();
    svg.select("g#mlp-figure g#gamma")
      .selectAll("g.feature")
        .style("cursor", "pointer")
        .on("mousemove", function (d) {
            var newValue = mouseScale(d3.mouse(this)[1]);
            d.gamma = newValue;
            for (var i = 0; i < 9; i++) {
                d.featureMap[i].gamma = newValue;
            }
            update();
        });
    svg.select("g#mlp-figure g#beta")
      .selectAll("g.feature")
        .style("cursor", "pointer")
        .on("mousemove", function (d, i) {
            var newValue = mouseScale(d3.mouse(this)[1]);
            d.beta = newValue;
            for (var i = 0; i < 9; i++) {
                d.featureMap[i].beta = newValue;
            }
            update();
        });
})();

(function() {
    var svg = d3.select("#film-vs-attention-diagram > svg");
    var featureMaps = [
        [[-0.6, -0.6,  0.8], [ 0.6,  0.7,  0.4], [-0.8,  0.8,  0.9]],
        [[ 0.9, -0.1,  0.5], [-0.8, -0.7,  0.5], [-0.3, -0.9, -0.2]],
        [[0.8, -0.9,  0.6], [-0.2, -0.4,  0.2], [-0.6,  0.1, -0.3]]
    ];

    var gammas = [-1.6, 0.8, 1.8];
    var betas = [1.0, 0.5, -0.5];

    // Note Alpha must be positif
    var alpha = [[0.6, 1.7, 1], [0.5, 4, 10], [0.8, 3, 7]];
    var alpha_norm = 0;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            alpha_norm = alpha_norm + alpha[i][j]
        }
    }
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            alpha[i][j] = 2* alpha[i][j] / alpha_norm
        }
    }

    var data = [];
    for (var k = 0; k < 3; k++) {
        data.push({featureMap: featureMaps[k], gamma: gammas[k], beta: betas[k], alpha: alpha});
    }

    var convData = [];
    for (var k = 0; k < 3; k++) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var d = {feature: featureMaps[k][i][j], gamma: gammas[k], beta: betas[k], alpha: alpha[i][j]};
                convData.push(d);
            }
        }
    }

    var amplitudeScale = d3.scaleSqrt().domain([0.0, 2.0]).range([0.0, 0.8]).clamp(true);

    function updatePatch(selection, accessor) {
        selection.selectAll("g.feature").each(function (d, i) {
            var r = accessor(d);
            var s = Math.sign(r) * amplitudeScale(Math.abs(r));
            d3.select(this)
                .select(".convolutional-patch")
                .attr("opacity", Math.abs(s))
                .attr("href", r < 0 ?  "#convolutional-patch-negative" : "#convolutional-patch-positive");
        });
    }

    // Attention pipeline
    svg.select("g#cnn-figure-attention g#input-conv-att").selectAll("g.feature").data(convData);
    svg.select("g#cnn-figure-attention g#alpha-conv-att").selectAll("g.feature").data(convData);
    svg.select("g#cnn-figure-attention g#out-conv-att").selectAll("g.feature").data(convData);
    svg.select("g#cnn-figure-attention g#out-feat-att").selectAll("g.feature").data(data);

    // FiLM pipeline
    svg.select("g#cnn-figure-film g#input-conv-film").selectAll("g.feature").data(convData);
    svg.select("g#cnn-figure-film g#gamma-conv-film").selectAll("g.feature").data(data);
    svg.select("g#cnn-figure-film g#out-conv-film").selectAll("g.feature").data(convData);

    function update() {
        // Attention pipeline
        updatePatch(svg.select("g#cnn-figure-attention g#input-conv-att"), function(d) { return d.feature; });
        updatePatch(svg.select("g#cnn-figure-attention g#alpha-conv-att"), function(d) { return d.alpha; });
        updatePatch(svg.select("g#cnn-figure-attention g#out-conv-att"), function(d) { return d.alpha * d.feature; });
        updatePatch(svg.select("g#cnn-figure-attention g#out-feat-att"), function(d)   {
            var attention_pool = 0;
            var n = 0;
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    attention_pool = attention_pool + d.alpha[i][j] * d.featureMap[i][j]
                    n = n + 1
                }
            }
            return attention_pool;
        });

        // FiLM pipeline
        updatePatch(svg.select("g#cnn-figure-film g#input-conv-film"), function(d) { return d.feature; });
        updatePatch(svg.select("g#cnn-figure-film g#gamma-conv-film"), function(d) { return d.gamma; });
        updatePatch(svg.select("g#cnn-figure-film g#out-conv-film"), function(d) { return d.gamma * d.feature; });
    }
    update()
})();

(function() {
    var setUp = function(filename, keyword) {
        // Get references to important tags
        var svg = d3.select("#gamma-beta-diagram > svg");
        var scatterPlot = svg.select("#" + keyword + "-plot");
        var boundingBox = scatterPlot.select("rect");
        var legend = svg.select("#" + keyword + "-legend");

        // Retrieve scatter plot bounding box coordinates
        var xMin = parseInt(boundingBox.attr("x"));
        var xMax = xMin + parseInt(boundingBox.attr("width"));
        var yMin = parseInt(boundingBox.attr("y"));
        var yMax = yMin + parseInt(boundingBox.attr("height"));

        var colors = [
            "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
            "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50",
            "#8BC34A", "#CDDC39", "#FFEB3B", "#FF9800", "#795548",
            "#9E9E9E",
        ];

        var dataset;
        var xScale;
        var yScale;

        d3.json(filename, function(data) {
            dataset = data;

            // Create scales mapping gamma and beta values to bounding box
            // coordinates
            xScale = d3.scaleLinear()
                .domain([1.15 * d3.min(dataset, function (d) { return d.gamma; }),
                         1.15 * d3.max(dataset, function (d) { return d.gamma; })])
                .rangeRound([xMin, xMax]);
            yScale = d3.scaleLinear()
                .domain([1.15 * d3.min(dataset, function (d) { return d.beta; }),
                         1.15 * d3.max(dataset, function (d) { return d.beta; })])
                .rangeRound([yMax, yMin])

            // Set up axes
            scatterPlot.select("#x-axis")
                .attr("d", "M" +  xMin + " " +  yScale(0) + " L " + xMax + " " + yScale(0));
            scatterPlot.select("#x-axis-label")
                .attrs({"x": xMax - 10, "y": yScale(0.0) + 10});
            scatterPlot.select("#y-axis")
                .attr("d", "M" +  xScale(0) + " " +  yMax + " L " + xScale(0) + " " + yMin);
            scatterPlot.select("#y-axis-label")
                .attrs({"x": xScale(0.0) + 10, "y": yMin});

            // Dispatch data points into groups by feature map
            scatterPlot.selectAll("g")
                .data(colors)
              .enter().append("g")
                .style("opacity", 1.0)
                .each(function(c, i) {
                    d3.select(this).selectAll("circle")
                        .data(dataset.filter(function(d) { return d.feature_map == i; }))
                      .enter().append("circle")
                        .attrs({
                            "cx": function(d) { return xScale(d.gamma); },
                            "cy": function(d) { return yScale(d.beta); },
                            "r": 3.0,
                        })
                        .style("fill", function(d) { return colors[i]; })
                        .style("opacity", 0.6);
                });

            // Create legend
            legend.selectAll("circle")
                .data(colors)
              .enter().append("circle")
                .attrs({
                    "cx": function(d, i) { return 18 * i; },
                    "cy": 0,
                    "r": 6,
                    "stroke-width": 10,
                    "stroke-opacity": 0,
                    "stroke": "red",
                })
                .style("fill", function(d, i) { return colors[i]; })
                .style("cursor", "pointer")
                .style("opacity", 0.6);

            // Focuses on all points by resetting the opacities
            var focusAll = function() {
                legend.selectAll("circle")
                    .style("opacity", 0.6);
                scatterPlot.selectAll("g")
                    .style("opacity", 1.0);
            };

            // Focuses on a single feature map by lowering other feature map
            // opacities
            var focus = function(j) {
                legend.selectAll("circle")
                    .style("opacity", function(d, i) { return i == j ?  0.6 : 0.1; });
                scatterPlot.selectAll("g")
                    .style("opacity", function(d, i) { return i == j ?  1.0 : 0.1; })
            };

            // Add hovering behavior to legend
            legend.selectAll("circle")
                .on("mouseover", function (d, i) {
                    focus(i);
                })
                .on("mouseout", focusAll);

            focusAll();
        });
    };
    setUp('data/clevr_gamma_beta_subsampled.json', 'clevr');
    setUp('data/style_gamma_beta_subsampled.json', 'style-transfer');
})();

(function() {
    var processExample = function() {
        var svg = d3.select("#style-interpolation-diagram > svg");
        var styleSelect1 = svg.selectAll("#style-1-select image").attr('cursor', 'pointer')
        var styleSelect2 = svg.selectAll("#style-2-select image").attr('cursor', 'pointer');
        var contentSelect = svg.selectAll("#content-select image").attr('cursor', 'pointer');
        var interpolationImages = svg.selectAll("#interpolation image");
        var selectedImages = {
            'content': 0, 
            'style1': 0, 
            'style2': 0
        };

        var updateImages = function () {
            interpolationImages.attr("xlink:href", function (d, i) {
                const { content, style1, style2 } = selectedImages
                const href = `images/stylized-${content + 1}-${style1 + 1}-${style2 + 1}-${i + 1}.jpg`;
                return href;
            });

            styleSelect1.style('opacity', (d, i) => i == selectedImages['style1'] ? 1: 0.1);
            styleSelect2.style('opacity', (d, i) => i == selectedImages['style2'] ? 1: 0.1);
            contentSelect.style('opacity', (d, i) => i == selectedImages['content'] ? 1: 0.1);
        }

        var updateStyle = key => (d, i) => {
            selectedImages[key] = i;
            updateImages();
        }

        styleSelect1.on("click", updateStyle('style1'));
        styleSelect2.on("click", updateStyle('style2'));
        contentSelect.on("click", updateStyle('content'));

        updateImages();

    };
    processExample();
})();

(function() {
    var processExample = function(example) {
        var svg = d3.select("#question-interpolation-diagram > svg");
        var imageSelector = svg.select("#example-" + example + " > .image-selector");

        var xMin = +imageSelector.select("line").attr("x1");
        var xMax = +imageSelector.select("line").attr("x2");
        var nTicks = 11;
        var length = (xMax - xMin) / (nTicks - 1.0);
        var ticks = [];
        for(var i = 0; i < nTicks; i++) {
          ticks.push(xMin + i * length);
        }


        var circle = imageSelector.append("circle")
            .attrs({"cx": ticks[0], "cy": 0, "r": 6})
            .style("cursor", "pointer")
            .classed("figure-path", true);

        var drag = d3.drag()
          .on("drag", function() {
              var newX = Math.min(ticks[nTicks - 1], Math.max(ticks[0], d3.event.x));
              var newTick = Math.round((newX - ticks[0]) / length);
              newX = ticks[0] + length * newTick;
              d3.select(this).attr("cx", newX);
              svg.select("mask#m-" + example + " > image")
                  .attr("xlink:href", "images/question-interpolation-" + example + "-mask-" + (+newTick + 1) + ".png");
          });

        drag(circle);
    };
    processExample("1");
    processExample("2");
})();

(function() {
    var setUp = function(filename, keyword, color) {
        // Get references to important tags
        var svg = d3.select("#clevr-subcluster-diagram > svg");
        var scatterPlot = svg.select("#" + keyword + "-plot");
        var boundingBox = scatterPlot.select("rect");
        var legend = svg.select("#" + keyword + "-legend");

        // Retrieve scatter plot bounding box coordinates
        var xMin = parseInt(boundingBox.attr("x"));
        var xMax = xMin + parseInt(boundingBox.attr("width"));
        var yMin = parseInt(boundingBox.attr("y"));
        var yMax = yMin + parseInt(boundingBox.attr("height"));

        var colors = [
            "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
            "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50",
            "#8BC34A", "#CDDC39", "#FFEB3B", "#FF9800", "#795548",
            "#9E9E9E",
        ];

        var dataset;
        var xScale;
        var yScale;

        d3.json(filename, function(data) {
            dataset = data;

            // Create scales mapping gamma and beta values to bounding box
            // coordinates
            xScale = d3.scaleLinear()
                .domain([1.15 * d3.min(dataset, function (d) { return d.gamma; }),
                         1.15 * d3.max(dataset, function (d) { return d.gamma; })])
                .rangeRound([xMin, xMax]);
            yScale = d3.scaleLinear()
                .domain([1.15 * d3.min(dataset, function (d) { return d.beta; }),
                         1.15 * d3.max(dataset, function (d) { return d.beta; })])
                .rangeRound([yMax, yMin])

            // Set up axes
            scatterPlot.select("#x-axis")
                .attr("d", "M" +  xMin + " " +  yScale(0) + " L " + xMax + " " + yScale(0));
            scatterPlot.select("#x-axis-label")
                .attrs({"x": xMax - 10, "y": yScale(0.0) + 10});
            scatterPlot.select("#y-axis")
                .attr("d", "M" +  xScale(0) + " " +  yMax + " L " + xScale(0) + " " + yMin);
            scatterPlot.select("#y-axis-label")
                .attrs({"x": xScale(0.0) + 10, "y": yMin});

            var tooltip = d3.select("body").append("div")
                .attr("id", "tooltip-clevr")
                .attr("class", "tooltip figure-text")
                .style("background", "#ddd")
                .style("border-radius", "6px")
                .style("padding", "10px")
                .style("opacity", 0);

            // Display data points
            scatterPlot.selectAll("circle")
                .data(dataset)
              .enter().append("circle")
                .attrs({
                    "cx": function(d) { return xScale(d.gamma); },
                    "cy": function(d) { return yScale(d.beta); },
                    "r": 3.0,
                })
                .style("fill", colors[color])
                .style("opacity", 0.6)
                .style("cursor", "pointer")
                .on("mouseover", function(d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(d.question.join(" ") + "?")
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        });
    };
    setUp('data/clevr_gamma_beta_words_subcluster_fm_26.json', 'first', 0);
    setUp('data/clevr_gamma_beta_words_subcluster_fm_76.json', 'second', 6);
})();

(function() {
    var colors = [
        "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
        "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50",
        "#8BC34A", "#CDDC39", "#FFEB3B",
    ];

    var question_words = [
        "front", "behind", "left", "right",
        "material", "rubber", "matte", "metal", "metallic", "shiny",
    ];

    var setUp = function(filename, keyword, color) {
        // Get references to important tags
        var svg = d3.select("#clevr-subcluster-color-words-diagram > svg");
        var scatterPlot = svg.select("#" + keyword + "-plot");
        var boundingBox = scatterPlot.select("rect");

        // Retrieve scatter plot bounding box coordinates
        var xMin = parseInt(boundingBox.attr("x"));
        var xMax = xMin + parseInt(boundingBox.attr("width"));
        var yMin = parseInt(boundingBox.attr("y"));
        var yMax = yMin + parseInt(boundingBox.attr("height"));

        var dataset;
        var xScale;
        var yScale;

        d3.json(filename, function(data) {
            dataset = data;

            // Create scales mapping gamma and beta values to bounding box
            // coordinates
            xScale = d3.scaleLinear()
                .domain([1.15 * d3.min(dataset, function (d) { return d.gamma; }),
                         1.15 * d3.max(dataset, function (d) { return d.gamma; })])
                .rangeRound([xMin, xMax]);
            yScale = d3.scaleLinear()
                .domain([1.15 * d3.min(dataset, function (d) { return d.beta; }),
                         1.15 * d3.max(dataset, function (d) { return d.beta; })])
                .rangeRound([yMax, yMin])

            // Set up axes
            scatterPlot.select("#x-axis")
                .attr("d", "M" +  xMin + " " +  yScale(0) + " L " + xMax + " " + yScale(0));
            scatterPlot.select("#x-axis-label")
                .attrs({"x": xMax - 10, "y": yScale(0.0) + 10});
            scatterPlot.select("#y-axis")
                .attr("d", "M" +  xScale(0) + " " +  yMax + " L " + xScale(0) + " " + yMin);
            scatterPlot.select("#y-axis-label")
                .attrs({"x": xScale(0.0) + 10, "y": yMin});

            var tooltip = d3.select("body").append("div")
                .attr("id", "tooltip-clevr-words-clever")
                .attr("class", "tooltip figure-text")
                .style("background", "#ddd")
                .style("border-radius", "6px")
                .style("padding", "10px")
                .style("opacity", 0);

            // Dispatch data points into groups by question type
            scatterPlot.selectAll("circle")
                .data(dataset)
                .enter().append("circle")
                .attrs({
                    "cx": function(d) { return xScale(d.gamma); },
                    "cy": function(d) { return yScale(d.beta); },
                    "r": 3.0,
                })
                .style("fill", colors[color])
                .style("opacity", 0.6)
                .style("cursor", "pointer")
                .on("mouseover", function(d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(d.question.join(" ") + "?")
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })

            legend.selectAll("text")
                .data(question_words)
              .enter().append("text")
                .attrs({
                    "x": 20,
                    "y": function(d, i) { return 20 * i; },
                    "dy": "0.4em",
                })
                .classed("figure-text", true)
                .style("cursor", "pointer")
                .style("opacity", 0.6)
                .text(function(d) { return d; });
        });
    };
    setUp('data/clevr_gamma_beta_words_subcluster_fm_26.json', 'first', 0);
    setUp('data/clevr_gamma_beta_words_subcluster_fm_92.json', 'second', 8);

    var svg = d3.select("#clevr-subcluster-color-words-diagram > svg");
    var legend = svg.select("#legend");
    var firstPlot = svg.select("#first-plot");
    var secondPlot = svg.select("#second-plot");

    // Create legend
    legend.selectAll("circle")
        .data(question_words)
      .enter().append("circle")
        .attrs({
            "cx": 0,
            "cy": function(d, i) { return 20 * i; },
            "r": 6,
            "stroke-width": 10,
            "stroke-opacity": 0,
            "stroke": "red",
        })
        .style("stroke", "black")
        .style("fill", "none")
        .style("cursor", "pointer")
        .style("opacity", 0.6);
    legend.selectAll("text")
        .data(question_words)
      .enter().append("text")
        .attrs({
            "x": 20,
            "y": function(d, i) { return 20 * i; },
            "dy": "0.4em",
        })
        .classed("figure-text", true)
        .style("cursor", "pointer")
        .text(function(d) { return d; });

    // Focuses on all points by resetting the opacities
    var focusAll = function() {
        legend.selectAll("circle")
            .style("opacity", 0.6);
        legend.selectAll("text")
            .style("opacity", 0.6);
        firstPlot.selectAll("circle")
            .style("opacity", 1.0);
        secondPlot.selectAll("circle")
            .style("opacity", 1.0);
    };

    // Focuses on a single question type by lowering other
    // question type opacities
    var focus = function(word) {
        legend.selectAll("circle")
            .style("opacity", function(d, i) { return d == word ?  0.6 : 0.1; });
        legend.selectAll("text")
            .style("opacity", function(d, i) { return d == word ?  0.6 : 0.1; });
        firstPlot.selectAll("circle")
            .style("opacity", function(d, i) { return d.question.indexOf(word) >= 0 ?  1.0 : 0.1; })
        secondPlot.selectAll("circle")
            .style("opacity", function(d, i) { return d.question.indexOf(word) >= 0 ?  1.0 : 0.1; })
    };

    // Add hovering behavior to legend
    legend.selectAll("text")
        .on("mouseover", function (d, i) {
            focus(d);
        })
        .on("mouseout", focusAll);

    focusAll();
})();

(function() {
    var colors = [
        "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
        "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50",
        "#8BC34A", "#CDDC39", "#FFEB3B",
    ];

    var question_types = [
        "Exists", "Less than", "Greater than", "Count", "Query material",
        "Query size", "Query color", "Query shape", "Equal color",
        "Equal integer", "Equal shape", "Equal size", "Equal material"
    ];

    // Ugly workaround for permuted question types in JSON file.
    var question_type_mapping = [0, 2, 5, 8, 1, 4, 9, 10, 3, 6, 12, 7, 11];

    var setUp = function(filename, keyword, color) {
        // Get references to important tags
        var svg = d3.select("#clevr-subcluster-color-diagram > svg");
        var scatterPlot = svg.select("#" + keyword + "-plot");
        var boundingBox = scatterPlot.select("rect");

        // Retrieve scatter plot bounding box coordinates
        var xMin = parseInt(boundingBox.attr("x"));
        var xMax = xMin + parseInt(boundingBox.attr("width"));
        var yMin = parseInt(boundingBox.attr("y"));
        var yMax = yMin + parseInt(boundingBox.attr("height"));

        var dataset;
        var xScale;
        var yScale;

        d3.json(filename, function(data) {
            dataset = data;

            // Create scales mapping gamma and beta values to bounding box
            // coordinates
            xScale = d3.scaleLinear()
                .domain([1.15 * d3.min(dataset, function (d) { return d.gamma; }),
                         1.15 * d3.max(dataset, function (d) { return d.gamma; })])
                .rangeRound([xMin, xMax]);
            yScale = d3.scaleLinear()
                .domain([1.15 * d3.min(dataset, function (d) { return d.beta; }),
                         1.15 * d3.max(dataset, function (d) { return d.beta; })])
                .rangeRound([yMax, yMin])

            // Set up axes
            scatterPlot.select("#x-axis")
                .attr("d", "M" +  xMin + " " +  yScale(0) + " L " + xMax + " " + yScale(0));
            scatterPlot.select("#x-axis-label")
                .attrs({"x": xMax - 10, "y": yScale(0.0) + 10});
            scatterPlot.select("#y-axis")
                .attr("d", "M" +  xScale(0) + " " +  yMax + " L " + xScale(0) + " " + yMin);
            scatterPlot.select("#y-axis-label")
                .attrs({"x": xScale(0.0) + 10, "y": yMin});

            var tooltip = d3.select("body").append("div")
                .attr("id", "tooltip-clevr-question-type-clever")
                .attr("class", "tooltip figure-text")
                .style("background", "#ddd")
                .style("border-radius", "6px")
                .style("padding", "10px")
                .style("opacity", 0);

            // Dispatch data points into groups by question type
            scatterPlot.selectAll("g")
                .data(colors)
                .enter().append("g")
                .style("opacity", 1.0)
                .each(function(c, i) {
                    d3.select(this).selectAll("circle")
                        .data(dataset.filter(function(d) { return question_type_mapping[d.type] == i; }))
                        .enter().append("circle")
                        .attrs({
                            "cx": function(d) { return xScale(d.gamma); },
                            "cy": function(d) { return yScale(d.beta); },
                            "r": 3.0,
                        })
                        .style("fill", function(d) { return colors[i]; })
                        .style("opacity", 0.6)
                        .style("cursor", "pointer")
                        .on("mouseover", function(d) {
                            focus(question_type_mapping[d.type]);
                            tooltip.transition()
                                .duration(200)
                                .style("opacity", .9);
                            tooltip.html(d.question.join(" ") + "?")
                                .style("left", (d3.event.pageX + 5) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");
                        })
                        .on("mouseout", function(d) {
                            focusAll();
                            tooltip.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });
                });
        });
    };
    setUp('data/clevr_gamma_beta_words_subcluster_fm_26.json', 'first', 0);
    setUp('data/clevr_gamma_beta_words_subcluster_fm_76.json', 'second', 6);

    var svg = d3.select("#clevr-subcluster-color-diagram > svg");
    var legend = svg.select("#legend");
    var firstPlot = svg.select("#first-plot");
    var secondPlot = svg.select("#second-plot");

    // Create legend
    legend.selectAll("circle")
        .data(colors)
      .enter().append("circle")
        .attrs({
            "cx": 0,
            "cy": function(d, i) { return 20 * i; },
            "r": 6,
            "stroke-width": 20,
            "stroke-opacity": 0,
            "stroke": "red",
        })
        .style("fill", function(d, i) { return colors[i]; })
        .style("cursor", "pointer")
        .style("opacity", 0.6);
    legend.selectAll("text")
        .data(question_types)
      .enter().append("text")
        .attrs({
            "x": 20,
            "y": function(d, i) { return 20 * i; },
            "dy": "0.4em",
        })
        .classed("figure-text", true)
        .style("cursor", "pointer")
        .text(function(d) { return d; });

    // Focuses on all points by resetting the opacities
    var focusAll = function() {
        legend.selectAll("circle")
            .style("opacity", 0.6);
        legend.selectAll("text")
            .style("opacity", 0.6);
        firstPlot.selectAll("g")
            .style("opacity", 1.0);
        secondPlot.selectAll("g")
            .style("opacity", 1.0);
    };

    // Focuses on a single question type by lowering other
    // question type opacities
    var focus = function(j) {
        legend.selectAll("circle")
            .style("opacity", function(d, i) { return i == j ?  0.6 : 0.1; });
        legend.selectAll("text")
            .style("opacity", function(d, i) { return i == j ?  0.6 : 0.1; });
        firstPlot.selectAll("g")
            .style("opacity", function(d, i) { return i == j ?  1.0 : 0.1; })
        secondPlot.selectAll("g")
            .style("opacity", function(d, i) { return i == j ?  1.0 : 0.1; })
    };

    // Add hovering behavior to legend
    legend.selectAll("circle")
        .on("mouseover", function (d, i) {
            focus(i);
        })
        .on("mouseout", focusAll);
    legend.selectAll("text")
        .on("mouseover", function (d, i) {
            focus(i);
        })
        .on("mouseout", focusAll);

    focusAll();
})();

(function() {
    // Get references to important tags
    var svg = d3.select("#clevr-plot-svg");
    var scatterPlot = svg.select("#clevr-plot");
    var boundingBox = scatterPlot.select("rect");
    var legend = svg.select("#clevr-legend");

    // Retrieve scatter plot bounding box coordinates
    var xMin = parseInt(boundingBox.attr("x"));
    var xMax = xMin + parseInt(boundingBox.attr("width"));
    var yMin = parseInt(boundingBox.attr("y"));
    var yMax = yMin + parseInt(boundingBox.attr("height"));

    var colors = [
        "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
        "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50",
        "#8BC34A", "#CDDC39", "#FFEB3B", "#FF9800", "#795548",
        "#9E9E9E",
    ];
    var question_types = [
        "Exists", "Less than", "Greater than", "Count", "Query material",
        "Query size", "Query color", "Query shape", "Equal color",
        "Equal integer", "Equal shape", "Equal size", "Equal material"
    ];
        
    // Ugly workaround for permuted question types in JSON file.
    var question_type_mapping = [1, 5, 11, 6, 8, 0, 9, 7, 12, 3, 10, 2, 4];

    var dataset;
    var xScale;
    var yScale;
    d3.json("data/clevr_tsne.json", function(data) {
        dataset = data.slice(0, 1024);

        // Create scales
        xScale = d3.scaleLinear()
            .domain([d3.min(dataset, function (d) { return d.layer_all.x; }),
                     d3.max(dataset, function (d) { return d.layer_all.x; })])
            .rangeRound([xMin, xMax]);
        yScale = d3.scaleLinear()
            .domain([d3.min(dataset, function (d) { return d.layer_all.y; }),
                     d3.max(dataset, function (d) { return d.layer_all.y; })])
            .rangeRound([yMin, yMax]);

        var tooltip = d3.select("body").append("div")
            .attr("id", "tooltip-tsne-clever")
            .attr("class", "tooltip figure-text")
            .style("background", "#ddd")
            .style("border-radius", "6px")
            .style("padding", "10px")
            .style("opacity", 0);

        // Dispatch data points into groups by question type
        scatterPlot.selectAll("g")
            .data(colors)
          .enter().append("g")
            .style("opacity", 1.0)
            .each(function(c, i) {
                d3.select(this).selectAll("circle")
                    .data(dataset.filter(function(d) { return question_type_mapping[d.question_type] == i; }))
                  .enter().append("circle")
                    .attrs({
                        "cx": function(d) { return xScale(d.layer_all.x); },
                        "cy": function(d) { return yScale(d.layer_all.y); },
                        "r": 3.0,
                    })
                    .style("cursor", "pointer")
                    .style("fill", function(d) { return colors[i]; })
                    .style("opacity", 0.6)
                    .on("mouseover", function(d) {
                        focusType(question_type_mapping[d.question_type]);
                        tooltip.transition()
                             .duration(200)
                             .style("opacity", .9);
                        tooltip.html(d.question + "?")
                             .style("left", (d3.event.pageX + 5) + "px")
                             .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(d) {
                        focusAll();
                        tooltip.transition()
                           .duration(500)
                           .style("opacity", 0);
                    });
            });

        // Create legend
        legend.selectAll("circle")
            .data(question_types)
          .enter().append("circle")
            .attrs({
                "cx": 0,
                "cy": function(d, i) { return 20 * i; },
                "r": 6,
                "stroke-width": 10,
                "stroke-opacity": 0,
                "stroke": "red",
            })
            .style("fill", function(d, i) { return colors[i]; })
            .style("cursor", "pointer")
            .style("opacity", 0.6)
        legend.selectAll("text")
            .data(question_types)
          .enter().append("text")
            .attrs({
                "x": 20,
                "y": function(d, i) { return 20 * i; },
                "dy": "0.4em",
            })
            .classed("figure-text", true)
            .style("cursor", "pointer")
            .text(function(d) { return d; });

        // Focuses on all points by resetting the opacities
        var focusAll = function() {
            legend.selectAll("circle")
                .style("opacity", 0.6);
            legend.selectAll("text")
                .style("opacity", 0.6);
            scatterPlot.selectAll("g")
                .style("opacity", 1.0);
        };

        // Focuses on a single question type by lowering other
        // question type opacities
        var focus = function(j) {
            legend.selectAll("circle")
                .style("opacity", function(d, i) { return i == j ?  0.6 : 0.1; });
            legend.selectAll("text")
                .style("opacity", function(d, i) { return i == j ?  0.6 : 0.1; });
            scatterPlot.selectAll("g")
                .style("opacity", function(d, i) { return i == j ?  1.0 : 0.1; })
        };

        var focusType = function(j) {
            legend.selectAll("circle")
                .style("opacity", function(d, i) { return i == j ?  0.6 : 0.1; });
        };

        // Add hovering behavior to legend
        legend.selectAll("circle")
            .on("mouseover", function (d, i) {
                focus(i);
            })
            .on("mouseout", focusAll);
        legend.selectAll("text")
            .on("mouseover", function (d, i) {
                focus(i);
            })
            .on("mouseout", focusAll);

        focusAll();
    });
    svgPanZoom = require('svg-pan-zoom');
    var panZoom = svgPanZoom('#clevr-plot-svg', {
          viewportSelector: '#tsne-diagram #clevr-plot',
          zoomEnabled: true,
          fit: true,
          center: true,
          minZoom: 0.1,
          controlIconsEnabled: false,
        }).zoomAtPointBy(0.6, {x: -10, y: 180}); 
        
    svg.select("#clevr-zoom").on("click", function(d){
		panZoom.resetZoom()
		panZoom.resetPan()
		panZoom.zoomAtPointBy(0.6, {x: -10, y: 180}); 
	});
       
})();
(function() {
    // Get references to important tags
    var svg = d3.select("#style-transfer-plot-svg");
    var scatterPlot = svg.select("#style-transfer-plot");
    var boundingBox = scatterPlot.select("rect");
    var legend = svg.select("#style-transfer-legend");

    // Retrieve scatter plot bounding box coordinates
    var xMin = parseInt(boundingBox.attr("x"));
    var xMax = xMin + parseInt(boundingBox.attr("width"));
    var yMin = parseInt(boundingBox.attr("y"));
    var yMax = yMin + parseInt(boundingBox.attr("height"));

    var colors = [
        "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
        "#2196F3", "#03A9F4", "#00BCD4",
    ];

    var dataset;
    var xScale;
    var yScale;
    d3.json("data/style_tsne.json", function(data) {
        dataset = {"artists": data.artists, "points": data.points.slice(0, 512)};

        // Create scales
        xScale = d3.scaleLinear()
            .domain([d3.min(dataset.points, function (d) { return d.x; }),
                     d3.max(dataset.points, function (d) { return d.x; })])
            .rangeRound([xMin, xMax]);
        yScale = d3.scaleLinear()
            .domain([d3.min(dataset.points, function (d) { return d.y; }),
                     d3.max(dataset.points, function (d) { return d.y; })])
            .rangeRound([yMin, yMax]);

        var tooltip = d3.select("body").append("div")
            .attr("id", "tooltip-tsne-style-transfer")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Dispatch data points into groups by question type
        scatterPlot.selectAll("g")
            .data(colors)
          .enter().append("g")
            .style("opacity", 1.0)
            .each(function(c, i) {
                d3.select(this).selectAll("circle")
                    .data(dataset.points.filter(function(d) { return d.artist_index == i; }))
                  .enter().append("circle")
                    .attrs({
                        "cx": function(d) { return xScale(d.x); },
                        "cy": function(d) { return yScale(d.y); },
                        "r": 3.0,
                    })
                    .style("cursor", "pointer")
                    .style("fill", function(d) { return colors[i]; })
                    .style("opacity", 0.6)
                    .on("mouseover", function(d) {
                        focusType(d.artist_index);
                        tooltip.transition()
                             .duration(200)
                             .style("opacity", .9);

                        var url = "images/style_images/" + d.filename;

                        tooltip.html("<img src=" + url + " class='loading'/>")
                             .style("left", (d3.event.pageX + 5) + "px")
                             .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(d) {
                        focusAll();
                        tooltip.transition()
                           .duration(500)
                           .style("opacity", 0);
                    });
            });

        // Create legend
        legend.selectAll("circle")
            .data(Object.keys(dataset.artists))
          .enter().append("circle")
            .attrs({
                "cx": 0,
                "cy": function(d, i) { return 20 * i; },
                "r": 6,
                "stroke-width": 10,
                "stroke-opacity": 0,
                "stroke": "red",
            })
            .style("fill", function(d) { return colors[d]; })
            .style("cursor", "pointer")
            .style("opacity", 0.6)
        legend.selectAll("text")
            .data(Object.keys(dataset.artists))
          .enter().append("text")
            .attrs({
                "x": 20,
                "y": function(d, i) { return 20 * i; },
                "dy": "0.4em",
            })
            .classed("figure-text", true)
            .style("cursor", "pointer")
            .text(function(d) { return dataset.artists[d]; });

        // Focuses on all points by resetting the opacities
        var focusAll = function() {
            legend.selectAll("circle")
                .style("opacity", 0.6);
            legend.selectAll("text")
                .style("opacity", 0.6);
            scatterPlot.selectAll("g")
                .style("opacity", 1.0);
        };

        // Focuses on a single question type by lowering other
        // question type opacities
        var focus = function(j) {
            legend.selectAll("circle")
                .style("opacity", function(d, i) { return i == j ?  0.6 : 0.1; });
            legend.selectAll("text")
                .style("opacity", function(d, i) { return i == j ?  0.6 : 0.1; });
            scatterPlot.selectAll("g")
                .style("opacity", function(d, i) { return i == j ?  1.0 : 0.1; })
        };

        var focusType = function(j) {
            legend.selectAll("circle")
                .style("opacity", function(d, i) { return i == j ?  0.6 : 0.1; });
        };

        // Add hovering behavior to legend
        legend.selectAll("circle")
            .on("mouseover", function (d, i) {
                focus(i);
            })
            .on("mouseout", focusAll);
        legend.selectAll("text")
            .on("mouseover", function (d, i) {
                focus(i);
            })
            .on("mouseout", focusAll);

        focusAll();
    });
    
   svgPanZoom = require('svg-pan-zoom');
   var panZoom = svgPanZoom('#style-transfer-plot-svg', {
	  viewportSelector: '#tsne-diagram #style-transfer-plot',
	  zoomEnabled: true,
	  fit: true,
	  center: true,
	  minZoom: 0.1, 
	  controlIconsEnabled: false,
	});
	panZoom.zoomAtPointBy(0.6, {x: -10, y: 180}); 
	
	d3.select("#style-zoom").on("click", function(d){
		panZoom.resetZoom()
		panZoom.resetPan()
		panZoom.zoomAtPointBy(0.6, {x: -10, y: 180}); 
	});
})();
