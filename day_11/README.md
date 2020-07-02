# Day 11

Visualization Type: Treemap <br>
Data Source: Market data on midstream oil and gas companies <br>
Subject: Dividend Yields <br>
Libraries Used: d3.js <br>
Goal: Create the appropriate layout and data structure to make a treemap <br>

I've never made a treemap before although I really enjoy the visual and find them useful. I realized, however, that creating them from data requires a linked list / tree and node style data structure, something that I've never been exposed to outside of leetcode. 

So today I just spent the time collecting my small dataset, and then experimenting with d3.stratify and d3.treemap to get the csv into the right format to generate the layout. That seems like half / most of the battle. 

My goals with the treemap are to make nested maps, and to transition them from one dataset to another seamlessly. 