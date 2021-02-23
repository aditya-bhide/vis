const svg = d3.select('svg');

const height = +svg.attr('height');
const width = +svg.attr('width');

const render = data => {
    const xValue = d => d.horsepower;
    const xAxisLabel = 'Horsepower';

    const yValue = d => d.weight;
    const yAxisLabel = 'Weight';

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
        d.mpg = +d.mpg;
        d.cylinders = +d.cylinders;
        d.displacement = +d.displacement;
        d.weight = +d.weight;
        d.horsepower = +d.horsepower;
        d.acceleration = +d.acceleration;
        d.year = +d.year;

    });
    render(data)
});