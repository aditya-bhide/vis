function plot_pca(data_total) {
    if (d3.select("#svg-mds-scatterplot-graph-attr").empty()) {
        let svg_width = 500
        let svg_height = 500

        let circleRadius = 7
        var margin = { top: 60, right: 40, bottom: 80, left: 100 },
            width = svg_width - margin.left - margin.right,
            height = svg_height - margin.top - margin.bottom;

        color_pick = ["blue", "green", "red", "black", "grey", "gold", "orange", "pink", "brown", "slateblue", "grey1", "darkgreen"]
        keys = ["Cluster 1", "Cluster 2", "Cluster 3"]

        data_mds = d3.entries(data_total.chart_attr_data)

        data_pcp = data_total.chart_data

        attribute_list = []
        attribute_dict = {}

        for (var i in data_pcp[0]) {
            // attribute_list.push(i)
            attribute_dict[i] = false
        }

        graph_title = "MDS variables plot"


        xValue = d => d.value.dim1
        yValue = d => d.value.dim2
        fValue = d => d.value.feature
        colorValue = d => d.value.label

        xAxisLabel = 'Dimention 1'
        yAxisLabel = 'Dimention 2'
        var svg = d3.select("#mds-scatterplot-graph-attr")
            .append("svg")
            .attr("id", "svg-mds-scatterplot-graph-attr")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        svg.append('text')
            .attr('fill', 'black')
            .attr('y', -10)
            .attr('x', width / 2)
            .text(graph_title)
            .attr("text-anchor", "middle")
            .style("font-size", "3em")

        var xScale = d3.scaleLinear()
            .domain([d3.min(data_mds, xValue) * 1.05, d3.max(data_mds, xValue) * 1.05])
            .range([0, width])
            .nice();

        var xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        xAxis.append('text')
            .attr('fill', 'black')
            .attr('y', 50)
            .attr('x', width / 2)
            .text(xAxisLabel)
            .style("font-size", "2.5em");

        var yScale = d3.scaleLinear()
            .domain([d3.min(data_mds, yValue) - 0.1, d3.max(data_mds, yValue) + 0.1])
            .range([height, 0])
            .nice();

        var yAxis = svg.append("g")
            .call(d3.axisLeft(yScale));

        yAxis.append('text')
            .attr('fill', 'black')
            .attr('y', -40)
            .attr('x', -height / 2)
            .text(yAxisLabel)
            .style('text-anchor', 'middle')
            .style("font-size", "2.5em")
            .attr('transform', 'rotate(-90)');

        svg.append("g").selectAll('circle').data(data_mds)
            .enter().append('circle')
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("click", click)
            .attr('cy', d => yScale(yValue(d)))
            .attr('cx', d => xScale(xValue(d)))
            .attr('r', circleRadius)
            .style("fill", "steelblue")
            .style("fill-opacity", 0.7)

        d3.selectAll(".tooltip").remove()
        let div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        function mouseover(d) {
            if (!attribute_dict[fValue(d)]) {
                d3.select(this).style("fill", "red");
            } else {
                d3.select(this).style("fill", "red").style("fill-opacity", 0.7)
            }


            div.html(fValue(d))
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 15) + "px")
                .style("opacity", 1);
        }

        function mouseout(d) {
            if (!attribute_dict[fValue(d)]) {
                d3.select(this).style("fill", "steelblue");
            } else {
                d3.select(this).style("fill", "red").style("fill-opacity", 1)
            }
            div.style("opacity", 0);
            clicked_circle = false
        }

        function click(d) {
            clicked_circle = true
            attribute_dict[fValue(d)] = !attribute_dict[fValue(d)]

            if (attribute_dict[fValue(d)]) {
                attribute_list.push(fValue(d))
                d3.select(this).style("fill", "red").style("fill-opacity", 1)
            } else {
                var index = attribute_list.indexOf(fValue(d));
                if (index !== -1) {
                    attribute_list.splice(index, 1);
                }
                d3.select(this).style("fill", "steelblue").style("fill-opacity", 0.7);
            }

            pcp_generate(data_pcp, attribute_list)
        }
    }
}

function pcp_generate(data_pcp, attribute_list) {
    /// PCA part ///
    var margin = {
            top: 200,
            right: 82,
            bottom: 50,
            left: 82
        },
        width = 1300 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    color_pick = ["blue", "darkgreen", "red", "black", "grey", "gold", "orange", "pink", "brown", "slateblue", "grey1", "darkgreen"]
    clusters = ["cluster0", "cluster1", "cluster2"]
    clusters_names = ["Cluster 0", "Cluster 1", "Cluster 2"]

    var color = d3.scaleOrdinal()
        .domain(clusters)
        .range([color_pick[0], color_pick[1], color_pick[2]])


    var x = d3.scalePoint().range([0, width], 1),
        y = {},
        dragging = {};

    // Highlight the specie that is hovered
    var highlight = function(d) {

        label = d.label

        // first every group turns grey
        d3.selectAll(".line")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", "0.5")

        // Second the hovered specie takes its color
        d3.selectAll("." + label)
            .transition().duration(200)
            .style("stroke", color(label))
            .style("opacity", "1")
    }

    // Unhighlight
    var doNotHighlight = function(d) {
        d3.selectAll(".line")
            .transition().duration(200).delay(1000)
            .style("stroke", function(d) {
                return (color(d.label))
            })
            .style("opacity", "1")
    }

    var line = d3.line(),
        axis = d3.axisLeft(),
        // background,
        foreground;


    d3.select("#pcp-graph").selectAll("*").remove()
    $(document).ready(function() {

        var svg = d3.select("#pcp-graph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        graph_title = "Parallel Coordinates Plot"
        svg.append('text')
            .attr('fill', 'black')
            .attr('y', -150)
            .attr('x', width / 2)
            .text(graph_title)
            .style("font-size", "4em")
            .style("text-anchor", "middle");

        legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width-450}, -150)`);

        legend.append('rect')
            .attr("x", 0)
            .attr("y", 10)
            .attr("height", 30)
            .attr("width", 450)
            .style("fill", "none")
            .style("stroke", "black");

        legend.selectAll("mydots")
            .data(clusters_names)
            .enter()
            .append("circle")
            .attr("cx", function(d, i) { return 30 + i * 140 })
            .attr("cy", 25) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d, i) { return color_pick[i] })

        legend.selectAll("mylabels")
            .data(clusters_names)
            .enter()
            .append("text")
            .attr("x", function(d, i) { return 45 + i * 140 })
            .attr("y", 27) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d) { return color_pick[d] })
            .text(function(d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .style("font-size", "2em")

        // Extract the list of dimensions and create a scale for each.
        x.domain(dimensions = attribute_list.filter(function(d) {
            return d != "label" && (y[d] = d3.scaleLinear()
                .domain(d3.extent(data_pcp, function(p) {
                    return +p[d];
                }))
                .range([height, 0]));
        }));

        // Add grey background lines for context.
        // background = svg.append("g")
        //     .attr("class", "background-pcp")
        //     .selectAll("path")
        //     .data(data_pcp)
        //     .enter().append("path")
        //     .attr("d", path);

        // Add blue foreground lines for focus
        foreground = svg.append("g")
            .attr("class", "foreground-pcp")
            .selectAll("path")
            .data(data_pcp)
            .enter().append("path")
            .attr("class", function(d) {
                return "line " + d.label
            })
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", function(d) {
                return (color(d.label))
            })
            .style("opacity", 0.5)
            .on("mouseover", highlight)
            .on("mouseout", doNotHighlight);

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) {
                return "translate(" + x(d) + ")";
            });

        // Add an axis and title.
        g.append("g")
            .attr("class", "axis-pcp")
            .each(function(d) {
                d3.select(this).call(axis.scale(y[d]));
            })
            .append("text")
            .style("text-anchor", "middle")
            .attr("transform", "rotate(25)")
            .attr("y", -40)
            .text(function(d) {
                return d;
            })
            .style("fill", "black");

        function position(d) {
            var v = dragging[d];
            return v == null ? x(d) : v;
        }

        function transition(g) {
            return g.transition().duration(500);
        }

        // Returns the path for a given data point.
        function path(d) {
            return line(dimensions.map(function(p) {
                return [position(p), y[p](d[p])];
            }));
        }

    });
}

function pcp_default(data) {

    /// PCA part ///
    var margin = {
            top: 200,
            right: 82,
            bottom: 50,
            left: 82
        },
        width = 1800 - margin.left - margin.right,
        height = 900 - margin.top - margin.bottom;

    color_pick = ["blue", "darkgreen", "red", "black", "grey", "gold", "orange", "pink", "brown", "slateblue", "grey1", "darkgreen"]
    clusters = ["cluster0", "cluster1", "cluster2"]
    clusters_names = ["Cluster 0", "Cluster 1", "Cluster 2"]

    data_pcp = data.chart_data

    var color = d3.scaleOrdinal()
        .domain(clusters)
        .range([color_pick[0], color_pick[1], color_pick[2]])


    var x = d3.scalePoint().range([0, width], 1),
        y = {},
        dragging = {};

    // Highlight the specie that is hovered
    var highlight = function(d) {

        label = d.label

        // first every group turns grey
        d3.selectAll(".line")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", "0.5")

        // Second the hovered specie takes its color
        d3.selectAll("." + label)
            .transition().duration(200)
            .style("stroke", color(label))
            .style("opacity", "1")
    }

    // Unhighlight
    var doNotHighlight = function(d) {
        d3.selectAll(".line")
            .transition().duration(200).delay(1000)
            .style("stroke", function(d) {
                return (color(d.label))
            })
            .style("opacity", "1")
    }

    var line = d3.line(),
        axis = d3.axisLeft(),
        // background,
        foreground;


    $(document).ready(function() {
        d3.select("#default-pcp-graph").selectAll("*").remove()
        var svg = d3.select("#default-pcp-graph").append("svg")
            .attr("id", "svg-default-pcp-graph")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        graph_title = "Parallel Coordinates Plot"
        svg.append('text')
            .attr('fill', 'black')
            .attr('y', -150)
            .attr('x', width / 2)
            .text(graph_title)
            .style("font-size", "4em")
            .style("text-anchor", "middle");

        legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width-450}, -150)`);

        legend.append('rect')
            .attr("x", 0)
            .attr("y", 10)
            .attr("height", 30)
            .attr("width", 450)
            .style("fill", "none")
            .style("stroke", "black");

        legend.selectAll("mydots")
            .data(clusters_names)
            .enter()
            .append("circle")
            .attr("cx", function(d, i) { return 30 + i * 140 })
            .attr("cy", 25) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d, i) { return color_pick[i] })

        legend.selectAll("mylabels")
            .data(clusters_names)
            .enter()
            .append("text")
            .attr("x", function(d, i) { return 45 + i * 140 })
            .attr("y", 27) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d) { return color_pick[d] })
            .text(function(d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .style("font-size", "2em")

        // Extract the list of dimensions and create a scale for each.
        x.domain(dimensions = d3.keys(data_pcp[0]).filter(function(d) {
            return d != "label" && (y[d] = d3.scaleLinear()
                .domain(d3.extent(data_pcp, function(p) {
                    return +p[d];
                }))
                .range([height, 0]));
        }));

        // Add blue foreground lines for focus
        foreground = svg.append("g")
            .attr("class", "foreground-pcp")
            .selectAll("path")
            .data(data_pcp)
            .enter().append("path")
            .attr("class", function(d) {
                return "line " + d.label
            })
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", function(d) {
                return (color(d.label))
            })
            .style("opacity", 0.5)
            .on("mouseover", highlight)
            .on("mouseout", doNotHighlight);

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) {
                return "translate(" + x(d) + ")";
            })
            .call(d3.drag()

                .on("start", function(d) {
                    dragging[d] = x(d);
                })
                .on("drag", function(d) {
                    dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                    foreground.attr("d", path);
                    dimensions.sort(function(a, b) {
                        return position(a) - position(b);
                    });
                    x.domain(dimensions);
                    g.attr("transform", function(d) {
                        return "translate(" + position(d) + ")";
                    })
                })
                .on("end", function(d) {
                    delete dragging[d];
                    transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                    transition(foreground).attr("d", path);

                }));

        // Add an axis and title.
        g.append("g")
            .attr("class", "axis-pcp")
            .each(function(d) {
                d3.select(this).call(axis.scale(y[d]));
            })
            .append("text")
            .style("text-anchor", "middle")
            .attr("transform", "rotate(25)")
            .attr("y", -40)
            .text(function(d) {
                return d;
            })
            .style("fill", "black");

        function position(d) {
            var v = dragging[d];
            return v == null ? x(d) : v;
        }

        function transition(g) {
            return g.transition().duration(500);
        }

        // Returns the path for a given data point.
        function path(d) {
            return line(dimensions.map(function(p) {
                return [position(p), y[p](d[p])];
            }));
        }

    });

}