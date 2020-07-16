// treemap
// following tutorial


async function drawChart() {
    let dataset = await d3.csv('../data/midstream.csv', function(d) {
        return {
            company: d.company,
            industry: d.industry,
            metric: d.divyield
        }
    })


    console.log(dataset[0], dataset[1]);

    var dimensions = {
        width: window.innerWidth * 0.7,
        height: window.innerHeight * 0.7,
        margins: {
            left: 20, 
            right: 20, 
            top: 20, 
            bottom: 20
        }
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margins.right- dimensions.margins.left;
    dimensions.boundedHeight = dimensions.height - dimensions.margins.top - dimensions.margins.bottom;

    const viz = d3.select('#viz').append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)

    const bounds = viz.append('g')
        .style('transform', `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`);

    // treemaps requires an overarching parent id to group everything being compared... in this case, industry, which is midstream
    // why is (dataset); out there by itself?
    
    const root = d3.stratify(dataset)
        .id(function(d) { return d.company; })
        .parentId(function(d) { return d.industry; })
        (dataset);

    // stratified data must have .sum() called on it before you can use d3.treemap() to produce the data structure needed
    root.sum(function(d) { return +d.metric });

    console.log("root leaves", root.leaves());

    const treemap = d3.treemap()
        .size([dimensions.boundedWidth, dimensions.boundedHeight])
        .paddingInner(5)
        (root)

    bounds.selectAll('rect')
        .data(root.leaves())
        .enter()
        .append('rect')
            .attr('x', function(d) { return d.x0; })
            .attr('y', function(d) { return d.y0; })
            .attr('width', function(d) { return d.x1 - d.x0; })
            .attr('height', function(d) { return d.y1 - d.y0; })
            .style('stroke', 'black')
            .style('fill', 'teal')

    bounds.selectAll('text')
        .data(root.leaves())
        .enter()
        .append('text')
            .attr('x', function(d) { return d.x0 + 20})
            .attr('y', function(d) { return d.y0 + 50})
            .text(function(d) { return d.data.company })
            .attr('font-size', '12px')
            .attr('fill', 'white')
}

drawChart();

$(window).on('resize', function() {
    d3.selectAll('svg').remove();
    drawChart();
});