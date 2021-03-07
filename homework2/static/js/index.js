$(document).ready(function() {
    $(".scree-plot").hide()
    $(".biplot").hide()

    $("#select-intrinsic-dimentionality-index").click(function() {
        let di
        di = $("#intrinsic-dimentionality-index").text()
        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:5000/id_index",
            data: { 'data': di },
            success: function(response) {
                show_table(response["feature_data"])
                scatterplot_matrix(response["chart_data"])
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    $("#nav-screeplot").click(function() {
        $(".scree-plot").show()
        $(".biplot").hide()
        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:5000/screeplot",
            data: {},
            success: function(response) {
                scree_plot(response)
            },
            error: function(error) {
                console.log(error);
            }
        });
    });


    $("#nav-biplot").click(function() {
        $(".scree-plot").hide()
        $(".biplot").show()
        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:5000/biplot",
            data: null,
            success: function(response) {
                biplot(response)
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

});