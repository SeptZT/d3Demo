var start = new Date(2013, 0, 1),
    end = new Date(2013, 11, 31)
    range = [0, 1300],
    time = d3.time.scale().domain([start, end])
      .rangeRound(range),
    max = 12,
    data = [];
 var time1 = new Date(2017, 0, 19)  
 console.log(time1);
console.log(d3.time.format('%j')(time1));
console.log(d3.time.format('%I')(time1));
for (var i=0; i<max; i++) {
  var date = new Date(start.getTime());
  date.setMonth(start.getMonth() + i);
  data.push(date);
}

function render(data, scale, selector) {
  d3.select(selector).selectAll('div.fixed-cell')
    .data(data)
    .enter()
    .append('div')
    .classed('fixed-cell', true);
    
  d3.select(selector).selectAll('div.fixed-cell')
    .data(data)
    .exit()
    .remove();
    
  d3.select(selector).selectAll('div.fixed-cell')
    .data(data)
    .style('margin-left', function(d){
      return scale(d) + 'px';
    })
    .html(function(d){
      var format = d3.time.format('%x');
      return format(d) + '<br>' + scale(d) + 'px';
    })
}

render(data, time, '#container')
