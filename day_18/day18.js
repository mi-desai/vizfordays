// filtering for country shapes

async function drawChart() {
    let dataset = await d3.json('../data/world_geojson.json');

    console.log(dataset.features[0]);

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
        .center([120, -25])
        .scale(dimensions.boundedWidth / 3)
        .translate([dimensions.boundedWidth / 2, dimensions.boundedHeight / 2]);

    dataset.features = dataset.features.filter(function(d) {
        return d.properties.name == "Australia"
    })

    console.log(dataset.features);

    bounds.append('g')
        .selectAll('path')
        .data(dataset.features)
        .enter().append('path')
            .attr('fill', 'black')
            .attr('class', 'australia')
            .attr('d', d3.geoPath().projection(projection))
            .style('stroke', 'black')
            .style('stroke-width', 2)

}

drawChart();

$(window).on('resize', function() {
    d3.selectAll('svg').remove();
    drawChart();
});