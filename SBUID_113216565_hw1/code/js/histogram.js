function histogram(attribute) {
    // set the dimensions and margins of the graph
    const margin = { top: 60, right: 90, bottom: 90, left: 120 };
    const innerWidth = svg_width - margin.left - margin.right
    const innerHeight = svg_height - margin.top - margin.bottom
    let max_bins = 35

    let xAxisLabel = attribute.charAt(0).toUpperCase() + attribute.slice(1);
    xAxisLabel = xAxisLabel.replace("_", " ")

    // append the svg object to the body of the page
    const svg = d3.select("#histogramgraph")
        .append("svg")
        .attr("id", "histogram-svg")
        .attr("width", innerWidth + margin.left + margin.right)
        .attr("height", innerHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    const render = data => {
        const xValue = d => d[attribute] * 1.0
        var current_bin = 10
        const domain_size = d3.max(data, xValue) - d3.min(data, xValue)
        if (domain_size < max_bins) {
            max_bins = domain_size
        }
        var xScale = d3.scaleLinear()
            .domain(d3.extent(data, xValue))
            .range([0, innerWidth]);

        const xAxisTickFormat = number =>
            d3.format('.3s')(number)
            .replace('K', 'M');

        svg.append('text')
            .style('font-size', '1.7em')
            .attr('fill', 'black')
            .attr('y', -70)
            .attr('x', (-innerHeight / 2))
            .text('Frequency')
            .style('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)');

        var xAxis = svg.append("g").attr("class", "histo-axis");

        svg.append('text')
            .style('font-size', '1.7em')
            .attr('fill', 'black')
            .attr('y', innerHeight + 65)
            .attr('x', (innerWidth / 2) - 30)
            .text(xAxisLabel)

        var yScale = d3.scaleLinear()
            .range([innerHeight, 0])
            .nice();

        var yAxis = svg.append("g")

        function update(nBin = current_bin) {
            var [min, max] = d3.extent(data, xValue);
            var thresholds = d3.range(min, max, (max - min) / nBin);
            thresholds.push(d3.max(data, xValue))
                // let thresholds = xScale.ticks(nBin)
            var histogram = d3.histogram()
                .value(xValue)
                .domain(xScale.domain())
                .thresholds(thresholds)

            var bins = histogram(data);

            var axis_type = d3.axisBottom(xScale)
                .tickValues(thresholds)
                .tickFormat(xAxisTickFormat);

            temp = xAxis.attr("transform", "translate(0," + innerHeight + ")")
                .call(axis_type)
                .style('font-size', '0.35em')
            if (nBin <= 10) {
                temp.selectAll("text")
                    .attr("y", "15px")
            } else if (nBin >= 10) {
                temp.selectAll("text")
                    .attr("y", "15px")
                    .attr("transform", "rotate(-20)")
            } else if (nBin >= 15) {
                temp.selectAll("text")
                    .attr("y", "15px")
                    .attr("transform", "rotate(-40)")
            } else if (nBin >= 20) {
                temp.selectAll("text")
                    .attr("y", "15px")
                    .attr("transform", "rotate(-60)")
            } else if (nBin >= 25) {
                temp.selectAll("text")
                    .attr("y", "15px")
                    .attr("transform", "rotate(-80)")
            }

            yScale.domain([0, d3.max(bins, function(d) {
                return d.length;
            })]);

            yAxis.transition()
                .duration(0)
                .call(d3.axisLeft(yScale))
                .style('font-size', '0.35em');

            var bar_hist_bar = svg.selectAll(".rect-bar")
                .data(bins)

            bar_hist_bar.enter()
                .append("rect")
                .attr("class", "rect-bar")
                .merge(bar_hist_bar)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseout", mouseout)
                .transition()
                .duration(50)
                .attr("x", 1)
                .attr("transform", function(d) {
                    return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")";
                })
                .attr("width", function(d) {
                    return xScale(d.x1) - xScale(d.x0) - 1;
                })
                .attr("height", function(d) {
                    return innerHeight - yScale(d.length);
                })

            bar_hist_bar.exit()
                .remove()

        }

        function mouseover(d) {
            d3.select(this).style('fill', 'red');
            svg.append("text")
                .attr("class", "histogram-bar-text")
                .attr("x", function() {
                    return xScale(d.x0) + ((xScale(d.x1) - xScale(d.x0) - 1) / 2);
                })
                .attr("y", function() {
                    return yScale(d.length) - 10;
                })
                .text(d.length)
                .style('text-anchor', 'middle')
                .style("font-size", "1.5em")
                .style("fill", "red");

        }

        function mousemove(d) {
            d3.select(this).style('fill', 'red');

        }

        function mouseout() {
            d3.select(this).style('fill', 'steelblue');
            d3.selectAll(".histogram-bar-text").remove()
        }

        update()

        d3.select("#histogram-svg")
            .call(d3.drag().on("start", dragstarted).on("drag", dragging).on("end", dragged));

        var drag_start = null
        var current = null

        function dragstarted() {
            drag_start = d3.event.x
        }

        function dragging() {
            movement = drag_start - d3.event.x
            change_bin = Math.floor(movement / 20)
            if ((current_bin + change_bin) >= 1 && (current_bin + change_bin) <= max_bins) {
                current = current_bin + change_bin
                update(current_bin + change_bin)
            } else if ((current_bin + change_bin) < 1) {
                current_bin = 1
                update(current_bin)
            } else if ((current_bin + change_bin) > max_bins) {
                current_bin = max_bins
                update(current_bin)
            }
        }

        function dragged() {
            if ((current_bin + change_bin) >= 1 && (current_bin + change_bin) <= 200) {
                current_bin = current
            }
            drag_start = null
        }
    }

    // get the data
    d3.csv(csv_file, function(data) {
        data.forEach(function(d) {
            d.attribute = +d[attribute];
        });
        render(data)

    });
}

function callhistogram(attribute) {
    histogram(attribute);
}