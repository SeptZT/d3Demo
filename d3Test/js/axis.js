var svg_w = 500,  // svg的宽度
    svg_h = 400,  // svg的高度
    g_left = 50,  // 坐标系离svg的左边距
    g_top = 50, // 坐标系离svg的上边距
    g_w = svg_w - 2 * g_left, // 坐标系的宽度
    g_h = svg_h - 2 * g_top;  // 坐标系的高度
    
// 绘制svg    
var svg = d3.select('#container').append('svg')
  .style({
    width: svg_w,
    height: svg_h
  });  
  
// 横坐标
var scale_x = d3.scale.linear()
  .domain([0, 10])
  .range([0, g_w]);
var axis_x = d3.svg.axis().scale(scale_x);

/*// 坐标轴的其他参数
var axis_x = d3.svg.axis().scale(scale_x)
  .ticks(8) // 分成5等分
  .tickSubdivide(4) // 每个大刻度之间再画4个等分刻度
  .tickPadding(10)  // 刻度值与坐标轴之间的距离
  .tickFormat(function(v) { // 格式化刻度值
    return v + '天';
  });*/
 
svg.append('g')
  .call(axis_x)
  .classed('axis_x', true)
  .style({
    strokeWidth: '1',
    stroke: '#aaa',
    fill: 'none',
    transform: 'translate('+g_left+'px, '+(g_h+g_top)+'px)'
  });
 


  

// 纵坐标
var scale_y = d3.scale.linear()
  .domain([0, 10])
  .range([g_h, 0]);
var axis_y = d3.svg.axis().scale(scale_y).orient('left').ticks(5);

svg.append('g')
  .call(axis_y)
  .classed('axis_y', true)
  .style({
    strokeWidth: '1',
    stroke: '#aaa',
    fill: 'none',
    transform: 'translate('+g_left+'px, '+g_top+'px)'
  })
  .append('text')
  .text('价格（元）')
  .style({
    'transform': 'rotate(-90deg)',
    'text-anchor': 'end'
  })
  .attr('dy', '1em');



d3.selectAll('g.axis_x g.tick')
  .append('line')
  .attr({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: -g_h
  })

d3.selectAll('g.axis_y g.tick')
  .append('line')
  .attr({
    x1: 0,
    y1: 0,
    x2: g_w,
    y2: 0
  })
