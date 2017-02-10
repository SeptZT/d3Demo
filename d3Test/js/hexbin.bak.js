var hexbin = {
  svg: null,
  data: [],
  opts: {},
  group: {
    index: null,  // 选区中心点 索引
    i: null,  // 选区中心点在第i行
    j: null,  // 选区中心点在第j行
    itemIndex: [],
    arrIndex: [],
    xyItem: [],
    otherIndex: [],
  },
  init: function(r) {
    if (!r){ 
      r = 30;
    }
    this.opts = {
      'r': r,
      'x_len': parseInt(document.getElementById('container').clientWidth / (r*3)),
      'y_len': document.getElementById('container').clientHeight / (r*Math.sqrt(3)/2)
    }
   
    this.svg = d3.select('#container').append('svg')
      .attr('width', '100%')
      .attr('height', '100%');      

    this.data = this.pointData();
    this.colorHtml();  
    this.getCenterIndex();    
    this.drawBg();
    this.getLine();
    this.getLeftLine();

  },
  
  // 绘制背景
  drawBg: function() {
    var line_generator = d3.svg.line()
      .x(function(d, i) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      });
      
    var num = 0,
        len = this.data.length,
        gp = this.group;

    for (var i=0; i<len; i++) {
      var gg = this.svg.append('g');
      if (gp.index == i) {        
        gg.data(gp.xyItem).append('path')
          .attr('d', line_generator(gp.xyItem))
          .classed('group', true);
      } else if (gp.index != i && gp.arrIndex.indexOf(i) == -1) {
        var item = this.data[i].pointAxis;
        
        gg.data(item).append('path')
          .attr('d', line_generator(item));
        
        if (gp.otherIndex.indexOf(i) == -1) {
          gg.classed('default', true);
        } else {
          gg.classed('group', true)
            .append('text')
            .attr({              
              'x': this.data[i]['rx'],
              'y': this.data[i]['ry']
            })
            .text(num);
            num++;
        }
      }  
    }
  },
  
  // 获取选中区块的中心索引
  getCenterIndex: function(){
    var status = 1,
        x_len = this.opts.x_len,
        y_len = this.opts.y_len;
        
    while (status == 1) {
      var index = this.getRandom(x_len * y_len),
          i = this.data[index]['i'],
          j = this.data[index]['j'];

      if (i > 1 && i < y_len - 2 && j > 1 && j < x_len - 2){
        status = 0;
        this.group.index = index;
        this.group.i = i;
        this.group.j = j;
      }
    }
    
    this.getCenterAxis();  // 获取选区坐标
    this.getBlockIndex();  // 获取5个 分散小块的索引    
  },
  
  // 获取选区坐标
  getCenterAxis: function() {
    var n = this.group.index,
        arrIndex = [],
        xyItem = [],
        arr = [
          [0,1,2],
          [1,2,3],
          [2,3,4],
          [3,4,5],
          [4,5,0],
          [5,0,1]
        ],
        x_len = this.opts.x_len;
    if (this.group.i % 2) {  // 奇数行
      arrIndex = [n-x_len, n-2*x_len, n-x_len+1, n+x_len+1, n+2*x_len, n+x_len];
    } else {  // 偶数行
      arrIndex = [n-x_len-1, n-2*x_len, n-x_len, n+x_len, n+2*x_len, n+x_len-1];
    }
    
    // 生成选区坐标
    for (var i=0; i<6; i++){
      var asix = this.data[arrIndex[i]]['pointAxis'];
      if (i==0) {
        xyItem.push({'x': asix[5]['x'], 'y': asix[5]['y']});
      }
      for (var j=0; j<3; j++) {
        xyItem.push({'x': asix[arr[i][j]]['x'], 'y': asix[arr[i][j]]['y']});
      }      
    }  
    this.group.xyItem = xyItem;  
    this.group.arrIndex = arrIndex;
  },
  
  // 获取6个 分散小块的索引
  getBlockIndex: function() {
    var num = 0,
        gp = this.group;
        
    while (num != 6) {
      var index_i = this.getRandom(4) - 2,  // 取-2到2之间的随机数
          index_j = this.getRandom(4) - 2,
          x_len = this.opts.x_len,
          index = gp.index+x_len*index_i+index_j;
          
      if (gp.arrIndex.indexOf(index) != -1 || gp.otherIndex.indexOf(index) != -1 
          || index < 0 || index > this.data.length || index == gp.index) {
        continue;
      }
      gp.otherIndex.push(index);
      num++;      
    }
  },
  
  // 中心区块与边缘的连线
  getLine: function() {
    // 生成2个随机数, 代表选中的偶数行
    var ylen_half = this.opts.y_len / 2,
        row_left_n = this.getRandom(ylen_half) * 2,
        row_right_n = this.getRandom(ylen_half) * 2;

    var nleft = row_left_n*this.opts.x_len;

    var arr = [this.data[nleft].pointAxis[4],this.data[nleft].pointAxis[3]];
    var line_generator = d3.svg.line()
      .x(function(d, i) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      });

    
  },
  
  // 获取左侧连线
  getLeftLine: function() {
    var row_left_n = 4,
        center = 2,
        data = this.data,
        nleft = row_left_n * this.opts.x_len;
    var line_generator = d3.svg.line()
      .x(function(d, i) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      });
      
    var arr_left = [data[nleft].pointAxis[4], data[nleft].pointAxis[3]];
    
    this.svg.append('g').data(arr_left).append('path')
          .attr('d', line_generator(arr_left))
          .style({
            'stroke': 'red',
            'stroke-width': 3,
            'fill': 'red'
          });
  },
  
  // 获取0到num之间的随机数
  getRandom: function(num) {
    return parseInt(Math.random() * num);
  },
  
  // 颜色渐变
  colorHtml: function(){
    var html = '<defs>'+
      '<radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">'+
        '<stop offset="40%" style="stop-color:#000;" />'+   
        '<stop offset="60%" style="stop-color:#05202F;" />'+
        '<stop offset="100%" style="stop-color:#177FA4;" />'+
      '</radialGradient>'+
      '<radialGradient id="gradhover" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">'+
        '<stop offset="20%" style="stop-color:#000;" />'+   
        '<stop offset="50%" style="stop-color:#1F3943;" />'+
        '<stop offset="100%" style="stop-color:#1DCADF;" />'+
      '</radialGradient>'+
      '<radialGradient id="group" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">'+
        '<stop offset="50%" style="stop-color:#B29A20;" />'+   
        '<stop offset="70%" style="stop-color:#99872C;" />'+
        '<stop offset="100%" style="stop-color: #695C26;" />'+      
    '</defs>';
    this.svg.append('g').html(html);
  },
  
  // 六边形中心点坐标
  pointData: function() {
    var data = [],
      x_len = this.opts.x_len,
      y_len = this.opts.y_len,
      r = this.opts.r,
      rx = 0, // 六边形中心点x坐标
      ry = 0, // 六边形中心点y坐标
      r0 = 0, // 六边形x方向平移
      r2 = r/2,
      r3 = Math.sqrt(3) / 2 * r;
      
    for(var i=0; i<y_len; i++) {
      ry = Math.sqrt(3)/2*(i+1)*r; 
      if (i % 2) {  // 奇数行
        r0 = 3 * r;
      } else {  // 偶数行
        r0 = 1.5 * r;
      }
      
      for(var j=0; j<x_len; j++) {      
        rx = 3 * r * j + r0;
        // 六边形六个点坐标
        var point = [
          {'x': rx-r, 'y': ry},
          {'x': rx-r2, 'y': ry-r3},
          {'x': rx+r2, 'y': ry-r3},
          {'x': rx+r, 'y': ry},
          {'x': rx+r2, 'y': ry+r3},
          {'x': rx-r2, 'y': ry+r3},
          {'x': rx-r, 'y': ry}
        ];
    
        var item = {
          'i': i,
          'j': j,
          'rx': rx,
          'ry': ry,
          'pointAxis': point
        }
        data.push(item);
      }
    }
    return data;  
  },
}


hexbin.init();