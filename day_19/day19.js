// getting all countries of Europe 

async function drawChart() {
    let dataset = await d3.json('../data/world_geojson.json');

    let region = [
        
                    "France", "Belgium", "Germany", "Ireland", 
                    "Norway", "Sweden", "Iceland", "England", 
                    "Spain", "Switzerland", "Italy", "Ukraine", "Belarus", "Estonia",
                    "Latvia", "Lithuania", "Bulgaria", "Romania", "Poland", "Malta",
                    "Moldova", "Netherlands", "Greece", "Denmark", "Hungary", "Slovakia",
                    "Czech Republic", "Croatia", "Slovenia", "Albania", "Cyprus", "Austria",
                    "Finland", "Bosnia and Herzegovina", "Portugal", "Andorra", "San Marino",
                    "Macedonia", "Luxembourg", "Republic of Serbia", "Moldova", "Turkey", 
                    "Montenegro", "Kosovo"
                ]

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
        .center([2, 47])
        .scale(dimensions.boundedWidth / 3)
        .translate([dimensions.boundedWidth / 2, dimensions.boundedHeight / 2]);

    data = dataset.features.filter((country) => {

        let match = 0;

        for (let i = 0; i < region.length; i++) {
            if (country.properties.name == region[i]) {
                match++;
                return true;
            }
        }

        if (match < 1) {
            return false;
        }
    })

    console.log(dataset.features);

    bounds.append('g')
        .selectAll('path')
        .data(data)
        .enter().append('path')
            .attr('fill', 'black')
            .attr('class', 'australia')
            .attr('d', d3.geoPath().projection(projection))
            .style('stroke', 'white')
            .style('stroke-width', 1)

}

drawChart();

$(window).on('resize', function() {
    d3.selectAll('svg').remove();
    drawChart();
});