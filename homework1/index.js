var svg_width = 900
var svg_height = 500
$(document).ready(function() {
    $("#barchart-nav").click(function() {
        $("#barchart").show();
        $("#histogram").hide();
        $("#scatterplot").hide();
    });

    $("#histogram-nav").click(function() {
        $("#barchart").hide();
        $("#histogram").show();
        $("#scatterplot").hide();
    });

    $("#scatterplot-nav").click(function() {
        $("#barchart").hide();
        $("#histogram").hide();
        $("#scatterplot").show();
    });
});