# Day 15

Visualization Type: Radar Chart <br>
Data Source: Monthly historical propane prices from the Energy Information Agency <br>
Libraries Used: d3.js <br>
Goal: Bend the xAxis along a circle and produce the main visualization for the most basic radar chart<br>

![Day 15](day15.png)

This is a pretty simple extension of the line charts I've been making. 

The main difference comes in a few places: creating a center point, scaling, and using d3.lineRadial() instead of d3.line() to produce the path. 

The scales are the most notably different aspect to these charts. The range for the x-axis has to be curved, so this requires using Math.PI to establish that the data is being mapped to the outer edge of a circle. This is easiest to do with radians, which are multiples of Pi. If the circle starts at 0 and ends at 2 * Pi, then you have a full circle. 

The yScale is just the range of radius at which the data points are mapped. Establishing an inner and outer radius allows you to tightly control where they are being mapped on screen... but in relation to what point of origin?

The third thing is creating a center point where you can append the path from. This is the exact same process as appending bounds for the entire visualization, except you are translating to the center, not the upper-left corner. 

Otherwise, that's basically it! Easy. 

What I want to do with this in the future is to divide each year into its respective months and create small multiples, so that only 12 points are graphed per year. Or perhaps, create a distribution pattern for all the months, which could be useful for understanding seasonality of the prices. 