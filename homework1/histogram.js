function histogram(attribute) {
    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 60, left: 100 };
    const innerWidth = svg_width - margin.left - margin.right
    const innerHeight = svg_height - margin.top - margin.bottom

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
        const xValue = d => d[attribute]
        var current_bin = 20
        console.log(d3.min(data, xValue))
        var xScale = d3.scaleLinear()
            .domain([d3.min(data, xValue), d3.max(data, xValue)]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
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

        // Y axis: initialization
        var yScale = d3.scaleLinear()
            .range([innerHeight, 0]);

        var yAxis = svg.append("g")

        // A function that builds the graph for a specific value of bin
        function update(nBin = current_bin) {
            var [min, max] = d3.extent(data, xValue);
            var thresholds = d3.range(min, max, (max - min) / nBin);

            // set the parameters for the histogram
            var histogram = d3.histogram()
                .value(xValue) // I need to give the vector of value
                .domain(xScale.domain()) // then the domain of the graphic
                .thresholds(thresholds)
                // .thresholds(xScale.ticks(nBin)); // then the numbers of bins

            // And apply this function to data to get the bins
            var bins = histogram(data);

            // Y axis: update now that we know the domain
            yScale.domain([0, d3.max(bins, function(d) {
                return d.length;
            })]); // d3.hist has to be called before the Y axis obviously

            yAxis.transition()
                .duration(0)
                .call(d3.axisLeft(yScale))
                .style('font-size', '0.35em');

            // Join the rect with the bins data
            var u = svg.selectAll("rect")
                .data(bins)

            // Manage the existing bars and eventually the new ones:
            u
                .enter()
                .append("rect") // Add a new rect for each new elements
                .merge(u) // get the already existing elements as well
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseout", mouseout)
                .transition() // and apply changes to all of them
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

            // If less bar in the new histogram, I delete the ones not in use anymore
            u
                .exit()
                .remove()

        }

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("display", "none");

        function mouseover(d) {
            d3.select(this).style('fill', 'red');
            div.style("display", "inline");
            div.text(`Count : ${d.length}`)
        }

        function mousemove() {
            d3.select(this).style('fill', 'red');
            div.style("left", (d3.event.pageX - 34) + "px")
                .style("top", (d3.event.pageY - 12) + "px");
        }

        function mouseout() {
            d3.select(this).style('fill', 'steelblue');
            div.style("display", "none");
        }

        // Initialize with 20 bins
        update()


        // Listen to the button -> update if user change it

        d3.select("#histogram-svg")
            .call(d3.drag().on("start", dragstarted).on("drag", dragging).on("end", dragged));

        var drag_start = null

        function dragstarted() {
            drag_start = d3.event.x
        }

        function dragging() {
            movement = drag_start - d3.event.x
            change_bin = Math.floor(movement / 100)
            if ((current_bin + change_bin) > 1 && (current_bin + change_bin) < 100) {
                current_bin += change_bin
                update(current_bin)
            }
        }

        function dragged() {
            drag_start = null
        }

        // yAxis.append('text')
        //     .attr('fill', 'black')
        //     .attr('y', -50)
        //     .attr('x', -innerHeight / 2)
        //     .text('Count')
        //     .style('text-anchor', 'middle')
        //     .attr('transform', 'rotate(-90)');

        xAxis.append('text')
            .attr('fill', 'black')
            .attr('y', 50)
            .attr('x', innerWidth / 2)
            .text(attribute);
    }

    // get the data
    d3.csv(csv_file, function(data) {
        data.forEach(function(d) {
            d.attribute = +d[attribute];
        });
        console.log(data)
        render(data)

    });
}

function callhistogram(attribute) {
    histogram(attribute);
}