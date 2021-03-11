function scatterplot_matrix(data) {
    data = d3.entries(data)
    n = 4;
    var width = 920,
        size = (width / n) - 12,
        padding = 40;

    var xScale = d3.scaleLinear()
        .range([padding / 2, size - padding / 2]);

    var yScale = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);

    var xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5);

    var yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5);

    graph_title = "Scatterplot matrix"
    traits = []
    for (key in data[0].value) {
        if (key != "label") {
            traits.push(key)
        }
    }

    var color = "blue"
    var domainByTrait = {};

    traits.forEach(function(trait) {
        domainByTrait[trait] = d3.extent(data, function(d) {
            return d.value[trait];
        });
    });

    color_pick = ["blue", "green", "red", "black", "grey", "gold", "orange", "pink", "brown", "slateblue", "grey1", "darkgreen"]

    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    d3.select("#scatterplot-matrix").selectAll("*").remove()

    var svg = d3.select("#scatterplot-matrix").append("svg")
        .attr("width", width + 10)
        .attr("height", width + 10)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    svg.append('text')
        .attr('fill', 'black')
        .attr('y', 10)
        .attr('x', width / 2.8)
        .text(graph_title)
        .style("font-size", "3em")

    svg.selectAll(".xAxis")
        .data(traits)
        .enter().append("g")
        .attr("class", "axis")
        .attr("transform", function(d, i) {
            return "translate(" + (n - i - 1) * size + ",0)";
        })
        .each(function(d) {
            xScale.domain(domainByTrait[d]).nice();
            d3.select(this).call(xAxis);
        });

    svg.selectAll(".yAxis")
        .data(traits)
        .enter().append("g")
        .attr("class", "axis")
        .attr("transform", function(d, i) {
            return "translate(0," + i * size + ")";
        })
        .each(function(d) {
            yScale.domain(domainByTrait[d]).nice();
            d3.select(this).call(yAxis);
        });

    var cell = svg.selectAll(".cell")
        .data(cross(traits, traits))
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) {
            return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")";
        })
        .each(plot);

    cell.filter(function(d) {
            return d.i === d.j;
        }).append("text")
        .attr("x", size / 2)
        .attr("y", size / 2)
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d.x;
        });

    function plot(p) {
        var cell = d3.select(this);

        xScale.domain(domainByTrait[p.x]);
        yScale.domain(domainByTrait[p.y]);

        cell.append("rect")
            .attr("class", "frame")
            .classed("diagonal", function(d) {
                return d.i === d.j;
            })
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        cell.filter(function(d) {
                return d.i !== d.j;
            })
            .selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", function(d) {
                return xScale(d.value[p.x]);
            })
            .attr("cy", function(d) {
                return yScale(d.value[p.y]);
            })
            .attr("r", 2.5)
            .style("fill", function(d) {
                return color_pick[d.value.label];
            });
    }

    function cross(a, b) {
        var c = [],
            n = a.length,
            m = b.length,
            i, j;
        for (i = -1; ++i < n;)
            for (j = -1; ++j < m;) c.push({
                x: a[i],
                i: i,
                y: b[j],
                j: j
            });
        return c;
    }

}