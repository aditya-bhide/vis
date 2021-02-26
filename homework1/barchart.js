function bar_chart(attribute) {
    const svg = d3.select('#barchart-svg');
    const height = +svg.attr('height');
    const width = +svg.attr('width');
    const render = data => {
        const xValue = d => d[attribute];
        const xAxisLabel = attribute

        const yValue = d => d.count;
        const yAxisLabel = 'Count'

        const margin = { top: 20, bottom: 60, right: 20, left: 100 };
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
            .text(xAxisLabel);

        yAxis.append('text')
            .attr('fill', 'black')
            .attr('y', -70)
            .attr('x', -innerHeight / 2)
            .text(yAxisLabel)
            .style('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)');



        g.selectAll('rect').data(data)
            .enter().append('rect')
            .attr('x', d => xScale(xValue(d)))
            .attr('y', d => yScale(yValue(d)))
            .attr('width', xScale.bandwidth())
            .attr('height', d => innerHeight - yScale(yValue(d)))
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout);



        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("display", "none");

        function mouseover(d) {
            d3.select(this).style('fill', 'red');
            div.style("display", "inline");
            div.text(`Count : ${yValue(d) + 1}`)
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
    }

    d3.csv(csv_file, (data) => {
        // define count object that holds count for each city
        let countObj = {};

        // count how much each city occurs in list and store in countObj
        data.forEach(function(d) {
            let attr = d[attribute];
            if (countObj[attr] === undefined) {
                countObj[attr] = 0;
            } else {
                countObj[attr] = countObj[attr] + 1;
            }
        });

        // now store the count in each data member
        data.forEach(function(d) {
            let attr = d[attribute];
            d.count = countObj[attr];
        });
        render(data)
    });
}

function callbarchart() {
    let ul = document.getElementById("barchartgraph");
    let li = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    li.setAttribute("id", "barchart-svg")
    li.setAttribute('width', svg_width)
    li.setAttribute('height', svg_height)
    ul.appendChild(li)
    bar_chart('origin');

    let attribute_value = 'origin'

    $("#histogram-set-attribute").change(function() {
        attribute_value = document.getElementById("barchart-set-attribute").value;
        let svg = d3.select("#barchart-svg");
        svg.selectAll("*").remove();
        let temp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        li.setAttribute("id", "barchart-svg")
        temp.setAttribute('width', svg_width)
        temp.setAttribute('height', svg_height)
        ul.appendChild(li)

        bar_chart(attribute_value)
    });
}