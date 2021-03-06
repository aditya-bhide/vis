$(document).ready(function() {
    let di
    $("#select-intrinsic-dimentionality-index").click(function() {
        di = $("#intrinsic-dimentionality-index").text()
        console.log(JSON.stringify(di))
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
});