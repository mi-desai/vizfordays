var app = new Vue({
    el: '#app', 
    data: {
        title: 'Feature Tests',
        viz_width: 900,
        viz_height: 560,
        margin: {right: 50, top: 50, bottom: 50, left: 50},
        series: [200, 400, 500, 600, 300, 400, 100, 900, 500, 300, 200, 500, 400, 800, 600, 300],
        years: ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]
    }, 
    mounted: function() {
        let style = document.createElement('link');
        style.type = "text/css";
        style.rel = "stylesheet";
        style.href = "day1.css";
        document.head.appendChild(style);
    }, 

    computed: {
        scaledValues () {
            let input = [];

            let series = {title: 'Series', scaled: [], values: this.series};
            let years = {title: 'Years', scaled: [], values: this.years};

            input.push(series, years);
            
            for (let i = 0; i < input.length; i++) {
                if (input[i].title === "Series") {
                    input[i].scaled = input[i].values.map(item => this.scales.y(item) );
                }

                if (input[i].title === "Years") {
                   input[i].scaled = input[i].values.map(item => this.scales.x(item) );
                }
            }

            return input;
        },

        mapped () {
            let input = this.scaledValues;
            let output = [];
            let years = input[1].scaled;
            let values = input[0].scaled;
        
            for (let i = 0; i < values.length; i++) {
                let structure = {
                    year: years[i],
                    value: values[i]
                }
                output.push(structure);
            }

            return output;
        },

        dPath () {
        
            let input = this.mapped;

            let line = d3.line()
                    .x(function(d) {return d.year})
                    .y(function(d) {return d.value})
                    .curve(d3.curveStep);
            
            let path = line(input);

            return path;
        }, 

        width () {
            return this.viz_width - this.margin.right - this.margin.left;
        },

        height () {
            return this.viz_height - this.margin.top - this.margin.bottom;
        },

        scales () {
            let x = d3.scaleBand().domain(this.years).range([this.margin.left, this.width]);
            let y = d3.scaleLinear().domain(d3.extent(this.series)).range([this.height, this.margin.top]);
            return {x, y}
        }, 

        circles () {

            return "";
        },

    }, 

    directives: {
        axis(element, binding) {
            const axis = binding.arg;
            const axisMethod = { x: "axisBottom", y: "axisRight" }[axis];
            const methodArg = binding.value[axis];
            console.log("inputs", axisMethod, methodArg);
            d3.select(element).call(d3[axisMethod](methodArg));
        }
    }
    
})