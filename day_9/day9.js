let n = 90;

//random returns a function that returns a random number with a mean of 30 and a standard deviation of 20
let randomNormal = d3.randomNormal(15, 3);
let randomExponential = d3.randomExponential(0.2);
let randomLog = d3.randomLogNormal(0.7, 0.6);

//data with 90 entries is created using several random data generation functions.
let normalData = d3.range(n).map(randomNormal);
let exponentialData = d3.range(n).map(randomExponential);
let logData = d3.range(n).map(randomLog);

//dimensions for the chart
let dimensions = {
    width: window.innerWidth * 0.8,
    height: 400,
    margins: {
        top: 0,
        right: 5,
        bottom: 30,
        left: 5
    }
};

dimensions.boundedWidth = dimensions.width - dimensions.margins.right - dimensions.margins.left;
dimensions.boundedHeight = dimensions.height - dimensions.margins.top - dimensions.margins.bottom;

//creating the SVG

const viz = d3.select('#viz').append('svg')
    .attr('width', dimensions.boundedWidth)
    .attr('height', dimensions.boundedHeight);

const bounds = viz.append('g')
    .style('transform', `translate(${dimensions.margins.left}px,
            ${dimensions.margins.top}px)`);

//scales

const xScale = d3.scaleLinear()
    .domain([0, n - 1])
    .range([dimensions.margins.left, dimensions.boundedWidth]);

let yDomain = findDomain(normalData, exponentialData, logData);

const yScale = d3.scaleLinear()
    .domain(yDomain)
    .range([dimensions.boundedHeight, dimensions.margins.bottom]);

//since the scale of x is just the range of data used to generate random points
const normal = d3.line()
    .x(function (d, i) { return xScale(i); })
    .y(function (d, i) { return yScale(d); })
    .curve(d3.curveCardinal.tension(0.15));

const log = d3.line()
    .x(function (d, i) { return xScale(i); })
    .y(function (d, i) { return yScale(d); })
    .curve(d3.curveStepAfter);

const exp = d3.line()
    .x(function (d, i) { return xScale(i); })
    .y(function (d, i) { return yScale(d); })
    .curve(d3.curveMonotoneY);

bounds.append('defs').append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', dimensions.boundedWidth - dimensions.margins.left - dimensions.margins.left)
    .attr('height', dimensions.boundedHeight)


//after storing the definition of clipPath as a rectangle in defs...
//you then "call" it as an attribute for this "g" tag
//then all data-driven elements that you want to mask are appended to that g tag with the clipPath.

const pathContainer = bounds.append('g')
    .attr('clip-path', 'url(#clip)')


pathContainer.append('path')
    .datum(normalData)
    .attr('id', 'normal')
    .attr('class', 'path')
    .attr('d', normal)

pathContainer.append('path')
    .datum(logData)
    .attr('id', 'log')
    .attr('class', 'path')
    .attr('d', log)

pathContainer.append('path')
    .datum(exponentialData)
    .attr('id', 'exp')
    .attr('class', 'path')
    .attr('d', exp)

const transition = d3.transition().duration(500).ease(d3.easeLinear);

d3.selectAll('.path').transition(transition)
        .style('transform', null)
        .on('start', tick);

function tick() {
    normalData.push(randomNormal());
    exponentialData.push(randomExponential());
    logData.push(randomLog());

    d3.select('#exp')
        .attr('d', exp)
        .attr('transform', null);
    
    d3.select('#log')
        .attr('d', log)
        .attr('transform', null);

    d3.select('#normal')
        .attr('d', normal)
        .attr('transform', null);
    
    d3.active(this)
            .attr('transform', `translate(${xScale(-1)}, 0)`)
            .transition().on('start', tick);

    normalData.shift();
    exponentialData.shift();
    logData.shift();
}

function findDomain(normal, exp, log) {
    let evaluation = [normal, exp, log];
    let result = [];

    for (let i = 0; i < evaluation.length; i++) {
        let next = evaluation[i];
        for (let o = 0; o < next.length; o++) {
            result.push(next[o]);
        }
    }

    result = d3.extent(result);
    return result;
}