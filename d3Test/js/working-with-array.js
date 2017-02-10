var arr = [3, 2, 11, 7, 6, 4, 10, 8, 15, 7, 12];

d3.select('#container').append('p').html('最小值：' + d3.min(arr));
d3.select('#container').append('p').text('最大值：' + d3.max(arr));
d3.select('#container').append('p').text('最小、最大值：' + d3.extent(arr));
d3.select('#container').append('p').text('和：' + d3.sum(arr));
d3.select('#container').append('p').text('中位数：' + d3.median(arr));
d3.select('#container').append('p').text('平均数：' + d3.mean(arr));
d3.select('#container').append('p').text('升排：' + arr.sort(d3.ascending));
d3.select('#container').append('p').text('降排：' + arr.sort(d3.descending));
d3.select('#container').append('p').text('分位数：' + d3.quantile(arr.sort(d3.ascending), 0.25));
/* d3.bisect()通过二分法获取某个数在排好序的数组中的插入位置，插入点左边的元素小于指定的元素；插入点右边的元素均大于等于指定的元素 */
d3.select('#container').append('p').text('插入点：' + d3.bisect(arr.sort(d3.ascending), 6));
d3.select('#container').append('p').text('插入点（相等的值归入右边）：' + d3.bisectRight(arr.sort(d3.ascending), 6));
d3.select('#container').append('p').text('插入点归（相等的值归入左边）：' + d3.bisectLeft(arr.sort(d3.ascending), 6));


var records = [
{quantity: 2, total: 190, tip: 100, type: 'tab'},
{quantity: 2, total: 190, tip: 100, type: 'tab'},
{quantity: 1, total: 300, tip: 100, type: 'visa'},
{quantity: 2, total: 90, tip: 0, type: 'tab'},
{quantity: 2, total: 90, tip: 0, type: 'tab'},
{quantity: 2, total: 90, tip: 0, type: 'tab'},
{quantity: 1, total: 100, tip: 0, type: 'cash'},
{quantity: 2, total: 200, tip: 0, type: 'tab'}
];

var nest = d3.nest().key(function(d) {
  return d.type;
})
.key(function(d) {
  return d.tip;
})
.entries(records);

console.log(nest);
d3.select('#container').append('div').html(printNest(nest, ''));

function printNest(nest, out, i) {
  if (i === undefined) {
    i = 0;
  }
  var tab = '';
  for (var j=0; j<i; ++j) {
    tab += ' ';
  }
  nest.forEach(function(e) {
    if (e.key) {
      out += tab + e.key + '<br>';
    } else {
      out += tab + printObject(e) + '<br>';
    }
    
    if (e.values) {
      out += printNest(e.values, out, ++i);
    } else {
      return out;
    }
  });
  return out;
}

function printObject(obj) {
  var s = '{';
  for (var f in obj) {
    s += f + ': ' + obj[f] + ', ';
  }
  s += '}';
  return s;
}
