# Day 12

Visualization Type: Line Graph <br>
Data Source: Energy Information Agency (eia.gov) <br>
Subject: Regional Rig Counts for oil and gas drilling <br>
Libraries Used: d3.js, jQuery(for two selections) <br>
Goal: Authenticate checkbox selections, dynamically load in additional data from checkbox selections, regroup data by basin, join data to d3<br>


Did a lot this morning. 

The goal is to be able to click on any checkbox and have that series data be loaded in as its own line. This sounds somewhat simple but it's definitely not, and I haven't seen any blocks on bl.ocks.org for help. But, this is the way you learn!

I decided to load in all the data into the dataset variable and keep that unchanged. The idea will be that only the data matching the series selections in the checkboxes will be extracted from the dataset variable and bound to the lines. 

But first, I needed to establish what happens in a default case (when the chart is first loaded), versus what happens when a checkbox is checked or unchecked. To do this, I created an authenticator object that has 1 for all checked checkboxes, and a 0 otherwise. When updateChart() is called when a checkbox is changed, the authenticator is updated and two arrays of either updates or deletions is created. 

```javascript
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
```

These updates and deletions are then used to add in or delete the series that are selected by the checkboxes. Because the series are all Arrays of the same length, the index of the selected series corresponds to the same date in the original dataset, which made this somewhat easier. If the data series already existed in the data object, it is deleted instead of added.

```javascript
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
```

Then, I realized that d3's joining and update process was not ideally suited for the data that I had spent all this time retrieving and deleting. The way it was currently set up, there was no way for d3 to know that the columns were intended to be separate lines, so taking the data just loaded in and slicing it by the appropriate series was now necessary, which I set up a utility function for.

```javascript
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
        console.log('slices', result);
        return result;
    }
```

What this did was create an array of dictionaries, where the id was the series name. So if one series was selected, the array would have one element and look like:

```javascript
{
        id: permian,
        values: [
                {}
        ]
}
```

With values containing the series data and the corresponding dates. 

Now we could get to business actually drawing the lines! And right here is where I encountered a bit of trouble. While I was able to get the initial line to draw itself... it does not update yet. I need to read about the update process in d3. 

```javascript
const lineFunction = d3.line()
        .x(function(d) { return xScale(d.month); })
        .y(function(d) { return yScale(d.rigs); })
        .curve(d3.curveCardinal.tension(0.01));
    
    const paths = bounds.selectAll('.path')
        .data(slices)
        .enter()
        .append('g');

    paths.append('path')
        .attr('id', function(d) { return d.id; })
        .attr('d', function(d) { return lineFunction(d.values); })
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 5)
        .attr('class', 'path')

```

As you can see, now that d3's data is bound to 'slices' - that new variable created, it should be creating as many new paths as there are series in the data (called 'slices'), and for each slice, there is a corresponding 'values' array that can get passed to the lineFunction(). 

Some ideas on how to fix it - do any existing path elements representing data series need to be removed using .exit() and .remove() before appending anything? 