function plot_pca(data) {
    var margin = {
            top: 200,
            right: 80,
            bottom: 50,
            left: 80
        },
        width = 1800 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    color_pick = ["blue", "darkgreen", "red", "black", "grey", "gold", "orange", "pink", "brown", "slateblue", "grey1", "darkgreen"]
    clusters = ["cluster0", "cluster1", "cluster2"]
    clusters_names = ["Cluster 0", "Cluster 1", "Cluster 2"]

    var color = d3.scaleOrdinal()
        .domain(clusters)
        .range([color_pick[0], color_pick[1], color_pick[2]])

    data = data.chart_data

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
        background,
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
            .attr("y", 0)
            .attr("height", 50)
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
        x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
            return d != "label" && (y[d] = d3.scaleLinear()
                .domain(d3.extent(data, function(p) {
                    return +p[d];
                }))
                .range([height, 0]));
        }));

        // Add grey background lines for context.
        background = svg.append("g")
            .attr("class", "background-pcp")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", path);

        // Add blue foreground lines for focus
        foreground = svg.append("g")
            .attr("class", "foreground-pcp")
            .selectAll("path")
            .data(data)
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
                    background.attr("visibility", "hidden");
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
                    background
                        .attr("d", path)
                        .transition()
                        .delay(500)
                        .duration(0)
                        .attr("visibility", null);
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