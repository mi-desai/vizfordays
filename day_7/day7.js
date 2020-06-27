// day 7

// goals
// get lookups right
// get circles drawn for each series
// get dotted lines drawn to each dot

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
        height: window.innerWidth * 0.5,
        margins: {
            top: 10,
            bottom: (window.innerHeight * 0.7) * 0.2, 
            left: (window.innerWidth * 0.5) * 0.075, 
            right: 10
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

    // const series2Generator = d3.line()
    //     .x(d => xScale(xAccessor(d)))
    //     .y(d => yScale(bakken(d)))
    //     .curve(d3.curveCardinal.tension(0.01));

    // const series3Generator = d3.line()
    //     .x(d => xScale(xAccessor(d)))
    //     .y(d => yScale(haynesville(d)))
    //     .curve(d3.curveCardinal.tension(0.01));
    
    // const series4Generator = d3.line()
    //     .x(d => xScale(xAccessor(d)))
    //     .y(d => yScale(niobara(d)))
    //     .curve(d3.curveCardinal.tension(0.01));
    
    // const series5Generator = d3.line()
    //     .x(d => xScale(xAccessor(d)))
    //     .y(d => yScale(marcellus(d)))
    //     .curve(d3.curveCardinal.tension(0.01));
    
    // const series6Generator = d3.line()
    //     .x(d => xScale(xAccessor(d)))
    //     .y(d => yScale(eagleford(d)))
    //     .curve(d3.curveCardinal.tension(0.01));
    
    const series1 = bounds.append('path')
        .data(dataset)
        .attr('d', series1Generator(dataset))
        .attr('fill', 'none')
        .attr('stroke', 'teal')
        .attr('class', 'path')
        .attr('id', 'permian')
        .attr('stroke-width', 5);

    // const series2 = bounds.append('path')
    //     .data(dataset)
    //     .attr('d', series2Generator(dataset))
    //     .attr('fill', 'none')
    //     .attr('stroke', 'lightcoral')
    //     .attr('id', 'bakken')
    //     .attr('class', 'path')
    //     .attr('stroke-width', 5)
    
    // const series3 = bounds.append('path')
    //     .data(dataset)
    //     .attr('d', series3Generator(dataset))
    //     .attr('fill', 'none')
    //     .attr('class', 'path')
    //     .attr('id', 'haynesville')
    //     .attr('stroke', 'cornflowerblue')
    //     .attr('stroke-width', 5)
    
    // const series4 = bounds.append('path')
    //     .data(dataset)
    //     .attr('d', series4Generator(dataset))
    //     .attr('fill', 'none')
    //     .attr('class', 'path')
    //     .attr('id', 'niobara')
    //     .attr('stroke', 'indigo')
    //     .attr('stroke-width', 5)

    // const series5 = bounds.append('path')
    //     .data(dataset)
    //     .attr('d', series5Generator(dataset))
    //     .attr('fill', 'none')
    //     .attr('class', 'path')
    //     .attr('class', 'marcellus')
    //     .attr('stroke', 'crimson')
    //     .attr('stroke-width', 5)

    // const series6 = bounds.append('path')
    //     .data(dataset)
    //     .attr('d', series6Generator(dataset))
    //     .attr('fill', 'none')
    //     .attr('class', 'path')
    //     .attr('id', 'eagleford')
    //     .attr('stroke', 'darkorange')
    //     .attr('stroke-width', 5)

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
    
    //axis labels

    const yAxisLabel = yAxis.append('text')
        .attr('x', dimensions.margins.right - dimensions.margins.left)
        .attr('y', (dimensions.boundedHeight / 2) + dimensions.margins.top)
        .attr('fill', 'black')
        .style('font-size', '1.4em')
        .text('Rigs')
    
    const xAxisLabel = xAxis.append('text')
        .attr('x', dimensions.boundedWidth / 2)
        .attr('y', dimensions.margins.top * 3.5)
        .attr('fill', 'black')
        .style('font-size', '1.4em')
        .text('Time')
    
    //binding event listeners to a transparent rect that overlays "bounds"
    //this allows all the mouseover, mousemove, and mouseout functions to be able to capture all the movements of the mouse within the graph
    bounds.append('rect')
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .attr('width', dimensions.boundedWidth)
        .attr('height', dimensions.boundedHeight)
        .style('transform', `translate(${5}px, ${0}px)`)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout)
    
    let permianDot = bounds.append('g')
        .append('circle')
            .style('fill', 'none')
            .attr('stroke', 'black')
            .attr('r', 8.5)
            .style('transform', `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`)
            .style('opacity', 0)
    
    let permianText = bounds.append('g')
        .append('text')
            .style('opacity', 0)
            .attr('text-anchor', 'left')
            .style('transform', `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`)
            .attr('alignment-baseline', 'middle')
    
    function mouseover() {

        permianDot.style('opacity', 1);
        permianText.style('opacity', 1);
        
    }

    function mousemove() {
        //updating the positions of x and y for the "tooltip dot"

        //get and update mouse positions
        let xLookup = xScale.invert(d3.mouse(this)[0]);
        let yLookup = yScale.invert(d3.mouse(this)[1]);

        console.log("date from mouse", xLookup);
        console.log('Permian value from mouse', yLookup);

        // these function calls will return any particular key's values as an array

        let permianSeries = retrieveArray(dataset, "permian");
        let monthSeries = retrieveArray(dataset, "month");


        //need to experiment more with the bisector functions - these don't quite work
        let closestY = d3.bisectLeft(permianSeries, yLookup);
        let closestX = d3.bisectLeft(monthSeries, xLookup);
        // console.log(closestY);

        // let test = yBisect.right(dataset, yLookup);
        // console.log(test, dataset[test]); 

        // this is the problem, the date bisector is not working correctly - it always returns index 1
        // console.log("date index", dateBisector(dataset, xLookup, 1));

        // another issue, the value bisector is not working either
        // console.log("permian index", bisector(dataset, yLookup, 1));

        //translate the returned bisector lookups to values
        // let yValuePermian = dataset[closestY].permian;
        // console.log(closestY);
        // let xValue = dataset[closestX].month;
        // console.log(closestX);

        //pass the data values to scales and attributes 
        // permianDot
        //     .attr('cx', xScale(xValue))
        //     .attr('cy', yScale(yValuePermian))
    }

    function mouseout() {
        
        permianDot.style('opacity', 0);
        permianText.style('opacity', 0);
    }
    
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

let yBisect = d3.bisector(d => d.permian);
let xBisect = d3.bisector(d => d.month);

function retrieveArray(data, name) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
        result.push(data[i][name]);
    }
    return result;
}