var svg_width = 900
var svg_height = 500
var categorical = ["sex"]
var data = null
var numeric = ["absences", "G1"]
var all_attributes = categorical.concat(numeric)
var csv_file = "student-por.csv"

// d3.csv(csv_file, (mydata) => {
//     data = 
// });
// var csv_file = "https://vizhub.com/curran/datasets/auto-mpg.csv"
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