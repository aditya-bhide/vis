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
    $(".mds").hide()
    $(".mds-corr").hide()
    $(".pcp").hide()


    home_display()

    $("#nav-home").click(function() {
        $(".home").show()
        $(".scree-plot").hide()
        $(".biplot").hide()
        $(".mds").hide()
        $(".mds-corr").hide()
        $(".pcp").hide()
    });

    $("#nav-screeplot").click(function() {
        $(".home").hide()
        $(".scree-plot").show()
        $(".biplot").hide()
        $(".mds").hide()
        $(".mds-corr").hide()
        $(".pcp").hide()


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
        $(".mds").hide()
        $(".mds-corr").hide()
        $(".pcp").hide()

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

    $("#nav-mds").click(function() {
        $(".home").hide()
        $(".scree-plot").hide()
        $(".biplot").hide()
        $(".mds").show()
        $(".mds-corr").hide()
        $(".pcp").hide()

        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:5000/mds",
            data: null,
            success: function(response) {
                mds_data_scatterplot(response)
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    $("#nav-mds-corr").click(function() {
        $(".home").hide()
        $(".scree-plot").hide()
        $(".biplot").hide()
        $(".mds").hide()
        $(".mds-corr").show()
        $(".pcp").hide()

        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:5000/pcp",
            data: null,
            success: function(response) {
                plot_pca(response)
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    $("#nav-pcp").click(function() {
        $(".home").hide()
        $(".scree-plot").hide()
        $(".biplot").hide()
        $(".mds").hide()
        $(".mds-corr").hide()
        $(".pcp").show()

        $.ajax({
            type: 'POST',
            url: "http://127.0.0.1:5000/pcp",
            data: null,
            success: function(response) {
                pcp_default(response)
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});