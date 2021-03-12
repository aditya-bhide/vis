function plot_data(data) {
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


    // append the svg object to the body of the page
    d3.select("#pcp-graph").selectAll("*").remove()

    var svg = d3.select("#pcp-graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    data = data.chart_data

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



    console.log(data)
        // Color scale: give me a specie name, I return a color
    var color = d3.scaleOrdinal()
        .domain(clusters)
        .range([color_pick[0], color_pick[1], color_pick[2]])

    // Here I set the list of dimension manually to control the order of axis:
    dimensions = []
    one_entry = data[0]
    for (var key in one_entry) {
        if (key != 'label') {
            dimensions.push(key)
        }
    }

    // For each dimension, I build a linear scale. I store all in a y object
    var y = {}
    for (i in dimensions) {
        dim_name = dimensions[i]
        y[dim_name] = d3.scaleLinear()
            .domain(d3.extent(data, d => d[dim_name])) // --> Same axis range for each group
            .range([height, 0])
    }

    // Build the X scale -> it find the best position for each Y axis
    x = d3.scalePoint()
        .range([0, width])
        .domain(dimensions);

    // Highlight the specie that is hovered
    var highlight = function(d) {

        selected_specie = d.label

        // first every group turns grey
        d3.selectAll(".line")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", "0.5")

        // Second the hovered specie takes its color
        d3.selectAll("." + selected_specie)
            .transition().duration(200)
            .style("stroke", color(selected_specie))
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

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d) {
        return d3.line()(dimensions.map(function(p) {
            return [x(p), y[p](d[p])];
        }));
    }

    // Draw the lines
    svg
        .selectAll("myPath")
        .data(data)
        .enter()
        .append("path")
        .attr("class", function(d) {
            return "line " + d.label
        }) // 2 class for each line: 'line' and the group name
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", function(d) {
            return (color(d.label))
        })
        .style("opacity", 0.5)
        .on("mouseover", highlight)
        // .on("mouseleave", doNotHighlight)

    // Draw the axis:
    svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        .attr("class", "axis-pcp")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) {
            return "translate(" + x(d) + ")";
        })
        // And I build the axis with the call function
        .each(function(d) {
            d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d]));
        })
        // Add axis title
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -20)
        .attr("transform", "rotate(25)")
        .text(function(d) {
            return d;
        })
        .style("fill", "black")
}