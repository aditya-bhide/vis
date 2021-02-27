function histogram(attribute) {
    const margin = { top: 20, bottom: 60, right: 20, left: 100 };
    const innerWidth = svg_width - margin.left - margin.right;
    const innerHeight = svg_height - margin.top - margin.bottom;

    const svg = d3.select('#histogramgraph')
        .append("svg")
        .attr("id", "histogram-svg")
        .attr("width", svg_width)
        .attr("height", svg_height)
        .append("g")
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const render = data => {
        const xValue = d => d.attribute;
        const xAxisLabel = attribute

        const yAxisLabel = 'Count'

        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, xValue))
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .range([innerHeight, 0])
            .nice();

        const xAxis = svg.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .style('font-size', '0.35em');

        const yAxisTickFormat = number =>
            d3.format('.3s')(number)
            .replace('G', 'B');

        const yAxis = svg.append('g');

        function update(nBin = 5) {

            var [min, max] = d3.extent(data, xValue);
            var thresholds = d3.range(min, max, (max - min) / nBin);

            var histogram = d3.histogram()
                .value(xValue)
                .domain(xScale.domain())
                .thresholds(thresholds)

            console.log(thresholds)

            var bins = histogram(data);

            yScale.domain([0, d3.max(bins, d => d.length)]);
            // yAxis.append('text')
            //     .attr('fill', 'black')
            //     .attr('y', -70)
            //     .attr('x', -innerHeight / 2)
            //     .text(yAxisLabel)
            //     .style('text-anchor', 'middle')
            //     .attr('transform', 'rotate(-90)');

            yAxis.transition()
                .duration(1000)
                .call(d3.axisLeft(yScale))
                .style('font-size', '0.35em');


            var u = svg.selectAll('rect')
                .data(bins)

            u
                .enter()
                .append('rect')
                .merge(u)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseout", mouseout)
                .transition()
                .duration(1000)
                .attr('x', 1)
                .attr('transform', function(d) {
                    return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")";
                })
                .attr('width', function(d) {
                    return (xScale(d.x1) - xScale(d.x0) - 1)
                })
                .attr("height", function(d) {
                    return innerHeight - yScale(d.length);
                });


            u.exit()
            u.remove()
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

        update(value)
        d3.select("#nBin").on("input", function() {
            update(+this.value);
            console.log(this.value)
        });

        xAxis.append('text')
            .attr('fill', 'black')
            .attr('y', 50)
            .attr('x', innerWidth / 2)
            .text(xAxisLabel);
    }

    d3.csv(csv_file, (data) => {

        data.forEach(function(d) {
            d.attribute = +d[attribute];
        });
        render(data)
    });
}

function callhistogram(numerical_value) {
    histogram(numerical_value);
}