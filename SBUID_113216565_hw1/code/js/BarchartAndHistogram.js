function init_barchart_and_histogram() {
    let attribute = document.getElementById("barchart-and-histogram-set-attribute").value
    if (categorical.includes(attribute)) {
        $("#barchartgraph").show();
        $("#histogramgraph").hide();
        callbarchart(attribute)

    } else {
        $("#barchartgraph").hide();
        $("#histogramgraph").show();
        callhistogram(attribute)
    }
}

$("#barchart-and-histogram-set-attribute").change(function() {
    let attribute = this.value;
    if (categorical.includes(attribute)) {
        $("#barchartgraph").show()
        $("#histogramgraph").hide()
        let svg = d3.select("#barchartgraph");
        svg.selectAll("*").remove();
        callbarchart(attribute)
    } else {
        $("#barchartgraph").hide()
        $("#histogramgraph").show()
        let svg = d3.select("#histogramgraph");
        svg.selectAll("*").remove();
        callhistogram(attribute)
    }
});