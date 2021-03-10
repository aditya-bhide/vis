let select_bar = false
let select_bar_index = 0

function home_display() {
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:5000/init_home",
        data: {},
        success: function(response) {
            console.log(response)
        },
        error: function(error) {
            console.log(error);
        }
    });

}

$(document).ready(function() {
    $(".home").show()
    $(".scree-plot").hide()
    $(".biplot").hide()

    home_display()

    $("#nav-home").click(function() {
        $(".home").show()
        $(".scree-plot").hide()
        $(".biplot").hide()
    });

    $("#nav-screeplot").click(function() {
        $(".home").hide()
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
        $(".home").hide()
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