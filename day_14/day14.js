function drawChart() {
    let n = 90;

    //random returns a function that returns a random number with a mean of 30 and a standard deviation of 20
    let randomNormal = d3.randomNormal(15, 3);
    let randomExponential = d3.randomExponential(0.25);
    let randomLog = d3.randomLogNormal(0.8, 0.8);

    //data with 90 entries is created using several random data generation functions.
    let normalData = d3.range(n).map(randomNormal);
    let exponentialData = d3.range(n).map(randomExponential);
    let logData = d3.range(n).map(randomLog);

    //dimensions for the chart
    let dimensions = {
        width: window.innerWidth * 0.98,
        height: window.innerHeight * 0.4,
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
            
    const center = bounds.append('g')
        .style('transform', `translate(${dimensions.boundedWidth / 2}px, ${dimensions.boundedHeight / 1.05}px)`)

    //start it at the 270 degree position relative to 12 o'clock
    const start = (3*Math.PI / 2);

    //end at start + 180 degrees
    const end = start + Math.PI;

    const innerRadius = 90;
    const outerRadius = 200;
    //scales

    const xScale = d3.scaleLinear()
        .domain([0, n - 1])
        .range([start, end]);

    let yDomain = findDomain(normalData, logData, exponentialData);

    const yScale = d3.scaleLinear()
        .domain(yDomain)
        .range([innerRadius, outerRadius]);

    const normal = d3.lineRadial()
        .angle(function(d, i) { return xScale(i); })
        .radius(function(d, i) { return yScale(d); })
        .curve(d3.curveCardinal.tension(0.15))

    const exp = d3.lineRadial()
        .angle(function(d, i) { return xScale(i); })
        .radius(function(d, i) { return yScale(d); })
        .curve(d3.curveMonotoneY)

    const log = d3.lineRadial()
        .angle(function(d, i) { return xScale(i); })
        .radius(function(d, i) { return yScale(d); })
        .curve(d3.curveStepAfter);

    center.append('defs').append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', dimensions.boundedWidth - dimensions.margins.right - dimensions.margins.left)
        .attr('height', dimensions.boundedHeight)

    center.append('path')
        .datum(normalData)
        .attr('id', 'normal')
        .attr('class', 'path')
        .attr('d', normal);
    
    center.append('path')
        .datum(logData)
        .attr('id', 'log')
        .attr('class', 'path')
        .attr('d', log);

    center.append('path')
        .datum(exponentialData)
        .attr('id', 'exp')
        .attr('class', 'path')
        .attr('d', exp);
}

drawChart();

$(window).on('resize', function() {
    d3.selectAll('svg').remove();
    drawChart();
})

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