function bar_chart(attribute) {
    const svg = d3.select('#barchart-svg');
    const height = +svg.attr('height');
    const width = +svg.attr('width');

    const render = data => {
        const xValue = d => d.key;
        let xAxisLabel = attribute.charAt(0).toUpperCase() + attribute.slice(1);
        xAxisLabel = xAxisLabel.replace("_", " ")

        const yValue = d => d.value;
        const yAxisLabel = 'Frequency'

        const margin = { top: 60, bottom: 80, right: 60, left: 110 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xScale = d3.scaleBand()
            .domain(data.map(xValue))
            .range([0, innerWidth])
            .padding(0.4);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, yValue)])
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

        const yAxis = g.append('g')
            .call(d3.axisLeft(yScale).tickFormat(yAxisTickFormat))
            .style('font-size', '0.35em');



        xAxis.append('text')
            .attr('fill', 'black')
            .attr('y', 50)
            .attr('x', innerWidth / 2)
            .text(xAxisLabel)
            .attr("font-size", "5em");

        yAxis.append('text')
            .attr('fill', 'black')
            .attr('y', -70)
            .attr('x', -innerHeight / 2)
            .text(yAxisLabel)
            .style('text-anchor', 'middle')
            .attr("font-size", "5em")
            .attr('transform', 'rotate(-90)');

        var bar_rect = g.selectAll('.rect-bar')
            .data(data)
            .enter()
            .append("g")
            .attr("class", "rect-bar-cover");

        bar_rect.append('rect')
            .attr('class', 'rect-bar')
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout)
            .attr("y", innerHeight)
            .transition().duration(1000)
            .attr('x', d => xScale(xValue(d)))
            .attr('y', d => yScale(yValue(d)))
            .attr('width', xScale.bandwidth())
            .attr('height', d => innerHeight - yScale(yValue(d)));

        bar_rect.append('text')
            .attr("class", "rect-hover-text")
            .attr('x', function(d) { return xScale(xValue(d)) + xScale.bandwidth() / 2 })
            .attr('y', function(d) { return yScale(yValue(d)) - 10 })
            .attr("text-anchor", "middle")
            .text(d => yValue(d))
            .style("fill", "red")
            .style("font-size", "1.5em")
            .style("display", "none")

        function mouseover(d) {
            d3.select(this).style('fill', 'red')
            d3.select(this.parentNode).selectAll('.rect-hover-text').style('display', "block")

        }

        function mousemove(d) {
            d3.select(this).style('fill', 'red');
            d3.select(this.parentNode).selectAll('.rect-hover-text').style('display', "block")

        }

        function mouseout() {
            d3.select(this).style('fill', 'steelblue');
            d3.select(this.parentNode).selectAll('.rect-hover-text').style('display', "none")
        }
    }

    d3.csv(csv_file, (data) => {
        let countObj = {};

        data.forEach(function(d) {
            let attr = d[attribute];
            if (countObj[attr] === undefined) {
                countObj[attr] = 0;
            } else {
                countObj[attr] = countObj[attr] + 1;
            }
        });
        maping_set =

            render(d3.entries(countObj))
    });
}

function callbarchart(categorical_value) {
    let ul = document.getElementById("barchartgraph");
    let li = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    li.setAttribute("id", "barchart-svg")
    li.setAttribute('width', svg_width)
    li.setAttribute('height', svg_height)
    ul.appendChild(li)
    bar_chart(categorical_value);
}