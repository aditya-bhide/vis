function scatter_plot(x_attribute, y_attribute) {
    const svg = d3.select('#scatterplot-svg');

    const height = +svg.attr('height');
    const width = +svg.attr('width');

    const render = (data) => {
        const xValue = d => d.x_attr;
        const xAxisLabel = x_attribute.charAt(0).toUpperCase() + x_attribute.slice(1);

        const yValue = d => d.y_attr;
        const yAxisLabel = y_attribute.charAt(0).toUpperCase() + y_attribute.slice(1);

        const title = `${xAxisLabel} VS ${yAxisLabel}`

        const circleRadius = 7

        const margin = { top: 60, bottom: 80, right: 40, left: 160 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        let xScale = null
        let yScale = null

        if (categorical.includes(x_attribute)) {
            xScale = d3.scalePoint()
                .domain(data.map(function(d) {
                    return d.x_attr
                }))
                .rangeRound([0, innerWidth])
                .padding(.5);
        } else {
            xScale = d3.scaleLinear()
                .domain(d3.extent(data, xValue))
                .range([0, innerWidth])
                .nice();
        }

        if (categorical.includes(y_attribute)) {
            yScale = d3.scalePoint()
                .domain(data.map(function(d) {
                    return d.y_attr
                }))
                .rangeRound([innerHeight, 0])
                .padding(.5);
        } else {
            yScale = d3.scaleLinear()
                .domain(d3.extent(data, yValue))
                .range([innerHeight, 0])
                .nice();
        }

        let xAxis = d3.axisBottom(xScale)
            .tickSize(-innerHeight)
            .tickPadding(20);

        const yAxis = d3.axisLeft(yScale)
            .tickSize(-innerWidth)
            .tickPadding(10);



        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)



        const xAxisG = g.append('g')
            .call(xAxis)
            .style('font-size', '0.3em')
            .attr('transform', `translate(0, ${innerHeight})`);

        // xAxisG.select('.domain').remove();

        xAxisG.append('text')
            .attr('fill', 'black')
            .attr('y', 70)
            .attr('x', innerWidth / 2)
            .text(xAxisLabel);



        const yAxisG = g.append('g')
            .call(yAxis)
            .style('font-size', '0.3em');

        // yAxisG.selectAll('.domain').remove();

        yAxisG.append('text')
            .attr('fill', 'black')
            .attr('y', -75)
            .attr('x', -innerHeight / 2)
            .text(yAxisLabel)
            .style('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)');


        g.selectAll('circle').data(data)
            .enter().append('circle')
            .attr('cy', d => yScale(yValue(d)))
            .attr('cx', d => xScale(xValue(d)))
            .attr('r', circleRadius);

        g.append('text')
            .attr('y', -15)
            .attr('fill', 'black ')
            .attr('transform', "translate(" + innerHeight / 2 + "," + " 0)")
            .style('font-size', '2em')
            .text(title);

    }


    d3.csv(csv_file, (data) => {
        data.forEach(d => {
            if (!categorical.includes(x_attribute)) {
                d.x_attr = +d[x_attribute]
            } else {
                d.x_attr = d[x_attribute]
            }
            if (!categorical.includes(y_attribute)) {
                d.y_attr = +d[y_attribute]
            } else {
                d.y_attr = d[y_attribute]
            }
        });
        render(data)
    });
}

function callscatterplot() {
    let ul = document.getElementById("scatterplotgraph");
    let li = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    li.setAttribute("id", "scatterplot-svg")
    li.setAttribute('width', svg_width)
    li.setAttribute('height', svg_height)
    ul.appendChild(li)
    scatter_plot('weight', 'weight')

    let x_value = "weight"
    let y_value = "weight"

    $("#scatterplot-set-attribute").change(function() {
        let selected = document.getElementById("scatterplot-set-attribute");
        let select_axis = document.getElementsByName('axis');
        for (let i = 0; i < select_axis.length; i++) {
            if (select_axis[i].checked) {
                if (select_axis[i].value == 'xAxis') {
                    x_value = selected.value
                } else {
                    y_value = selected.value
                }
            }
        }
        $("#radio-xAxis-value").html(x_value);
        $("#radio-yAxis-value").html(y_value);

        let svg = d3.select("#scatterplot-svg");
        svg.selectAll("*").remove();
        let temp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        li.setAttribute("id", "scatterplot-svg")
        temp.setAttribute('width', svg_width)
        temp.setAttribute('height', svg_height)
        ul.appendChild(li)
        scatter_plot(x_value, y_value)
    });


}