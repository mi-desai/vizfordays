// day 8
// make html div tooltip - check

async function drawChart() {
    let dataset = await d3.csv('../data/drilling.csv', function(d) {
        return {
            month: d.month,
            permian: +d.permian,
            bakken: +d.bakken,
            haynesville: +d.haynesville,
            eagleford: +d.eagleford,
            marcellus: +d.marcellus,
            niobara: +d.niobara
        }
    })

    //abbreviated month and abbreviated year are encoded %b and %y respectively in the timeParse function
    const dateParser = d3.timeParse("%b-%y")
    const xAccessor = d => dateParser(d.month);

    const permianShale = d => d.permian;
    const bakkenShale = d => d.bakken;
    const haynesvilleShale = d => d.haynesville;
    const niobaraShale = d => d.niobara;
    const marcellusShale = d => d.marcellus;
    const eaglefordShale = d => d.eagleford;

    var dimensions = {
        width: window.innerWidth * 0.7,
        height: window.innerHeight * 0.5,
        margins: {
            top: 20,
            bottom: 20, 
            left: 30, 
            right: 5
        }
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margins.right - dimensions.margins.left;
    dimensions.boundedHeight = dimensions.height - dimensions.margins.top - dimensions.margins.bottom;
    
    const viz = d3.select('#viz').append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)
    
    const bounds = viz.append('g')
        .style('transform', `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`);
    
    const xScale = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([dimensions.margins.left, dimensions.boundedWidth]);
    
    let yDomain = findYScale(dataset);
    
    const yScale = d3.scaleLinear()
        .domain(yDomain)
        .range([dimensions.boundedHeight, dimensions.margins.top]);
    
    const series1Generator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(permianShale(d)))
        .curve(d3.curveCardinal.tension(0.01));
    
    const series1 = bounds.append('path')
        .data(dataset)
        .attr('d', series1Generator(dataset))
        .attr('fill', 'none')
        .attr('stroke', 'teal')
        .attr('class', 'path')
        .attr('id', 'permian')
        .attr('stroke-width', 5);

    //axis generators
    const yAxisGenerator = d3.axisLeft()
        .scale(yScale);
    
    const yAxis = bounds.append('g')
        .call(yAxisGenerator)
            .style('transform', `translateX(${dimensions.margins.left}px)`);

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale);
    
    const xAxis = bounds.append('g')
        .call(xAxisGenerator)
            .style('transform', `translateY(${dimensions.boundedHeight}px)`);
    
    //axis label
    const yAxisLabel = yAxis.append('text')
        .attr('x', dimensions.margins.right - dimensions.margins.left)
        .attr('y', (dimensions.boundedHeight / 2) + dimensions.margins.top)
        .attr('fill', 'black')
        .style('font-size', '1.4em')
        .text('Rigs')
    
    // invisible event listener rect
    bounds.append('rect')
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .attr('width', dimensions.width)
        .attr('height', dimensions.boundedHeight)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);
    
    bounds
        .append('circle')
            .attr('class', 'dots')
            .style('fill', 'teal')
            .attr('stroke', 'teal')
            .attr('r', 8)
            .style('opacity', 0)
    
    bounds.append('line')
        .attr('class', 'focuslineX')
    
    bounds.append('line')
        .attr('class', 'focuslineY')

    const tooltip = d3.select('#tooltip');
    
    function mouseover() {

        bounds.select('.dots').style('opacity', 1);
        bounds.select('.focuslineX').style('opacity', 1);
        bounds.select('.focuslineY').style('opacity', 1);
        tooltip.style('opacity', 1);
        
    }

    function mousemove() {

        // all we want is the value of X from the mouse
        let xLookup = xScale.invert(d3.mouse(this)[0]);

        // the months as an array will be retrieved as an array and mapped to the dateParser function to return real dates
        let monthSeries = retrieveArray(dataset, "month").map(d => dateParser(d));

        // bisector function used to query the closest date index from the data
        let closestX = d3.bisectLeft(monthSeries, xLookup);

        //dots and lines 
        bounds.select('.dots')
            .attr('cx', xScale(dateParser(dataset[closestX].month)))
            .attr('cy', yScale(dataset[closestX].permian));
        
        bounds.select('.focuslineX')
            .attr('x1', xScale(dateParser(dataset[closestX].month)))
            .attr('x2', dimensions.boundedWidth - dimensions.boundedWidth + dimensions.margins.left)
            .attr('y1', yScale(dataset[closestX].permian))
            .attr('y2', yScale(dataset[closestX].permian))
            .style('stroke', 'black')
            .style('stroke-width', 2)
            .style('stroke-dasharray', 3)
            .style('opacity', 1);
        
        bounds.select('.focuslineY')
            .attr('x1', xScale(dateParser(dataset[closestX].month)))
            .attr('y1', yScale(dataset[closestX].permian))
            .attr('x2', xScale(dateParser(dataset[closestX].month)))
            .attr('y2', dimensions.boundedHeight)
            .style('stroke', 'black')
            .style('stroke-width', 2)
            .style('stroke-dasharray', 3)
            .style('opacity', 1);
        
        //tooltip
        tooltip.select('#date')
            .text(dataset[closestX].month);
        
        tooltip.select('#values')
            .text(dataset[closestX].permian);

        tooltip.style('transform', `translate(${xScale(dateParser(dataset[closestX].month)) + 60}px, 
        ${yScale(dataset[closestX].permian)}px)`);

    }

    function mouseout() {
        
        bounds.select('.dots').style('opacity', 0);
        bounds.select('.focuslineX').style('opacity', 0);
        bounds.select('.focuslineY').style('opacity', 0);
        tooltip.style('opacity', 0);
    }
    
}

drawChart();

//finding yscale domain
function findYScale(data) {
    let evaluation = [];

    for (let i = 0; i < data.length; i++) {
        let values = Object.values(data[i]);
        values.shift();

        for (let u = 0; u < values.length; u++) {
           evaluation.push(values[u]);
        }
    }

    result = d3.extent(evaluation);
    return result;
}

//responsive resize
$(window).on('resize', function() {
    d3.selectAll('svg').remove();
    drawChart();
});

function retrieveArray(data, name) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
        result.push(data[i][name]);
    }
    return result;
}