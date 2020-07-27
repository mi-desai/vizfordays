// basic heatmap using cycling data

async function drawChart() {
    let dataset = await d3.csv('../data/cycling.csv', function(d) {
        return {
                zone: d.zone,
                tests: d.tests,
                ftp: d.ftp
            }
        });

    var dimensions = {
        width: window.innerWidth * 0.85,
        height: window.innerHeight * 0.9,
        margins: {
            right: 20, 
            left: 100, 
            top: 5, 
            bottom: 50
        }
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margins.right - dimensions.margins.left;
    dimensions.boundedHeight = dimensions.height - dimensions.margins.top - dimensions.margins.bottom;

    const viz = d3.select('#viz').append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

    const bounds = viz.append('g')
        .style('transform', `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`);

    let xValues = extract(dataset, "x");
    let yValues = extract(dataset, "y");
    let colorValues = extract(dataset, "vals").sort((a, b) => a - b);

    //band scales for x and y axis
    //band scales need all categories in the domain, unlike scaleLinear
    //set padding between the points of each
    //can we put labels in between to remove the axes?

    const xScale = d3.scaleBand()
        .domain(xValues)
        .range([dimensions.margins.right, dimensions.boundedWidth])
        .padding(0.05)
    
    const yScale = d3.scaleBand()
        .domain(yValues)
        .range([dimensions.margins.top, dimensions.boundedHeight])
        .padding(0.05)

    //color scales are always linear
    //mapping the actual continuous data values to color is the point of a heat map

    const colorScale = d3.scaleLinear()
        .range(["white", "#f08080"])
        .domain([0, colorValues[colorValues.length-1]]);

    const yAxis = bounds.append('g')
        .call(d3.axisLeft(yScale))

    const xAxis = bounds.append('g')
        .call(d3.axisBottom(xScale))
        .style('transform', `translateY(${dimensions.boundedHeight + 3}px)`)

    const xLabel = xAxis.append('text')
        .attr('x', (dimensions.boundedWidth / 2))
        .attr('y', dimensions.margins.bottom - 10)
        .attr('fill', 'black')
        .style('font-size', '1.4em')
        .style('class', 'label')
        .text('Power Zones')

    const yLabel = yAxis.append('text')
        .attr('x', (dimensions.margins.right - 45))
        .attr('y', (dimensions.boundedHeight / 2) + dimensions.margins.top)
        .attr('fill', 'black')
        .style('font-size', '1.4em')
        .text('Tests')

    //nice and easy
    const rects = bounds.selectAll()
        .data(dataset)
        .enter()
        .append('rect')
            .attr('x', function(d) { return xScale(d.zone) })
            .attr('y', function(d) { return yScale(d.tests) })
            .attr('width', xScale.bandwidth() )
            .attr('height', yScale.bandwidth() )
            .style('fill', function(d) { return colorScale(d.ftp); })
            .style('class', 'rects')
    
}

drawChart();

$(window).on('resize', function() {
    d3.selectAll('svg').remove();
    drawChart();
});

function extract(data, axis) {

    if (axis === "x") {
        let x = []
        for (let i = 0; i < data.length; i++) {
            x.push(data[i].zone);
        }
        return x;

    }

    if (axis === "y") {
        let y = []
        for (let i = 0; i < data.length; i++) {
            y.push(data[i].tests);
        }
        return y;
    }

    if (axis === "vals") {
        let vals = []
        for (let i = 0; i < data.length; i++) {
            vals.push(data[i].ftp);
        }
        return vals;
    }
}