// day 13
// debug enter process - check
// transition yScale data values - check
// smooth transition to updated yScale - check
// remove series when boxes are unchecked - doesn't work
// new series are drawn in - check
// color scale applied - working

async function drawChart() {
    //only load the data once
    let dataset = await d3.csv('../data/drilling.csv', function(d) {
        return {
            month: d.month,
            permian: +d.permian, 
            niobara: +d.niobara,
            bakken: +d.bakken,
            marcellus: +d.marcellus,
            haynesville: +d.haynesville,
            eagleford: +d.eagleford
        }
    })

    const duration = 500;
    //abbreviated month and abbreviated year are encoded %b and %y respectively in the timeParse function
    const dateParser = d3.timeParse("%b-%y");

    let colors = ['teal', 'lightcoral', 'cornflowerblue', 'indigo', 'crimson', 'darkorange'];

    // extract the data from the full dataset but keep original dataset unmutated
    let data = extractInitialSeries(dataset);

    // not an ideal way to set this up, but easy to change
    let series = ['permian', 'bakken', 'marcellus', 'niobara', 'haynesville', 'eagleford'];

    //make sure permian series is authenticated with a "1"
    let authenticator = {
        permian: 1,
        bakken: 0,
        marcellus: 0,
        niobara: 0,
        haynesville: 0,
        eagleford: 0
    }

    let slices = slice(data, [series[0]], dateParser);

    //make sure permian is checked at the beginning
    $('#permian').prop('checked', true);

    const xAccessor = d => dateParser(d.month);
    const colorAccessor = d => d.id;

    //creating the initial viz
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
        .domain(d3.extent(data, xAccessor))
        .range([dimensions.margins.left, dimensions.boundedWidth]);
    
    let yDomain = findYScale(data);
    
    let yScale = d3.scaleLinear()
        .domain(yDomain)
        .range([dimensions.boundedHeight, dimensions.margins.top]);

    const lineFunction = d3.line()
        .x(function(d) { return xScale(d.month); })
        .y(function(d) { return yScale(d.rigs); })
        .curve(d3.curveCardinal.tension(0.01));
    
    let paths = bounds.selectAll('.basins')
        .data(slices)
        .enter();

    paths.append('path').transition().duration(500).ease(d3.easeLinear)
        .attr('id', function(d) { return d.id; })
        .attr('d', function(d) { return lineFunction(d.values); })
        .attr('fill', 'none')
        .attr('stroke', function(d, i) { return colors[i] })
        .attr('stroke-width', 5)
        .attr('class', 'basins')
    
    let yAxis = bounds.append('g')
        .call(d3.axisLeft().scale(yScale))
            .attr('class', 'dynamicAxis')
            .style('transform', `translateX(${dimensions.margins.left}px)`);
    
    let xAxis = bounds.append('g')
        .call(d3.axisBottom().scale(xScale))
            .style('transform', `translateY(${dimensions.boundedHeight}px)`);
    
    //axis label
    const yAxisLabel = yAxis.append('text')
        .attr('x', dimensions.margins.right - dimensions.margins.left)
        .attr('y', (dimensions.boundedHeight / 2) + dimensions.margins.top)
        .attr('fill', 'black')
        .style('font-size', '1.4em')
        .text('Rigs')

    //event listeners for checkboxes
    const checkboxes = d3.selectAll('.controls')
        .on('change', updateChart);
    
    // invisible event listener rect for tooltip
    bounds.append('rect')
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .attr('width', dimensions.width)
        .attr('height', dimensions.boundedHeight)
        .attr('class', 'listener')
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
        let monthSeries = retrieveArray(data, "month").map(d => dateParser(d));

        // bisector function used to query the closest date index from the data
        let closestX = d3.bisectLeft(monthSeries, xLookup);

        //dots and lines 
        bounds.select('.dots')
            .attr('cx', xScale(dateParser(data[closestX].month)))
            .attr('cy', yScale(data[closestX].permian));
        
        bounds.select('.focuslineX')
            .attr('x1', xScale(dateParser(data[closestX].month)))
            .attr('x2', dimensions.boundedWidth - dimensions.boundedWidth + dimensions.margins.left)
            .attr('y1', yScale(data[closestX].permian))
            .attr('y2', yScale(data[closestX].permian))
            .style('stroke', 'black')
            .style('stroke-width', 2)
            .style('stroke-dasharray', 3)
            .style('opacity', 1);
        
        bounds.select('.focuslineY')
            .attr('x1', xScale(dateParser(data[closestX].month)))
            .attr('y1', yScale(data[closestX].permian))
            .attr('x2', xScale(dateParser(data[closestX].month)))
            .attr('y2', dimensions.boundedHeight)
            .style('stroke', 'black')
            .style('stroke-width', 2)
            .style('stroke-dasharray', 3)
            .style('opacity', 1);
        
        //tooltip
        tooltip.select('#date')
            .text(data[closestX].month);
        
        tooltip.select('#values')
            .text(data[closestX].permian);

        tooltip.style('transform', `translate(${xScale(dateParser(data[closestX].month)) + (dimensions.margins.left * 3)}px, 
        ${yScale(data[closestX].permian)}px)`);

    }

    function mouseout() {
        
        bounds.select('.dots').style('opacity', 0);
        bounds.select('.focuslineX').style('opacity', 0);
        bounds.select('.focuslineY').style('opacity', 0);
        tooltip.style('opacity', 0);
    }
    
    function updateChart() {
        // the selection of the checkbox is captured
        let selection = this.value;

        //making sure the authenticator knows what checkboxes have been checked
        let index = series.indexOf(selection);

        //change it to either 1 or 0 to reflect being checked or not
        if (authenticator[series[index]] > 0) {
            authenticator[series[index]] = 0;
        } else {
            authenticator[series[index]] = 1;
        }
     
        //retrieve checked names
        let keys = Object.keys(authenticator);
        let values = Object.values(authenticator);
        let updates = [];
        let deletions = [];

        for (let i = 0; i < values.length; i++) {
            if (values[i] === 1) {
                updates.push(keys[i])
            }

            if (values[i] === 0) {
                deletions.push(keys[i]);
            }
        }

        //apply the new named keys to the data with a 3-layer loop
        for (let i = 0; i < data.length; i++) {
            //first loop goes through data array and allows us to query both data and dataset
            for (let o = 0; o < updates.length; o++) {
                //second loop goes through the updates array
                if (!data[i][updates[o]]) {
                    // since data and dataset have the same length, there is always a corresponding value at the same index for a different key
                    // adds a key-value pair if it appears in the updates array
                    data[i][updates[o]] = dataset[i][updates[o]];
                } else {
                    for (let z = 0; z < deletions.length; z++) {
                        //third loop goes through deletions array
                        //gets rid of the key-value pair if it appears in the deletions array
                        delete data[i][deletions[z]];
                    }
                }
            }
        }

        //reslice the data and redeclare
        newSlices = slice(data, updates, dateParser);

        //find yDomain again with the new data
        updatedYDomain = findYScale(data);

        // re-establish the y-domain and call the axis generator
        yScale.domain(updatedYDomain);
        
        //select the class containing the yAxis, wrap the new .call() in a selection and make sure you are applying the new yScale to it
        d3.select('.dynamicAxis')
            .transition().duration(duration).ease(d3.easeLinear)
                .call(d3.axisLeft().scale(yScale))
                .style('transform', `translateX(${dimensions.margins.left}px)`);

        // this doesn't remove data series ... not sure where to put .exit() or .remove()
        paths = bounds.selectAll('.basins').data(newSlices);
        
        paths.join('path').transition().duration(duration).ease(d3.easeLinear)
            .attr('id', function(d) { return d.id; })
            .attr('d', function(d) { return lineFunction(d.values); })
            .attr('fill', 'none')
            .attr('stroke', function(d, i) { return colors[i] })
            .attr('stroke-width', 5)

    }

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

    //retrieving an array from the data
    function retrieveArray(data, name) {
        let result = [];
        for (let i = 0; i < data.length; i++) {
            result.push(data[i][name]);
        }
        return result;
    }

    //slicing initial data
    function extractInitialSeries(dataset) {
        let result = [];
        for (let i = 0; i < dataset.length; i++) {
            result.push({
                month: dataset[i].month,
                permian: dataset[i].permian
            })
        }
        return result;
    }

    //slicing and rearranging
    function slice(data, ids, dateParser) {

        let result = ids.map(function(id) {
            return {
                id: id,
                values: data.map(function(d) {
                    return {
                        month: dateParser(d.month),
                        rigs: +d[id]
                    }
                })
            }
        });
        return result;
    }

}

drawChart();

