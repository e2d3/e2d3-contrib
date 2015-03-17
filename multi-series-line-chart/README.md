Multi-Series Line Chart====<http://bl.ocks.org/mbostock/3884955>
This line chart is constructed from a CSV file storing the daily average temperatures of New York, San Francisco and Austin over the last year. The chart employs conventional margins and a number of D3 features:

- d3.tsv - load and parse data
- d3.time.format - parse dates
- d3.time.scale - x-position encoding
- d3.scale.linear - y-position encoding
- d3.scale.category10, a d3.scale.ordinal - color encoding
- d3.extent, d3.min and d3.max - compute domains
- d3.keys - compute column names
- d3.svg.axis - display axes
- d3.svg.line - display line shape
