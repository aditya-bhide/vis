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
            // if (i != "label") {
            //     attribute_list.push(i)
            // }
            attribute_dict[i] = false
        }

        graph_title = "MDS variables plot"


        xValue = d => d.value.dim1
        yValue = d => d.value.dim2
        fValue = d => d.value.feature
        colorValue = d => d.value.label

        xAxisLabel = 'Dimension 1'
        yAxisLabel = 'Dimension 2'
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
                    console.log()
                }
                d3.select(this).style("fill", "steelblue").style("fill-opacity", 0.7);
            }

            pcp_generate(data_pcp, attribute_list)
        }
    }
}

function pcp_generate(data_pcp, traits) {
    /// PCA part ///
    dragging = {};
    var background;
    var m = [200, 80, 50, 80],
        w = 1300 - m[1] - m[3],
        h = 900 - m[0] - m[2];

    var x = d3.scalePoint().domain(traits).range([0, w]),
        y = {};
    var line = d3.line(),
        axis = d3.axisLeft(),
        foreground;

    color_pick = ["slateblue", "brown", "gold", "black", "grey", "red", "orange", "pink", "darkgreen", "slateblue", "grey1", "darkgreen"]
    clusters = ["cluster0", "cluster1", "cluster2"]
    clusters_names = ["Cluster 0", "Cluster 1", "Cluster 2"]


    d3.select("#pcp-graph").selectAll("*").remove()
    console.log(d3.select("#pcp-graph").selectAll("*").remove())
    $(document).ready(function() {

        var svg = d3.select("#pcp-graph").append("svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .append("g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        graph_title = "Parallel Coordinates Plot"
        svg.append('text')
            .attr('fill', 'black')
            .attr('y', -150)
            .attr('x', w / 2)
            .text(graph_title)
            .style("font-size", "4em")
            .style("text-anchor", "middle");

        legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${w-450}, -150)`);

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
            .append("line")
            .attr("x1", function(d, i) { return 20 + i * 140 })
            .attr("y1", 25) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("x2", function(d, i) { return 35 + i * 140 })
            .attr("y2", 25)
            .style("stroke", function(d, i) { return color_pick[i] })
            .style("stroke-width", "2px")

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

        // Create a scale and brush for each trait.
        traits.forEach(function(d) {
            // Coerce values to numbers.
            data_pcp.forEach(function(p) {
                p[d] = +p[d];
            });
            y[d] = d3.scaleLinear()
                .domain(d3.extent(data_pcp, function(p) {
                    return p[d];
                }))
                .range([h, 0]);
            y[d].brush = d3.brushY()
                .extent([
                    [-7, y[d].range()[1]],
                    [7, y[d].range()[0]]
                ]) //刷子范围
                .on("brush", brush)
                .on("start", brushstart)
                .on("end", brush);
        });

        background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(data_pcp)
            .enter().append("path")
            .attr("d", path)

        // Add foreground lines.
        foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(data_pcp)
            .enter().append("path")
            .attr("d", path)
            .style("stroke", function(d) {
                return (color_pick[parseInt(d.label)])
            });;

        // Add a group element for each trait.
        var g = svg.selectAll(".trait")
            .data(traits)
            .enter().append("svg:g")
            .attr("class", "trait")
            .attr("transform", function(d) {
                return "translate(" + x(d) + ")";
            })
            .call(d3.drag()
                .subject(function(d) {
                    return {
                        x: x(d)
                    };
                })
                .on("start", function(d) {
                    dragging[d] = x(d);
                    background.attr("visibility", "hidden");
                })
                .on("drag", function(d) {
                    dragging[d] = Math.min(w, Math.max(0, d3.event.x));
                    foreground.attr("d", path);
                    traits.sort(function(a, b) {
                        return position(a) - position(b);
                    });
                    x.domain(traits);
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
                })
            );

        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis-pcp")
            .each(function(d) {
                d3.select(this).call(d3.axisLeft(y[d]));
            })
            .append("svg:text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(30)")
            .style("opacity", 1)
            .attr("y", -20)
            .text(function(d) {
                return d;
            });

        // Add a brush for each axis.
        g.append("svg:g")
            .attr("class", "brush")
            .each(function(d) {
                d3.select(this).call(y[d].brush);
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);


        function position(d) {
            var v = dragging[d];
            return v == null ? x(d) : v;
        }

        function transition(g) {
            return g.transition().duration(500);
        }
        // Returns the path for a given data point.
        function path(d) {
            return line(traits.map(function(p) {
                return [position(p), y[p](d[p])];
            }));
        }


        function dragstart(d) {
            i = traits.indexOf(d);
        }

        function drag(d) {
            x.range()[i] = d3.event.x; //unsovled issue
            traits.sort(function(a, b) {
                return x(a) - x(b);
            });
            g.attr("transform", function(d) {
                return "translate(" + x(d) + ")";
            });
            foreground.attr("d", path);
        }

        function dragend(d) {
            //            x.domain(traits).rangePoints([0, w]);
            var t = d3.transition().duration(500);
            t.selectAll(".trait").attr("transform", function(d) {
                return "translate(" + x(d) + ")";
            });
            t.selectAll(".foreground path").attr("d", path);
        }


        function brushstart() {
            d3.event.sourceEvent.stopPropagation();
        }
        // Handles a brush event, toggling the display of foreground lines.
        function brush() {
            var actives = [];
            //filter brushed extents
            svg.selectAll(".brush")
                .filter(function(d) {
                    return d3.brushSelection(this);
                })
                .each(function(d) {
                    actives.push({
                        dimension: d,
                        extent: d3.brushSelection(this)
                    });
                });
            //set un-brushed foreground line disappear
            foreground.classed("fade", function(d, i) {
                return !actives.every(function(active) {
                    var dim = active.dimension;
                    return active.extent[0] <= y[dim](d[dim]) && y[dim](d[dim]) <= active.extent[1];
                });
            });
        }
    });
}

function default_pcp(data_total) {
    data_pcp = data_total.chart_data
    temp = []
    for (var i in data_pcp[0]) {
        if (i != "label") {
            temp.push(i)
        }
    }
    pcp_generate(data_pcp, temp)
}