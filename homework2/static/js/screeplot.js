function scree_plot(data) {
    // set the dimensions and margins of the graph
    let svg_width = 1200
    let svg_height = 700
    let circleRadius = 5
    var margin = { top: 40, right: 30, bottom: 70, left: 100 },
        width = svg_width - margin.left - margin.right,
        height = svg_height - margin.top - margin.bottom;
    data.forEach(d => {
        d.key = +d.key
        d.value.cumulative_variance = +d.value.cumulative_variance
        d.value.variance_percentage = +d.value.variance_percentage
    });
    xValue = d => d.key
    yValue = d => d.value.cumulative_variance
    barValue = d => d.value.variance_percentage

    xAxisLabel = 'Component Number'
    yAxisLabel = 'Cumulative percentage'
    var svg = d3.select("#scree-plot-graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    console.log(d3.extent(data, xValue))
        // append the svg object to the body of the page
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(data, xValue) * 1.05])
        .range([0, width])
        .nice();

    tickArr = xScale.ticks()
    tickDistance = xScale(tickArr[tickArr.length - 1]) - xScale(tickArr[tickArr.length - 2]);
    console.log(tickDistance)

    // var ticksCount = xScale.ticks()[0]
    // xScale.ticks(ticksCount + 1)

    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    xAxis.append('text')
        .attr('fill', 'black')
        .attr('y', 50)
        .attr('x', width / 2)
        .text(xAxisLabel)
        .attr("font-size", "2.5em");

    // Add Y axis
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, yValue)])
        .range([height, 0])
        .nice();

    var yAxis = svg.append("g")
        .call(d3.axisLeft(yScale));

    var yAxis_right = svg.append("g")
        .attr("transform", "translate(" + width + " ,0)")
        .call(d3.axisRight(yScale));

    yAxis.append('text')
        .attr('fill', 'black')
        .attr('y', -40)
        .attr('x', -height / 2)
        .text(yAxisLabel)
        .style('text-anchor', 'middle')
        .attr("font-size", "3em")
        .attr('transform', 'rotate(-90)');

    // Add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => xScale(xValue(d)))
            .y(d => yScale(yValue(d)))
        );


    var combine = svg.selectAll('.rect-bar')
        .data(data)
        .enter()
        .append("g")
        .attr("class", "rect-bar-cover");

    combine.append('rect')
        .attr('class', 'rect-bar')
        .on("click", pca_click)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .transition().duration(1000)
        .attr('x', function(d) { return xScale(xValue(d)) - (tickDistance / 2) })
        .attr('y', d => yScale(barValue(d)))
        .attr('width', tickDistance)
        .attr('height', d => height - yScale(barValue(d)))
        .style("fill", "steelblue");


    combine.append('circle')
        .attr("class", "circle-point")
        .on("click", pca_click)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', circleRadius)
        .style("fill", "steelblue");

    let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    function mouseover(d) {
        d3.select(this.parentNode).selectAll('.rect-bar').style("fill", "red")
        d3.select(this.parentNode).selectAll('.circle-point').style("fill", "red")

        div.transition()
            .duration(100)
            .style("opacity", 1);

        div.html(`Percentage data: %${yValue(d).toFixed(2)}`)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 15) + "px");

    }

    function mouseout() {
        d3.select(this.parentNode).selectAll('.rect-bar').style("fill", "steelblue")
        d3.select(this.parentNode).selectAll('.circle-point').style("fill", "steelblue")

        div.transition()
            .duration('200')
            .style("opacity", 0);
    }

    function pca_click(d) {
        $("#intrinsic-dimentionality-index").html(xValue(d))

    }
}

function show_table(feature_data) {
    node = document.getElementById("imp-features-table-div")
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }

    feature_table_values = feature_data
    console.log(feature_table_values)
    var table = document.createElement("TABLE");
    table.setAttribute("id", "imp-feature-table");
    document.getElementById("imp-features-table-div").appendChild(table)
    var header = table.createTHead();
    var row = header.insertRow(0);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = "<b>Features</b>";
    var cell2 = row.insertCell(1);
    cell2.innerHTML = "<b>Sum of squared loadings</b>"
    for (var key in feature_table_values) {
        var newRow = table.insertRow(table.length);
        var cell1 = newRow.insertCell();
        cell1.innerHTML = key;
        var cell2 = newRow.insertCell();
        cell2.innerHTML = feature_table_values[key];
    }
}