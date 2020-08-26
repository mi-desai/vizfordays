// radar chart
// each line has 12 points for each of the 12 months
// using propane price data

async function drawChart() {
    let dataset = await d3.csv('../data/energyprices.csv', function(d) {
        return {
            date: d.Date,
            price: +d.Propane
        }
    })

    const dateParser = d3.timeParse("%b-%Y");
    const xAccessor = d => dateParser(d.date);
    const yAccessor = d => d.price;

    //group data by year, call larger dataset in entries(), not within nest()
    let data = d3.nest()
        .key(function(d) { return dateParser(d.date).getFullYear(); })
        .entries(dataset)

    const startpoint = data.length - 2;

    const year = data[data.length -2];

    // five year average

    function extractFiveYearAvg(data, startpoint) {

        let start = startpoint - 4;
        let period = 6;

        let jan = [], feb = [], mar = [], apr = [], may = [], jun = [], jul = [], aug = [], sep = [], oct = [], nov = [], dec = []; 
        

        for (let i = start; i < (start + period); i++) {
            for (let m = 0; m < data[i].values.length; m++) {

                if (m === 0) {
                    jan.push(data[i].values[m]);
                }

                if (m === 1) {
                    feb.push(data[i].values[m])
                }

                if (m === 2) {
                    mar.push(data[i].values[m]);
                }

                if (m === 3) {
                    apr.push(data[i].values[m]);
                }

                if (m === 4) {
                    may.push(data[i].values[m]);
                }

                if (m === 5) {
                    jun.push(data[i].values[m]);
                }

                if (m === 6) {
                    jul.push(data[i].values[m]);
                }

                if (m === 7) {
                    aug.push(data[i].values[m]);
                }

                if (m === 8) {
                    sep.push(data[i].values[m]);
                }

                if (m === 9) {
                    oct.push(data[i].values[m]);
                }

                if (m === 10) {
                    nov.push(data[i].values[m]);
                }

                if (m === 11) {
                    dec.push(data[i].values[m]);
                }
            }
        }

        let months = [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec];

        console.log("months", months);

        let result = [];

        for (let i = 0; i < months.length; i++) {
            console.log(i, months[i]);

            result.push({
                month: i,
                price: 0
            })

        }

        console.log("result", result);

        return result;
    }

    function extractAllTimeAvg(data) {

        let jan = [], feb = [], mar = [], apr = [], may = [], jun = [], jul = [], aug = [], sep = [], oct = [], nov = [], dec = []; 
        

        for (let i = 0; i < data.length; i++) {
            for (let m = 0; m < data[i].values.length; m++) {

                if (m === 0) {
                    jan.push(data[i].values[m].price);
                }

                if (m === 1) {
                    feb.push(data[i].values[m].price)
                }

                if (m === 2) {
                    mar.push(data[i].values[m].price);
                }

                if (m === 3) {
                    apr.push(data[i].values[m].price);
                }

                if (m === 4) {
                    may.push(data[i].values[m].price);
                }

                if (m === 5) {
                    jun.push(data[i].values[m].price);
                }

                if (m === 6) {
                    jul.push(data[i].values[m].price);
                }

                if (m === 7) {
                    aug.push(data[i].values[m].price);
                }

                if (m === 8) {
                    sep.push(data[i].values[m].price);
                }

                if (m === 9) {
                    oct.push(data[i].values[m].price);
                }

                if (m === 10) {
                    nov.push(data[i].values[m].price);
                }

                if (m === 11) {
                    dec.push(data[i].values[m].price);
                }
            }
        }

        let months = [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec].map((month) => {return d3.mean(month);})

        return months;
    }

    function extractCurrentYear(data, year) {
        console.log(year.key);
        currentYear = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].key === year.key) {
                
            }
        }


    }

    const fiveYearAvg = extractFiveYearAvg(data, startpoint);
    console.log(fiveYearAvg);

    const allTimeAvg = extractAllTimeAvg(data);
    console.log(allTimeAvg);

    const current = extractCurrentYear(data, year)
    console.log(current);


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