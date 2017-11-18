function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("figure.figure#film-as-bilinear-diagram").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-element, .figure-group, .figure-line, .figure-path")
            .style("fill", null)
            .style("stroke", null);
        svg.selectAll(".figure-text").style("font-size", null);

        // --- Data -----------------------------------------------------------
        var dataW1 = [];
        var dataW2 = [];
        var dataW3 = [];
        for(var i = 0; i < 6; i++) {
            dataW1.push(Math.random() * 360);
            dataW2.push(Math.random() * 360);
            dataW3.push(Math.random() * 360);
        }

        svg.select("#w-1")
          .selectAll("path")
            .data(dataW1)
            .style("fill", function(d) { return "hsl(" + d + ",50%,50%)"; });
        svg.select("#w-1-full")
          .selectAll("path")
            .filter(function() {
               return !this.classList.contains('figure-faded')
             })
            .data(dataW1)
            .style("fill", function(d) { return "hsl(" + d + ",50%,50%)"; });

        svg.select("#w-2")
          .selectAll("path")
            .data(dataW2)
            .style("fill", function(d) { return "hsl(" + d + ",50%,50%)"; });
        svg.select("#w-2-full")
          .selectAll("path")
            .filter(function() {
               return !this.classList.contains('figure-faded')
             })
            .data(dataW2)
            .style("fill", function(d) { return "hsl(" + d + ",50%,50%)"; });

        svg.select("#w-3")
          .selectAll("path")
            .data(dataW3)
            .style("fill", function(d) { return "hsl(" + d + ",50%,50%)"; });
        svg.select("#w-3-full")
          .selectAll("path")
            .filter(function() {
               return !this.classList.contains('figure-faded')
             })
            .data(dataW3)
            .style("fill", function(d) { return "hsl(" + d + ",50%,50%)"; });
    }

    d3.xml("assets/film_as_bilinear.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("figure.figure#film-as-bilinear-diagram").each(function () {
            this.insertBefore(xml.documentElement, this.firstChild);
        });
        styleFigure();
    });
}

buildFigure();
