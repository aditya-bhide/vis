const svg = d3.select('svg');

const height = +svg.attr('height');
const width = +svg.attr('width');

const g = svg.append('g')
    .attr('transform', `translate(${width/2},${height/2})`);

const circle = g.append('circle')
    .attr('r', height / 2)
    .attr('fill', 'yellow')
    .attr('stroke', 'black');

const lefteye = g.append('circle')
    .attr('r', 30)
    .attr('cx', -120)
    .attr('cy', -90)
    .attr('fill', 'black');

const righteye = g.append('circle')
    .attr('r', 30)
    .attr('cx', 120)
    .attr('cy', -100)
    .attr('fill', 'black');

const mouth = g.append('path')
    .attr('d', d3.arc()({
        innerRadius: 200,
        outerRadius: 220,
        startAngle: Math.PI / 2,
        endAngle: Math.PI * 3 / 2
    }));