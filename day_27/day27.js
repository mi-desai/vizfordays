// radar chart
// each line has 12 points for each of the 12 months
// using propane price data

async function drawChart() {
    let dataset = await d3.csv('../data/energyprices.csv', function(d) {
        return {
            date: d.Date,
            price: d.Propane
        }
    })

    const dateParser = d3.timeParse("%b-%Y");
    const xAccessor = d => dateParser(d.date);
    const yAccessor = d => d.price;

    var dimensions = {
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.7,
        margins: {
            top: 20, 
            left: 20, 
            right: 20,
            bottom: 20
        }
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margins.right - dimensions.margins.left;
    dimensions.boundedHeight = dimensions.height - dimensions.margins.top - dimensions.margins.bottom;

    const viz = d3.select('#viz').append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

    const bounds = viz.append('g')
        .style('transform', `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`);

    const center = bounds.append('g')
        .style('transform', `translate(${dimensions.boundedWidth / 2}px, ${dimensions.boundedHeight/2}px)`)

    //scales
    
    const innerRadius = 100;
    const outerRadius = 250;
    const start = 0;
    const end = start + (Math.PI * 2);

    const xScale = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([start, end]);
        
    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([innerRadius, outerRadius]);
    
    //draw Data

    const radar = d3.lineRadial()
        .angle(function(d) { return xScale(xAccessor(d)); })
        .radius(function(d) { return yScale(yAccessor(d)); })
        .curve(d3.curveCardinal);

    center.append('path')
        .datum(dataset)
        .attr('id', 'radar')
        .attr('class', 'path')
        .attr('fill', 'none')
        .attr('stroke', 'lightcoral')
        .attr('stroke-width', 4)
        .attr('d', radar);
}

drawChart();

$(window).on('resize', function() {
    d3.selectAll('svg').remove();
    drawChart();
})