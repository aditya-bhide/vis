function mds_data_scatterplot(data) {
    let svg_width = 1250
    let svg_height = 800

    let circleRadius = 7
    var margin = { top: 60, right: 40, bottom: 80, left: 100 },
        width = svg_width - margin.left - margin.right,
        height = svg_height - margin.top - margin.bottom;

    color_pick = ["blue", "green", "red", "black", "grey", "gold", "orange", "pink", "brown", "slateblue", "grey1", "darkgreen"]
    keys = ["Cluster 1", "Cluster 2", "Cluster 3"]

    data = d3.entries(data.chart_data)

    graph_title = "MDS scatterplot"

    xValue = d => d.value.dim1
    yValue = d => d.value.dim2
    colorValue = d => d.value.label

    xAxisLabel = 'Dimention 1'
    yAxisLabel = 'Dimention 2'

    d3.select("#mds-scatterplot-graph-data").selectAll("*").remove()
    var svg = d3.select("#mds-scatterplot-graph-data")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add one dot in the legend for each name.

    legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width-120}, 0)`);

    legend.append('rect')
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", 100)
        .attr("width", 120)
        .style("fill", "none")
        .style("stroke", "black");

    legend.selectAll("mydots")
        .data(keys)
        .enter()
        .append("circle")
        .attr("cx", 18)
        .attr("cy", function(d, i) { return 30 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d, i) { return color_pick[i] })

    legend.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", 28)
        .attr("y", function(d, i) { return 32 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d) { return color_pick[d] })
        .text(function(d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "2em")

    svg.append('text')
        .attr('fill', 'black')
        .attr('y', -10)
        .attr('x', width / 3)
        .text(graph_title)
        .style("font-size", "4em")

    var xScale = d3.scaleLinear()
        .domain([d3.min(data, xValue) * 1.05, d3.max(data, xValue) * 1.05])
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
        .domain([d3.min(data, yValue) - 0.1, d3.max(data, yValue) + 0.1])
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

    svg.append("g").selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', circleRadius)
        .style("fill", d => color_pick[colorValue(d)]);

}

function mds_attr_scatterplot(data) {
    let svg_width = 1250
    let svg_height = 800

    let circleRadius = 7
    var margin = { top: 60, right: 40, bottom: 80, left: 100 },
        width = svg_width - margin.left - margin.right,
        height = svg_height - margin.top - margin.bottom;

    color_pick = ["blue", "green", "red", "black", "grey", "gold", "orange", "pink", "brown", "slateblue", "grey1", "darkgreen"]
    keys = ["Cluster 1", "Cluster 2", "Cluster 3"]

    data = d3.entries(data.chart_attr_data)
    graph_title = "MDS scatterplot"

    xValue = d => d.value.dim1
    yValue = d => d.value.dim2
    colorValue = d => d.value.label

    xAxisLabel = 'Dimention 1'
    yAxisLabel = 'Dimention 2'

    d3.select("#mds-scatterplot-graph-attr").selectAll("*").remove()

    var svg = d3.select("#mds-scatterplot-graph-attr")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Add one dot in the legend for each name.

    // legend = svg.append("g")
    //     .attr("class", "legend")
    //     .attr("transform", `translate(${width-120}, 0)`);

    // legend.append('rect')
    //     .attr("x", 0)
    //     .attr("y", 0)
    //     .attr("height", 100)
    //     .attr("width", 120)
    //     .style("fill", "none")
    //     .style("stroke", "black");

    // legend.selectAll("mydots")
    //     .data(keys)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", 18)
    //     .attr("cy", function(d, i) { return 30 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
    //     .attr("r", 7)
    //     .style("fill", function(d, i) { return color_pick[i] })

    // legend.selectAll("mylabels")
    //     .data(keys)
    //     .enter()
    //     .append("text")
    //     .attr("x", 28)
    //     .attr("y", function(d, i) { return 32 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
    //     .style("fill", function(d) { return color_pick[d] })
    //     .text(function(d) { return d })
    //     .attr("text-anchor", "left")
    //     .style("alignment-baseline", "middle")
    //     .style("font-size", "2em")

    svg.append('text')
        .attr('fill', 'black')
        .attr('y', -10)
        .attr('x', width / 3)
        .text(graph_title)
        .style("font-size", "4em")

    var xScale = d3.scaleLinear()
        .domain([d3.min(data, xValue) * 1.05, d3.max(data, xValue) * 1.05])
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
        .domain([d3.min(data, yValue) - 0.1, d3.max(data, yValue) + 0.1])
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

    svg.append("g").selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', circleRadius)
        .style("fill", d => color_pick[colorValue(d)]);
}