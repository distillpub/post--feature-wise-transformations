function buildFigure () {
    function styleFigure () {
        // --- Retrieve svg element -------------------------------------------
        var svg = d3.select("div.figure#squeeze-diagram").select("svg");

        // --- Clear element-specific styling ---------------------------------
        svg.selectAll(".figure-layer").style("fill", null);
        svg.selectAll(".figure-network").style("fill", null);
        svg.selectAll(".figure-text").style("font-size", null);
    }

    d3.xml("assets/squeeze.svg").mimeType("image/svg+xml").get(function(error, xml) {
        if (error) throw error;
        d3.select("div.figure#squeeze-diagram").each(function () {
            this.appendChild(xml.documentElement);
        });
        styleFigure();
    });
}

buildFigure();
