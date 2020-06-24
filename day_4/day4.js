// multiple data series and appropriate scale finding for all series - check
// responsive on resize - check
// legend - need to do this...
// if time, svg animation of paths on load - need to this...

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

    const series1Accessor = d => d.permian;
    const series2Accessor = d => d.bakken;
    const series3Accessor = d => d.haynesville;
    const series4Accessor = d => d.niobara;
    const series5Accessor = d => d.marcellus;
    const series6Accessor = d => d.eagleford;

    var dimensions = {
        width: window.innerWidth * 0.7,
        height: window.innerWidth * 0.5,
        margins: {
            top: 30,
            bottom: 30, 
            left: 60, 
            right: 30
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
    
    // y scale is where we run into problems, created a function that loops (inefficiently) through all series values and returns an array
    let yDomain = findYScale(dataset);
    
    const yScale = d3.scaleLinear()
        .domain(yDomain)
        .range([dimensions.boundedHeight, dimensions.margins.bottom]);
    
    const series1Generator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(series1Accessor(d)))
        .curve(d3.curveCardinal.tension(0.01));

    const series2Generator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(series2Accessor(d)))
        .curve(d3.curveCardinal.tension(0.01));

    const series3Generator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(series3Accessor(d)))
        .curve(d3.curveCardinal.tension(0.01));
    
    const series4Generator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(series4Accessor(d)))
        .curve(d3.curveCardinal.tension(0.01));
    
    const series5Generator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(series5Accessor(d)))
        .curve(d3.curveCardinal.tension(0.01));
    
    const series6Generator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(series6Accessor(d)))
        .curve(d3.curveCardinal.tension(0.01));
    
    const series1 = bounds.append('path')
        .attr('d', series1Generator(dataset))
        .attr('fill', 'none')
        .attr('stroke', 'teal')
        .attr('class', 'path')
        .attr('id', 'permian')
        .attr('stroke-width', 5);

    const series2 = bounds.append('path')
        .attr('d', series2Generator(dataset))
        .attr('fill', 'none')
        .attr('stroke', 'lightcoral')
        .attr('class', 'path')
        .attr('stroke-width', 5)
    
    const series3 = bounds.append('path')
        .attr('d', series3Generator(dataset))
        .attr('fill', 'none')
        .attr('stroke', 'cornflowerblue')
        .attr('stroke-width', 5)
    
    const series4 = bounds.append('path')
        .attr('d', series4Generator(dataset))
        .attr('fill', 'none')
        .attr('class', 'path')
        .attr('stroke', 'indigo')
        .attr('stroke-width', 5)

    const series5 = bounds.append('path')
        .attr('d', series5Generator(dataset))
        .attr('fill', 'none')
        .attr('class', 'path')
        .attr('stroke', 'crimson')
        .attr('stroke-width', 5)

    const series6 = bounds.append('path')
        .attr('d', series6Generator(dataset))
        .attr('fill', 'none')
        .attr('class', 'path')
        .attr('stroke', 'darkorange')
        .attr('stroke-width', 5)

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
    
}

drawChart();

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

//responsive resize - that was easy!
$(window).on('resize', function() {
    d3.selectAll('svg').remove();
    drawChart();
});