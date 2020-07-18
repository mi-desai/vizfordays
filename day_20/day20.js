// hexgrid map of the United States

async function drawChart() {
    let dataset = await d3.json('../data/usa_hexgrid.json');

    var dimensions = {
        width: window.innerWidth * 0.85,
        height: window.innerHeight * 0.9,
        margins: {
            right: 20, 
            left: 20, 
            top: 20, 
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

    const projection = d3.geoMercator()
        .scale(450)
        .translate([1200, 600]);

    const shape = d3.geoPath()
        .projection(projection);

    bounds.append('g')
        .selectAll('path')
        .data(dataset.features)
        .enter()
            .append('path')
                .attr('fill', 'cornflowerblue')
                .attr('d', shape)
                .attr('stroke', 'white')

    bounds.append('g')
        .selectAll('labels')
        .data(dataset.features)
        .enter()
        .append('text')
            .attr('x', function(d) { return shape.centroid(d)[0] })
            .attr('y', function(d) { return shape.centroid(d)[1] })
            .text(function(d) { return d.properties.iso3166_2 })
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'central')
            .style('font-size', 11)
            .style('fill', 'white')


}

drawChart();

$(window).on('resize', function() {
    d3.selectAll('svg').remove();
    drawChart();
});