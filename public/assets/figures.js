// === Array of all looping functions =========================================
var loopFunctions = [];

// === FiLM Layer figure ======================================================
var buildFilmLayerFigure = function () {
    // Get the div element for this figure
    var div = d3.select("div.figure#film-layer");

    // Define figure parameters
    var aspectRatio = 9.0 / 16.0;
    var width = div.node().getBoundingClientRect().width;
    var height = Math.floor(aspectRatio * width);
    var padding = 10;
    var nodes = [0, 1, 2, 3];
    var nodeRadius = 20;

    // Define scales
    var xScale = d3.scaleBand()
        .domain(["left", "right"])
        .rangeRound([padding, width - padding]);
    var yScale = d3.scaleBand()
        .domain(nodes)
        .rangeRound([padding, height - padding]);

    // Create scale-dependent constants and functions
    var xLeft = Math.floor(xScale("left") + xScale.bandwidth() / 2.0);
    var xRight = Math.floor(xScale("right") + xScale.bandwidth() / 2.0);
    var yFunction = function(d) {
        return Math.floor(yScale(d) + yScale.bandwidth() / 2.0);
    };

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
    var information = svg.append("g")
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

    // Add properties to figure elements
    edges.attr("class", "edge")
        .attr("x1", xLeft)
        .attr("y1", yFunction)
        .attr("x2", xRight)
        .attr("y2", yFunction);
    information.attr("class", "information")
        .attr("cx", xLeft)
        .attr("cy", yFunction)
        .attr("r", 5);
    nodesLeft.attr("class", "node")
        .attr("cx", xLeft)
        .attr("cy", yFunction)
        .attr("r", nodeRadius);
    nodesRight.attr("class", "node")
        .attr("cx", xRight)
        .attr("cy", yFunction)
        .attr("r", nodeRadius);

    // Create and return looping function
    var loopFunction = function() {
        information.transition()
            .duration(1000)
            .attr("cx", xRight)
            .on("end", function() {
                d3.select(this).attr("cx", xLeft);
                loopFunction();
            });
    };
    return loopFunction;
};

loopFunctions.push(buildFilmLayerFigure());

// === Call all looping functions =============================================
var loop = function() {
    for(var i = 0; i < loopFunctions.length; i++) {
        loopFunctions[i]();
    }
};
loop();
