let n = 100;
let lines = 3;

let randomNormal = d3.randomNormal(12,3);
let randomExponential = d3.randomExponential(0.25);
let randomLog = d3.randomLogNormal(0.8, 0.8);

let normalData = d3.range(n).map(randomNormal);
let exponentialData = d3.range(n).map(randomExponential);
let logData = d3.range(n).map(randomLog);

let yDomain = findDomain(normalData, logData, exponentialData);

let data = [normalData, exponentialData, logData]
let randoms = [randomNormal, randomExponential, randomLog];

// let data = d3.range(lines).map(d => d3.range(n).map(randomLog));

let dimensions = {
    width: window.innerWidth * 0.98,
    height: window.innerHeight * 0.5,
    margins: {
        top: 10, 
        right: 10,
        bottom: 10,
        left: 10
    }
}

dimensions.boundedWidth = dimensions.width - dimensions.margins.right - dimensions.margins.left;
dimensions.boundedHeight = dimensions.height - dimensions.margins.top - dimensions.margins.bottom; 

// create the SVG

const viz = d3.select("#viz").append("svg")
        .attr('width', dimensions.boundedWidth)
        .attr('height', dimensions.boundedHeight)

const bounds = viz.append('g')
    .style('transform', `translate(${dimensions.margins.left}px, ${dimensions.margins.top}px)`);

const xScale = d3.scaleLinear()
        .domain([0, n - 1])
        .range([0, dimensions.boundedWidth]);

const yScale = d3.scaleLinear()
        .domain(yDomain)
        .range([dimensions.boundedHeight, 0]);

const line = d3.line()
        .x(function (d, i) { return xScale(i); })
        .y(function (d, i) { return yScale(d); })
        .curve(d3.curveCardinal);

const normal = d3.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d, i) { return yScale(d); })
    .curve(d3.curveCardinal.tension(0.15))

const exp = d3.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d, i) { return yScale(d); })
    .curve(d3.curveMonotoneY)

const log = d3.line()
    .x(function(d, i) { return xScale(i); })
    .y(function(d, i) { return yScale(d); })
    .curve(d3.curveStepAfter);

let functions = [normal, exp, log];
let colors = ['teal', 'cornflowerblue', 'lightcoral'];

bounds.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", dimensions.boundedWidth)
        .attr("height", dimensions.boundedHeight);

function draw(i,speed,color){

        bounds.append("g")
            .attr("clip-path", "url(#clip)")
            .append("path")
            .datum(data[i])
            .attr("class", "line")
            .attr("stroke",color[i])
            .attr('stroke-width', 4)
            .transition()
            .duration(speed)
            .ease(d3.easeLinear)
            .on("start", tick);

function tick() {
    
        // Push a new data point onto the back.
        data[i].push(randoms[i]());
        // Redraw the line.
        d3.select(this)
            .attr("d", functions[i])
            .attr("transform", null);
        // Slide it to the left.
        d3.active(this)
            .attr("transform", "translate(" + xScale(-1) + ",0)")
            .transition()
            .on("start", tick);
        // Pop the old data point off the front.
        data[i].shift();
    }
}

for (let i=0;i<lines;i++){
    draw(i,250,colors)
}

function findDomain(normal, exp, log) {
    let evaluation = [normal, exp, log];
    let result = [];

    for (let i = 0; i < evaluation.length; i++) {
        let next = evaluation[i];
        for (let o = 0; o < next.length; o++) {
            result.push(next[o]);
        }
    }

    result = d3.extent(result);
    return result;
}