var svg_width = 1400
var svg_height = 700
var categorical = ["nationality", "preferred_foot", "team_position", "skill_moves", "international_reputation"]
var data = null
var numeric = ["age", "height_cm", "weight_kg", "overall", "value_EUR", "wage_EUR", "pace", "shooting", "dribbling", "defending", "physic"]
var all_attributes = categorical.concat(numeric)
var csv_file = "data/FIFA20_dataset_preprocessed.csv"

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