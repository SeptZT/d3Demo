var hexbin = {
  svg: null,
  data: [],
  opts: {},
  line_generator: null,
  line_point: [],
  group: {
    i: null,  // 选区中心点在第i行
    j: null,  // 选区中心点在第j列
    xyItem: [], // 中心选区每个点的坐标
    otherIndex: [], // 四周6个小区块的x、y坐标索引
  },
  init: function(r) {
    if (!r){ 
      r = 30;
    }
    this.opts = {
      'r': r,
      'x_len': parseInt(document.getElementById('container').clientWidth / (r*3)),
      'y_len': parseInt(document.getElementById('container').clientHeight / (r*Math.sqrt(3)/2))
    }
   
    this.line_generator = d3.svg.line()
      .x(function(d, i) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      });
    this.svg = d3.select('#container').append('svg')
      .attr('width', '100%')
      .attr('height', '100%');      
    
    this.pointData(); // 每个小六边形中心点坐标、四周边的坐标、横纵坐标索引
    this.colorHtml(); // 渐变色
    this.getCenterIndex();  // 选区的坐标 
    this.drawBg();  // 绘制背景    
    this.drawBlock(); // 绘制中心大区块和左右连线
    this.drawLine(); // 绘制连线
  },
  
  // 绘制背景
  drawBg: function() {
    var num = 0,
        len1 = this.data.length,
        len2 = this.data[0].length,
        gp = this.group;
        
    for (var i=0; i<len1; i++) {
      for (var j=0; j<len2; j++) {
        
        var gg = this.svg.append('g');
        var item = this.data[i][j].pointAxis;
        
        gg.data(item).append('path')
          .attr('d', this.line_generator(item));
        var res = this.isExist(gp.otherIndex, {i: i, j: j});
        
        if (!res) {
          gg.classed('default', true);
        } else {
          gg.classed('group', true)
            .append('text')
            .attr({              
              'x': this.data[i][j]['rx'],
              'y': this.data[i][j]['ry']
            })
            .text(num);
            num++;
        }
      }
    }    
  },
  
  // 绘制中心大区块
  drawBlock: function() {
    this.svg.append('g').data(this.group.xyItem).append('path')
            .attr('d', this.line_generator(this.group.xyItem))
            .classed('group', true);    
  },
  
  // 绘制连线
  drawLine: function() {
    var start_left = {i: this.getRandom(this.opts.y_len / 2-1) * 2, j: 0},  // 获取左边 线条起点（随机的偶数行第0个）
        start_right = {i: this.getRandom(this.opts.y_len / 2-1) * 2, j: this.opts.x_len-1},   // 获取右边 线条起点（随机的偶数行第0个）
        end = {i: this.group.i, j: this.group.j};  // 连线终点坐标索引
    this.getLine(start_left, end, '#FF0000');  // 绘制左连线
    this.getLine(end, start_right, '#11A3F1');  // 绘制右连线
  },
  
  // 获取选中区块的行、列
  getCenterIndex: function(){
    var i_status = 1,
        j_status = 1,
        x_len = this.opts.x_len,
        y_len = this.opts.y_len;
    
    // 获取中心块的行
    while (i_status == 1) {
      var i = this.getRandom(y_len);

      if (i > 1 && i < y_len - 3){
        i_status = 0;
        this.group.i = i;
      }
    }
    
    // 获取中心块的列
    while (j_status == 1) {
      var j = this.getRandom(x_len);

      if (j > 1 && j < x_len - 2){
        j_status = 0;
        this.group.j = j;
      }
    }
    
    this.getCenterAxis();  // 获取选区坐标
  },
  
  // 获取选区坐标
  getCenterAxis: function() {
    var x = this.group.i,
        y = this.group.j,
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
      arrIndex = [{i: x-1, j: y}, {i: x-2, j: y}, {i: x-1, j: y+1}, 
                  {i: x+1, j: y+1}, {i: x+2, j: y}, {i: x+1, j: y}];
    } else {  // 偶数行
      arrIndex = [{i: x-1, j: y-1}, {i: x-2, j: y}, {i: x-1, j: y}, 
                  {i: x+1, j: y}, {i: x+2, j: y}, {i: x+1, j: y-1}];
    }
    
    // 生成选区坐标
    for (var n=0; n<6; n++){
      var index = arrIndex[n];
      var asix = this.data[index['i']][index['j']]['pointAxis'];
      if (n==0) {
        xyItem.push({'x': asix[5]['x'], 'y': asix[5]['y']});
      }
      for (var m=0; m<3; m++) {
        xyItem.push({'x': asix[arr[n][m]]['x'], 'y': asix[arr[n][m]]['y']});
      }      
    } 

    this.group.xyItem = xyItem;  
    
    this.getBlockIndex(arrIndex);  // 获取5个 分散小块的索引    
    
  },
  
  // 获取6个 分散小块的索引
  getBlockIndex: function(arrIndex) {
    var num = 0,
        gp = this.group,
        arr = [].concat(arrIndex);
        
    while (num != 6) {
      var index_i = this.getRandom(4) - 2,  // 取-2到2之间的随机数
          index_j = this.getRandom(4) - 2,
          target = {i: gp.i + index_i, j: gp.j + index_j};
          
      if (index_i < 0 || index_i > this.opts.y_len || index_j < 0 || index_j > this.opts.x_len) {
        var res = this.isExist(arr, target);
        if (!res) {
          num++;
          arr.push(target);
          gp.otherIndex.push(target);
        }       
      }            
    }
  },
  
  // 获取左侧连线
  getLine: function(start, target, color) {
    this.line_point = []; // 线条坐标数组
    
    if (start.i < target.i) {
      this.lineToBottom(start, target);
    } else {     
      this.lineToTop(start, target);
    }
    var _this = this;
    this.svg.append('g').data(this.line_point).append('path')
          .attr('d', this.line_generator(_this.line_point))
          .style({
            'stroke': color,
            'stroke-width': 3,
            'fill': 'none'
          });
  },
  
  lineToTop: function(start, target) {
    var now = {i: start.i, j: start.j}, // 线条绘制坐标索引
        data = this.data;
    // 线向上
    while (now.i > target.i && now.j < target.j) {
      this.pushLinePoint(now.i, now.j, [4, 3]);
      now.i -= 1 ;
      if (now.i % 2 == 0) { // 偶数行
        now.j += 1;
      }
    }
    
    if (now.i > target.i) {
      while (now.i > target.i) {
        this.pushLinePoint(now.i, now.j, [0, 1]);
        now.i -= 2 ;        
      }      
    } else if (now.j < target.j) {
      var tmp = 1;
      while (now.j < target.j) {
        if (tmp == 1) {
          tmp = 0;
          this.pushLinePoint(now.i, now.j, [5, 4, 3]);
        } else {
          this.pushLinePoint(now.i, now.j, [0, 5, 4, 3]);
        }        
        now.j += 1;        
      }
    }   
  },
  
  lineToBottom: function(start, target) {
    var now = {i: start.i, j: start.j}, // 线条绘制坐标索引
        line_data = this.line_point;
        data = this.data;
    
    // 线向下
    while (now.i < target.i && now.j < target.j) {    
      this.pushLinePoint(now.i, now.j, [2, 3]);
      now.i += 1 ;
      if (now.i % 2 == 0) { // 偶数行
        now.j += 1;
      }
    }
    
    if (now.i < target.i) {
      while (now.i < target.i) {
        this.pushLinePoint(now.i, now.j, [0, 5]);
        now.i += 2 ;        
      }      
    } else if (now.j < target.j) {
      var tmp = 1;
      while (now.j < target.j) {
        if (tmp == 1) {
          tmp = 0;
          this.pushLinePoint(now.i, now.j, [1, 2, 3]);
        } else {
          this.pushLinePoint(now.i, now.j, [0, 1, 2, 3]);
        }
        
        now.j += 1;        
      }
    }       
  },
  
  // 连线坐标
  pushLinePoint: function(n, m, arr) {
    var center_point = this.data[this.group.i][this.group.j].pointAxis, // 中心区块的坐标
        point = this.data[n][m].pointAxis,
        len = arr.length;
    for (var i=0; i<len; i++) {
      if (!this.isExist(center_point, point[arr[i]])) {
        this.line_point.push(point[arr[i]]);
      } else {
        break;
      }
    }
  },
  
  // 判断point对象是否在data中存在
  isExist: function(data, item) {
    var res = data.find(function (v) {
      if (JSON.stringify(v) === JSON.stringify(item)) return true;
    });
    return res;
  },
  
  // 获取0到num之间的随机数, status对随机数小数部分的处理，可选参数(floor: 向下取整， ceil：向上取整， round: 四舍五入（默认）)
  getRandom: function(num, status) {
    if (!status) {
      status = 'round'; // 四舍五入
    }
    return Math[status](Math.random() * num);
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
  
  // 每个小六边形中心点坐标、四周边的坐标、横纵坐标索引
  pointData: function() {
    var data = [],
      x_len = this.opts.x_len,
      y_len = this.opts.y_len,
      r = this.opts.r,
      rx = 0, // 六边形中心点x坐标
      ry = 0, // 六边形中心点y坐标
      r0 = 0, // 六边形x方向平移
      sign3_2 = (Math.sqrt(3) / 2).toFixed(3),  // 二分之根号三，四舍五入保留三位小数
      r2 = r/2,      
      r3 = sign3_2 * r;

    for(var i=0; i<y_len; i++) {
      ry = sign3_2*(i+1)*r; 
      if (i % 2) {  // 奇数行
        r0 = 3 * r;
      } else {  // 偶数行
        r0 = 1.5 * r;
      }
      data.push([]);
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
        data[i].push(item);
      }
    }
    
    this.data = data;  
  },
}

hexbin.init();