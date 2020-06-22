async function drawChart() {
    const dataset = await d3.csv("../data/energyprices.csv", function(d) {
        return {
            propane: d.Propane,
            wti: d.WTI,
            brent: d.Brent,
            date: d.Date
        }
        
    });

    const dateParser = d3.timeParse("%b-%Y");
    const xAccessor = d => dateParser(d.date);
    const yAccessor1 = d => d.wti;
    const yAccessor2 = d => d.propane;
    const yAccessor3 = d => d.brent;

    let dimensions = {
        width: window.innerWidth * 0.7,
        height: 600,
        margins: {
            top: 20,
            right: 20,
            bottom: 50,
            left: 60
        }
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margins.right - dimensions.margins.left;
    dimensions.boundedHeight = dimensions.height - dimensions.margins.top - dimensions.margins.bottom;

    const wrapper = d3.select('#wrapper')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    const bounds = wrapper.append('g')
        .style('transform', `translate(${
            dimensions.margins.left
        }px, ${dimensions.margins.top}px)`);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor3))
        .range([dimensions.boundedHeight, dimensions.margins.top + 150]);
    
    const xScale = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimensions.boundedWidth]);
    
    const wtiGenerator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor1(d)))
        .curve(d3.curveCardinal.tension(0.05));
    
    const brentGenerator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor3(d)))
        .curve(d3.curveCardinal.tension(0.05));
    
    const wti = bounds.append('path')
        .attr('d', wtiGenerator(dataset))
        .attr('fill', 'none')
        .attr('stroke', 'teal')
        .attr('stroke-width', 5);

    const brent = bounds.append('path')
        .attr('d', brentGenerator(dataset))
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('stroke-width', 5)
        .attr('stroke-dasharray', 2);
    
    const yAxisGenerator = d3.axisLeft()
        .scale(yScale);
    
    const xAxisGenerator = d3.axisBottom()
        .scale(xScale);
    
    const yAxis = bounds.append('g')
        .call(yAxisGenerator);
    
    const xAxis = bounds.append('g')
        .call(xAxisGenerator)
            .style('transform', `translateY(${dimensions.boundedHeight}px)`);
    
}

drawChart();


