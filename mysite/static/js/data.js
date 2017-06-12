/**
 * Created by Void on 4/12/2017.
 */

function createCharts(data){
    if(data == '' || data.length == 0){
        return;
    }
    var dict = {'tem1': 'xxx温度', 'tem2':'xxx温度', 'tem3':'xxx温度', 'tem4':'xxx温度', 'hum': '相对湿度', 'vis':'油液粘度'};
    var series = [{name:'1', data:[]}, {name:'2', data:[]}, {name:'3', data:[]}];
    for(var i = 0; i < data.length; i++){
        var temp = [];
        temp.push(data[i].times);
        temp.push(data[i].value);
        if(data[i].num == 1){
            series[0].data.push(temp);
        }else if(data[i].num == 2){
            series[1].data.push(temp);
        }
        else if(data[i].num == 3){
            series[2].data.push(temp);
        }
    }

   var chart = {
      type: 'spline'
   };
   var title = {
      text: '南京工程学院'
   };
   var subtitle = {
      text: '远程监控系统'
   };
   var xAxis = {
      type: 'datetime',
      dateTimeLabelFormats: { // don't display the dummy year
         month: '%e. %b',
         year: '%b'
      },
      title: {
         text: '时间'
      }
   };
   var yAxis = {
      title: {
         text: dict[$('form select[name=types]').val()]
      },
      min: 0
   };
   var tooltip = {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
   };
   var plotOptions = {
      spline: {
         marker: {
            enabled: true
         }
      }
   };

   var json = {};
   json.chart = chart;
   json.title = title;
   json.subtitle = subtitle;
   json.tooltip = tooltip;
   json.xAxis = xAxis;
   json.yAxis = yAxis;
   json.series = series;
   json.plotOptions = plotOptions;
   $('#container').highcharts(json);
}

$(document).ready(function () {
    $('form input[type=button]').click(function () {
        if($('form input[name=start]').val() == '' || $('form input[name=end]').val() == ''){
            alert('date can not be empty');
            return;
        }
        $.ajax({
            type : 'POST',
            data : $('form').serializeArray(),
            success: function (response, status, xhr) {
                createCharts(response);     //创建折线统计图
            }
        });
    });
});