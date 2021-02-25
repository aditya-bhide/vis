function histogram(attribute, value) {
    const svg = d3.select('#histogram-svg');
    const height = +svg.attr('height');
    const width = +svg.attr('width');

    const render = data => {
        const margin = { top: 20, bottom: 60, right: 20, left: 100 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xValue = d => d.attribute;
        const xAxisLabel = attribute

        const yAxisLabel = 'Count'

        const xScale = d3.scaleLinear()
            // .domain([0, d3.max(data, xValue)])
            .domain(d3.extent(data, xValue))
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .range([innerHeight, 0])
            .nice();

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const xAxis = g.append('g')
            .call(d3.axisBottom(xScale))
            .style('font-size', '0.35em')
            .attr('transform', `translate(0, ${innerHeight})`);

        const yAxisTickFormat = number =>
            d3.format('.3s')(number)
            .replace('G', 'B');

        const yAxis = g.append('g');

        function update(nBin) {

            let histogram = d3.histogram()
                .value(xValue)
                .domain(xScale.domain())
                .thresholds(xScale.ticks(nBin))

            let bins = histogram(data);

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


            let u = g.selectAll('rect')
                .data(bins)

            u.enter().append('rect')
                .merge(u)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseout", mouseout)
                .transition()
                .duration(1000)
                .attr('x', 1)
                .attr('transform', function(d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
                .attr('width', function(d) { return (xScale(d.x1) - xScale(d.x0) - 1); })
                .attr("height", function(d) { return innerHeight - yScale(d.length); });


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

        xAxis.append('text')
            .attr('fill', 'black')
            .attr('y', 50)
            .attr('x', innerWidth / 2)
            .text(xAxisLabel);
    }

    d3.csv('https://vizhub.com/curran/datasets/auto-mpg.csv', (data) => {

        data.forEach(function(d) {
            d.attribute = +d[attribute];
        });
        render(data)
    });
}

function callhistogram() {
    let ul = document.getElementById("histogramgraph");
    let li = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    li.setAttribute("id", "histogram-svg")
    li.setAttribute('width', svg_width)
    li.setAttribute('height', svg_height)
    ul.appendChild(li)
    histogram('weight', 3);

    let attribute_value = 'weight'
    let histogram_bin = 3

    $("#histogram-set-attribute").change(function() {
        attribute_value = document.getElementById("histogram-set-attribute").value;
        let svg = d3.select("#histogram-svg");
        svg.selectAll("*").remove();
        let temp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        li.setAttribute("id", "histogram-svg")
        temp.setAttribute('width', svg_width)
        temp.setAttribute('height', svg_height)
        ul.appendChild(li)

        histogram(attribute_value, histogram_bin)
    });

    $("#histogram-slider").change(function() {
        histogram_bin = document.getElementById("histogram-slider").value;

        let svg = d3.select("#histogram-svg");
        svg.selectAll("*").remove();
        let temp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        li.setAttribute("id", "histogram-svg")
        temp.setAttribute('width', svg_width)
        temp.setAttribute('height', svg_height)
        ul.appendChild(li)

        histogram(attribute_value, histogram_bin)
    });
}