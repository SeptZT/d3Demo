function pointData(x_len, y_len, r) {
  var data = [],
      rx = 0, // 六边形中心点x坐标
      ry = 0, // 六边形中心点y坐标
      r0 = 0, // 六边形x方向平移
      r2 = r/2,
      r3 = Math.sqrt(3) / 2 * r;
      
  for(var j=0; j<y_len; j++) {
    ry = Math.sqrt(3)/2*(j+1)*r; 
    if (j % 2) {
      r0 = 1.5 * r;
    } else {
      r0 = 3 * r;
    }
    
    for(var i=0; i<x_len; i++) {      
      rx = 3 * r * i + r0;
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
}