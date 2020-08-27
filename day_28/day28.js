// version 3

let n = 100;
let lines = 3;

//random number generating functions and parameters
let randomNormal = d3.randomNormal(12,3);
let randomExponential = d3.randomExponential(0.25);
let randomLog = d3.randomLogNormal(0.8, 0.8);

//random data generation from functions
//each set has 100 points
let normalData = d3.range(n).map(randomNormal);
let exponentialData = d3.range(n).map(randomExponential);
let logData = d3.range(n).map(randomLog);

//data will stored in an array of arrays
let data = [normalData, exponentialData, logData];

//random generation functions will be stored in an array for later use, since everything will be created from a loop
let randoms = [randomNormal, randomExponential, randomLog];

//this will allow me to loop through and attach id's to the lines generated to allow for styling
let names = ['normal', 'exp', 'log'];

//dimensions
let dimensions = {
    width: window.innerWidth * 0.98,
    height: window.innerHeight * 0.6,
    margins: {
        top: 10, 
        right: 0,
        bottom: 10,
        left: 0
    }
}

//setting bounds, though I don't think it's necessary for this viz
dimensions.boundedWidth = dimensions.width - dimensions.margins.right - dimensions.margins.left;
dimensions.boundedHeight = dimensions.height - dimensions.margins.top - dimensions.margins.bottom; 

// create the SVG
const viz = d3.select("#viz").append("svg")
    .attr('width', dimensions.boundedWidth)
    .attr('height', dimensions.boundedHeight)

// everything should originate from a center point, so instead of moving the amount of the left and top margins down, this g tag is created by going to the center
const center = viz.append('g')
    .attr('class', 'center')
    .style('transform', `translate(${dimensions.boundedWidth / 2}px, ${dimensions.boundedHeight - dimensions.margins.bottom - dimensions.margins.top}px)`)

//SCALES
// this is the 9 o'clock position
const start = (3*Math.PI / 2);
// this is the 3 o'clock position
const end = start + Math.PI;

const innerRadius = 200;
const outerRadius = 300;

//xScale must map the indexes of each array to an angle to allow for the x-axis to be curved
const xScale = d3.scaleLinear()
    .domain([0, n - 1])
    .range([start, end]);

//yScale must map to the inner and outer radius
let yDomain = findDomain(normalData, logData, exponentialData);
const yScale = d3.scaleLinear()
    .domain(yDomain)
    .range([innerRadius, outerRadius]);

//path generation functions - need three to get different curves
const normal = d3.lineRadial()
    .angle(function(d, i) { return xScale(i); })
    .radius(function(d, i) { return yScale(d); })
    .curve(d3.curveCardinal.tension(0.15))

const exp = d3.lineRadial()
    .angle(function(d, i) { return xScale(i); })
    .radius(function(d, i) { return yScale(d); })
    .curve(d3.curveMonotoneY)

const log = d3.lineRadial()
    .angle(function(d, i) { return xScale(i); })
    .radius(function(d, i) { return yScale(d); })
    .curve(d3.curveStepAfter)

//the path generation functions are stored in an array to be looped through later 
let functions = [normal, exp, log];

//desired colors are stored in an array to loop through later
let colors = ['teal', 'cornflowerblue', 'lightcoral'];

//clipPath is defined
//the rectangle is being appended from "center" so it has to be translated back to the bounds of the visualization
center.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
        .attr("width", dimensions.boundedWidth)
        .attr("height", dimensions.boundedHeight)
        .style('transform', `translate(${(dimensions.boundedWidth / 2) * -1}px, ${-dimensions.height + ((dimensions.margins.top + dimensions.margins.bottom) * 2)}px)`)

// idea is that by organizing other functionalities into arrays of arrays, you can pass in functionality for each i of the loop
// problem is that including the 'clip-path' attribute binding it to the id of clip above gives weird dimensions to the clipPath
// this error causes most of the viz to not appear
function draw(i,speed,color){

        center.append("g")
            .attr('clip-path', 'url(#clip)')
            .append("path")
                .datum(data[i])
                .attr("class", "line")
                .attr('id', names[i])
                .attr("stroke",color[i])
                .attr('stroke-width', 5)
                .transition()
                .duration(speed)
                .ease(d3.easeLinear)
                // on the start of the transition, call tick
                // notice that the d attribute of the path has not been appended yet
                .on("start", tick);

function tick() {
    
        // Push a new data point onto the back of the current dataset
        data[i].push(randoms[i]());
        // Draw the line.
        d3.select(this)
            .attr("d", functions[i])
            .attr("transform", null);
        // Slides it to the left, or along the horizontal axis.
        d3.active(this)
            .attr("transform", "translate(" + xScale(-1) + ",0)")
            .transition()
            .on("start", tick);
        // Pop the old data point off the front as it should be beyond the bounds of the viz.
        data[i].shift();
    }
}

//loop calls draw for each line, each line's draw function calls tick, which calls itself recursively
for (let i=0;i<lines;i++){

    draw(i,150,colors)

}

// utility function that takes all three sets and finds the min and max, and passes it back to be mapped to the range for yScale
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