var svg_width = 900
var svg_height = 500
var categorical = ['origin', 'temp']
var numeric = ['acceleration', 'weight']
var all_attributes = categorical.concat(numeric)
console.log(all_attributes)
var csv_file = "https://vizhub.com/curran/datasets/auto-mpg.csv"
    //student-por.csv
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