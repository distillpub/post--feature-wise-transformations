function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("figure.figure#dcgan-diagram").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-element, .figure-group, .figure-line, .figure-path")
            .style("fill", null)
            .style("stroke", null);
        svg.selectAll(".figure-text").style("font-size", null);

        // --- Data -----------------------------------------------------------
        var data = [];
        var inputValue = Math.random() * 360;
        var outputValue = inputValue;
        for(var i = 0; i < 9; i++) {
            var theta = Math.random() * 360;
            data.push(theta);
            outputValue += theta

        }
        outputValue = outputValue % 360;

        svg.select("g#input-map")
          .selectAll("path.figure-element")
            .style("fill", "hsl(" + inputValue + ",50%,50%)");

        svg.select("g#kernel")
          .selectAll("path.figure-element")
            .data(data)
            .style("fill", function(d) { return "hsl(" + d + ",50%,50%)"; });

        svg.select("g#output-map")
          .selectAll("path.figure-element")
            .style("fill", "hsl(" + outputValue + ",50%,50%)");
    }

    d3.xml("assets/dcgan.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("figure.figure#dcgan-diagram").each(function () {
            this.insertBefore(xml.documentElement, this.firstChild);
        });
        styleFigure();
    });
}

buildFigure();
