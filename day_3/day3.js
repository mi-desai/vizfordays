
let n = 90;

//random returns a function that returns a random number with a mean of 30 and a standard deviation of 20
let random = d3.randomNormal(40, 2);

//data with 60 array entries is created and mapped with to the random function
let data = d3.range(n).map(random);

//dimensions for the chart
let dimensions = {
    width: window.innerWidth * 0.5,
    height: 400,
    margins: {
        top: 30,
        right: 30, 
        bottom: 30, 
        left: 30
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
        .domain([0, n-1])
        .range([dimensions.margins.left, dimensions.boundedWidth]);
    
    const yScale = d3.scaleLinear()
        .domain([d3.min(data), d3.max(data)])
        .range([dimensions.boundedHeight, dimensions.margins.bottom]);

//since the scale of x is just the range of data used to generate random points
    const series = d3.line()
        .x(function(d, i) {return xScale(i); })
        .y(function(d, i) {return yScale(d); })
        .curve(d3.curveCardinal.tension(0.15));
    
    bounds.append('defs').append('clipPath')
        .attr('id', 'clip')
        .append('rect')
            .attr('width', dimensions.boundedWidth)
            .attr('height', dimensions.boundedHeight);

//after storing the definition of clipPath as a rectangle in defs...
//you then "call" it as an attribute for this "g" tag
//then all data-driven elements that you want to mask are appended to that g tag with the clipPath.

    const pathContainer = bounds.append('g')
        .attr('clip-path', 'url(#clip)')
        .append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', series)

tick();

function tick() {
    data.push(random());

    //this is the confusing part... the update animation does a very jarring bounce
    //why did Bostock include a null for transform at the beginning, and then change it in the transition?
    //may have to play around with order or bring in somebody smarter than me
    pathContainer
        .attr('d', series)
        .attr('transform', null)
        .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attr('transform', 'translate(' + xScale(-1) + ',0)')
            .on('end', tick);

    data.shift();
}