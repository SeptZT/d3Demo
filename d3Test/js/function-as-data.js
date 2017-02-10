var data = [];

var next = function(x) {
  return 15 + x * x;
}

var newData = function() {
  data.push(next);
  return data;
}


function render() {
  var selection = d3.select('#container')
  .selectAll('div')
  .data(newData);
  
  selection.enter().append('div').append('span');
  
  selection.exit().remove();
  
  selection.attr('class', 'v-bar')
  .style('height', function(d, i) {
    return d(i) + 'px';
  })
  .select('span')
  .text(function(d, i) {
    return d(i);
  })
}

/*setInterval(function() {
  data.shift();
  render();
}, 1500);*/

render();
render();
render();
