var svg_width = 900
var svg_height = 500
var categorical = ['origin']
var numeric = ['acceleration', 'weight', 'displacement']
var all_attributes = categorical.concat(numeric)
var csv_file = "https://vizhub.com/curran/datasets/auto-mpg.csv"
    //student-por.csv
$(document).ready(function() {
    $("#barchart-and-histogram-nav").click(function() {
        $("#barchart-and-histogram").show();
        $("#scatterplot").hide();
    });

    $("#scatterplot-nav").click(function() {
        $("#barchart-and-histogram").hide();
        $("#scatterplot").show();
    });
});