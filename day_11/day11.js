
async function drawChart() {
    let dataset = await d3.csv('../data/midstream.csv', function(d) {
        return {
            company: d.company,
            divyield: +d.divyield,
            type: d.type
        }
    });

    console.log(dataset);

    let layout = d3.treemap()


    var dimensions = {
        width: window.innerWidth * 0.6,
        height: window.innerHeight * 0.5,
        margins: {
            top: 20,
            bottom: 20,
            left: 20, 
            right: 20
        }
    }

    const viz = d3.select('#viz').append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);
    
    const bounds = viz.append('g')
        .style('transform', `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`)
    

}

drawChart();