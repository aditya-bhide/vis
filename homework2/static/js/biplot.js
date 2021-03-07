function biplot(data_all) {

    let svg_width = 900
    let svg_height = 550
    let circleRadius = 5
    let pointRadius = 3
    var margin = { top: 40, right: 30, bottom: 80, left: 100 },
        width = svg_width - margin.left - margin.right,
        height = svg_height - margin.top - margin.bottom;
    data = d3.entries(data_all.feature_contri)
    scatter_data = d3.entries(data_all.plot_pca)

    xValue = d => d.value.pc1
    yValue = d => d.value.pc2
    nameValue = d => d.value.name

    xSValue = d => d.value.pc1
    ySValue = d => d.value.pc2


    xAxisLabel = 'PC1'
    yAxisLabel = 'PC2'
    d3.select("#biplot-graph").selectAll("*").remove()
    var svg = d3.select("#biplot-graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // xdomain = d3.extent(data, xValue)
    // if (xdomain[0] > 0) {
    //     xdomain[0] = -0.1
    // }
    // xdomain[1] += 0.1

    d3.extent(data, xValue)
    var xScale = d3.scaleLinear()
        .domain(d3.extent(scatter_data, xSValue))
        .range([0, width]);

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
        .domain([d3.min(scatter_data, ySValue) - 0.1, d3.max(scatter_data, ySValue) + 0.1])
        .range([height, 0]);

    var yAxis = svg.append("g")
        .call(d3.axisLeft(yScale));

    yAxis.append('text')
        .attr('fill', 'black')
        .attr('y', -40)
        .attr('x', -height / 2)
        .text(yAxisLabel)
        .style('text-anchor', 'middle')
        .attr("font-size", "3em")
        .attr('transform', 'rotate(-90)');

    var randomColor = (function() {
        var golden_ratio_conjugate = 0.618033988749895;
        var h = Math.random();

        var hslToRgb = function(h, s, l) {
            var r, g, b;

            if (s == 0) {
                r = g = b = l; // achromatic
            } else {
                function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                }

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return '#' + Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
        };

        return function() {
            h += golden_ratio_conjugate;
            h %= 1;
            return hslToRgb(h, 0.5, 0.60);
        };
    })();

    svg.append("g").selectAll('line').data(data)
        .enter().append('line')
        .attr('y1', yScale(0))
        .attr('x1', xScale(0))
        .attr('y2', d => yScale(yValue(d)))
        .attr('x2', d => xScale(xValue(d)))
        .style("stroke", randomColor);

    svg.append("g").selectAll('circle').data(scatter_data)
        .enter().append('circle')
        .attr('cy', d => yScale(ySValue(d)))
        .attr('cx', d => xScale(xSValue(d)))
        .attr('r', pointRadius)
        .style("fill", "blue");

    svg.append("g").selectAll('circle').data(data)
        .enter().append('circle')
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', circleRadius)
        .style("fill", "yellow");

    let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    function mouseover(d) {
        d3.select(this).transition()
            .duration('100')
            .attr("r", 7)
            .style('fill', 'red');

        div.transition()
            .duration(100)
            .style("opacity", 1);

        div.html(`${nameValue(d)} \n PC1: ${xValue(d).toFixed(3)} \n PC2: ${yValue(d).toFixed(3)}`)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 15) + "px");
    }

    function mouseout() {
        d3.select(this).transition()
            .duration('200')
            .attr("r", circleRadius)
            .style('fill', 'yellow');

        div.transition()
            .duration('200')
            .style("opacity", 0);
    }
}