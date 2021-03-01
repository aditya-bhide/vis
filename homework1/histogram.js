function histogram(attribute) {
    // set the dimensions and margins of the graph
    const margin = { top: 60, right: 20, bottom: 60, left: 100 };
    const innerWidth = svg_width - margin.left - margin.right
    const innerHeight = svg_height - margin.top - margin.bottom
    let max_bins = 30

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
        // X axis: scale and draw:
        const xValue = d => d[attribute] * 1.0
        var current_bin = 10
        const domain_size = d3.max(data, xValue) - d3.min(data, xValue)
        if (domain_size < max_bins) {
            max_bins = domain_size
        }
        var xScale = d3.scaleLinear()
            .domain(d3.extent(data, xValue)) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
            .range([0, innerWidth]);

        const xAxis = svg.append("g")
            .attr("transform", "translate(0," + innerHeight + ")")
            .call(d3.axisBottom(xScale))
            .style('font-size', '0.35em');

        svg.append('text')
            .style('font-size', '1.7em')
            .attr('fill', 'black')
            .attr('y', -68)
            .attr('x', -innerHeight / 2)
            .text('Count')
            .style('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)');

        var yScale = d3.scaleLinear()
            .range([innerHeight, 0]);

        var yAxis = svg.append("g")

        function update(nBin = current_bin) {
            var [min, max] = d3.extent(data, xValue);
            var thresholds = d3.range(min, max, (max - min) / nBin);

            var histogram = d3.histogram()
                .value(xValue)
                .domain(xScale.domain())
                .thresholds(thresholds)
                // .thresholds(xScale.ticks(nBin));

            var bins = histogram(data);

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
            movement = d3.event.x - drag_start
            change_bin = Math.floor(movement / max_bins)
            if ((current_bin + change_bin) >= 1 && (current_bin + change_bin) <= max_bins) {
                current = current_bin + change_bin
                update(current_bin + change_bin)
            } else if ((current_bin + change_bin) < 1) {
                current_bin = 1
                    // update(current_bin)
            } else if ((current_bin + change_bin) > max_bins) {
                current_bin = max_bins
                    // update(current_bin)
            }
        }

        function dragged() {
            if ((current_bin + change_bin) >= 1 && (current_bin + change_bin) <= 200) {
                current_bin = current
            }
            drag_start = null
        }

        xAxis.append('text')
            .attr('fill', 'black')
            .attr('y', 50)
            .attr('x', innerWidth / 2)
            .text(attribute)
            .attr("font-size", "5em");
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