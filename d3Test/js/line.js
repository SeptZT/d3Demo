var svg_h = 500,
    svg_w = 600,
    g_left = 50,
    g_top = 20,
    g_h = svg_h - 2 * g_top,
    g_w = svg_w - 2 * g_left;

var svg = d3.select('#container')
  .append('svg')
  .attr({
    'height': svg_h,
    'width': svg_w
  });

var g = svg.append('g')
  .style({
    'transform': 'translate('+ g_left +'px, '+ g_top +'px)',
    'stroke': 'rgba(206, 113, 178, 0.46)',
    'fill': 'none',
    'stroke-width': '2'
  });
  
var data1 = [820, 932, 901, 934, 1290, 1330, 1320];
var data2 = [320, 332, 301, 334, 390, 330, 320];
var data3 = [150, 232, 201, 154, 190, 330, 410];
var scale_x = d3.scale.linear()
  .domain([0, 7])
  .range([0, g_w]);
var scale_y = d3.scale.linear()
  .domain([0, 1330])
  .range([g_h, 0]);
var line = d3.svg.line()
  .x(function(d, i) {
    return scale_x(i);
  })
  .y(function(d) {
    return scale_y(d);
  })
//.interpolate('cardinal');

var axis_x = d3.svg.axis().scale(scale_x);
var axis_y = d3.svg.axis().scale(scale_y).orient('left');



g.append('g')
  .call(axis_x)
  .style({
    'stroke-width': '1',
    'stroke': '#aaa',
    'transform': 'translate(0, '+g_h+'px)'
  });
  
var y = g.append('g')
  .call(axis_y)
  .style({
    'stroke-width': '1',
    'stroke': '#aaa'
  });


svg.select('g')
  .append('path')
  .attr('d', line(data1));
  
svg.select('g')
  .append('path')
  .attr('d', line(data2))
  .style('stroke', '#90cc96');
  
svg.select('g')
  .append('path')
  .attr('d', line(data3))
  .style('stroke', 'rgb(85, 203, 214)');
  

