var buildFigure = function () {
    // Get the div element for this figure
    var div = d3.select("div.figure#film-mlp");

    // Define figure parameters
    var aspectRatio = 0.6;
    var width = div.node().getBoundingClientRect().width;
    var height = Math.floor(aspectRatio * width);
    var ratio = 0.4;
    var topHeight = Math.floor(ratio * height);
    var botHeight = height - topHeight;
    var nodes = [0, 1, 2, 3];
    var nodeRadius = 20;

    // Define scales
    var xScale = d3.scaleBand()
        .domain(["left", "right"])
        .rangeRound([0, width]);
    var yScale = d3.scaleBand()
        .domain(nodes)
        .rangeRound([topHeight, height]);

    // Create scale-dependent constants and functions
    var xLeft = Math.floor(xScale("left") + xScale.bandwidth() / 2.0);
    var xRight = Math.floor(xScale("right") + xScale.bandwidth() / 2.0);
    var xCenter = Math.floor(0.5 * width);
    var xFunction = d3.scaleBand()
        .domain(nodes)
        .rangeRound([
            xCenter - Math.floor(0.3 * width / 2),
            xCenter - Math.floor(0.3 * width / 2) + Math.floor(0.3 * width)
        ]);
    var yFunction = function(d) {
        return Math.floor(yScale(d) + yScale.bandwidth() / 2.0);
    };

    // Create time scale
    var tScale = d3.scaleLinear()
        .domain([xLeft, xRight])
        .range([0, 2000]);

    // Create SVG element inside div element
    var svg = div.append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create figure elements inside SVG element
    var edges = svg.append("g")
        .selectAll("line")
        .data(nodes)
        .enter()
        .append("line")
    var conditioningEdges = svg.append("g")
        .selectAll("line")
        .data(nodes)
        .enter()
        .append("line")
    var information = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
    var conditioningInformation = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
    var nodesLeft = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
    var nodesRight = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
    var mapping = svg.append("rect");
    var inputLabel = svg.append("text");
    var outputLabel = svg.append("text");
    var conditioningLabel = svg.append("text");

    // Add properties to figure elements
    edges.attr("class", "edge")
        .attr("x1", xLeft)
        .attr("y1", yFunction)
        .attr("x2", xRight)
        .attr("y2", yFunction);
    conditioningEdges.attr("class", "edge")
        .style("stroke-width", 1)
        .attr("x1", function(d) { return xFunction(d) + Math.floor(xFunction.bandwidth() / 2); })
        .attr("y1", Math.floor((0.4 + 0.5 * 0.35) * topHeight))
        .attr("x2", function(d) { return xFunction(d) + Math.floor(xFunction.bandwidth() / 2); })
        .attr("y2", yFunction);
    information.attr("class", "information")
        .attr("cx", xLeft)
        .attr("cy", yFunction)
        .attr("r", 5);
    conditioningInformation.attr("class", "information")
        .attr("cx", function(d) { return xFunction(d) + Math.floor(xFunction.bandwidth() / 2); })
        .attr("cy", Math.floor((0.4 + 0.5 * 0.35) * topHeight))
        .attr("r", 5);
    nodesLeft.attr("class", "node")
        .attr("cx", xLeft)
        .attr("cy", yFunction)
        .attr("r", nodeRadius);
    nodesRight.attr("class", "node")
        .attr("cx", xRight)
        .attr("cy", yFunction)
        .attr("r", nodeRadius);
    mapping.attr("class", "box")
        .attr("x", xCenter - Math.floor(0.3 * width / 2))
        .attr("y", Math.floor(0.4 * topHeight))
        .attr("width", Math.floor(0.3 * width))
        .attr("height", Math.floor(0.35 * topHeight));
    inputLabel.attr("class", "label")
        .attr("x", xLeft)
        .attr("y", topHeight - 10)
        .attr("text-anchor", "middle")
        .text("Input");
    outputLabel.attr("class", "label")
        .attr("x", xRight)
        .attr("y", topHeight - 10)
        .attr("text-anchor", "middle")
        .text("Output");
    conditioningLabel.attr("class", "label")
        .attr("x", xCenter)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text("Conditioning information");

    // Create and return looping function
    var loopFunction = function() {
        information.transition()
            .duration(function(d) { return tScale(xFunction(d)); })
            .ease(d3.easeLinear)
            .attr("cx", xFunction)
            .on("end", function() {
                d3.select(this).style("fill", "grey")
                    .style("stroke", "grey");
            })
            .transition()
            .duration(function(d) { return 2000 - tScale(xFunction(d)); })
            .ease(d3.easeLinear)
            .attr("cx", xRight)
            .on("end", function() {
                d3.select(this).attr("cx", xLeft)
                    .style("fill", "black")
                    .style("stroke", "black");
                loopFunction();
            });
        conditioningInformation.transition()
            .duration(function(d) { return tScale(xFunction(d) + Math.floor(xFunction.bandwidth() / 2)); })
            .ease(d3.easeLinear)
            .attr("cy", yFunction)
            .on("end", function() {
                d3.select(this).attr("cy", Math.floor((0.4 + 0.5 * 0.35) * topHeight));
            });
    };

    loopFunction();
};

buildFigure();
