function scatter_plot(x_attribute, y_attribute) {
    const svg = d3.select('#scatterplotrender');

    const height = +svg.attr('height');
    const width = +svg.attr('width');

    const render = (data) => {
        const xValue = d => d.x_attr;
        const xAxisLabel = x_attribute.charAt(0).toUpperCase() + x_attribute.slice(1);

        const yValue = d => d.y_attr;
        const yAxisLabel = y_attribute.charAt(0).toUpperCase() + y_attribute.slice(1);

        const title = `${xAxisLabel} VS ${yAxisLabel}`

        const circleRadius = 7

        const margin = { top: 60, bottom: 80, right: 40, left: 180 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, xValue))
            .range([0, innerWidth])
            .nice();

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, yValue))
            .range([0, innerHeight])
            .nice();

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

        const xAxisTickFormat = number =>
            d3.format('.3s')(number)
            .replace('G', 'B');

        const xAxis = d3.axisBottom(xScale)
            .tickFormat(xAxisTickFormat)
            .tickSize(-innerHeight)
            .tickPadding(20);


        const yAxis = d3.axisLeft(yScale)
            .tickSize(-innerWidth)
            .tickPadding(10);

        const xAxisG = g.append('g')
            .call(xAxis)
            .attr('transform', `translate(0, ${innerHeight})`);

        xAxisG.select('.domain').remove();

        xAxisG.append('text')
            .attr('fill', 'black')
            .attr('y', 70)
            .attr('x', innerWidth / 2)
            .text(xAxisLabel);

        const yAxisG = g.append('g')
            .call(yAxis);

        yAxisG.selectAll('.domain').remove();

        yAxisG.append('text')
            .attr('fill', 'black')
            .attr('y', -90)
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
            .text(title);
    }
    d3.csv('https://vizhub.com/curran/datasets/auto-mpg.csv', (data) => {
        data.forEach(d => {
            d.x_attr = +d[x_attribute]
            d.y_attr = +d[y_attribute]
        });
        render(data)
    });
}

function callscatter() {
    var ul = document.getElementById("scatterplotgraph");
    var li = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    li.setAttribute("id", "scatterplotrender")
    li.setAttribute('width', 900)
    li.setAttribute('height', 500)
    li.textContent = "Hello, world!";
    ul.appendChild(li)
    scatter_plot('weight', 'weight')


    $('input:radio').on('click', function(e) {
        let x_attr_radio = document.getElementsByName('xAxis')
        let y_attr_radio = document.getElementsByName('yAxis')
        let x_attr = null
        let y_attr = null
        for (let i = 0; i < x_attr_radio.length; i++) {
            if (x_attr_radio[i].checked) {
                x_attr = x_attr_radio[i].value;
                break;
            }
        }
        for (let i = 0; i < y_attr_radio.length; i++) {
            if (y_attr_radio[i].checked) {
                y_attr = y_attr_radio[i].value;
                break;
            }
        }
        var svg = d3.select("#scatterplotrender");
        svg.selectAll("*").remove();
        var temp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        li.setAttribute("id", "scatterplotrender")
        temp.setAttribute('width', 900)
        temp.setAttribute('height', 500)
        temp.setAttribute('color', 'red')
        ul.appendChild(li)

        console.log(x_attr)
        console.log(y_attr)
        scatter_plot(x_attr, y_attr)

    });
}