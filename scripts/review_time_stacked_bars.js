var aggregate = 'year',
  min_tick0, // the oldest date
  tick_step; // the date step in months

var CHART_DIV = aggregate + '_chart';
var myPlot = document.getElementById(CHART_DIV);

var csvFile = "./csv/social_time_chart.csv" + "?" + Math.floor(Date.now());
Plotly.d3.csv(csvFile, function(err, rows){

  var data = getTraces(rows);

  var layout = {
    title: 'Numero di Recensioni',
    barmode: 'stack',
    xaxis: {
      autorange: true,
      tickmode: 'linear',
      tick0: min_tick0,
      dtick: tick_step,
      rangeselector: {buttons: [
          {
            count: 6,
            label: '6m',
            step: 'month',
            stepmode: 'backward'
          },
          {
            count: 12,
            label: '12m',
            step: 'month',
            stepmode: 'backward'
          },
          {
            count: 24,
            label: '24m',
            step: 'month',
            stepmode: 'backward'
          },
          {step: 'all'}
        ]},
      //rangeslider: {range: [ FB_aggregateDateArray[0], FB_aggregateDateArray[FB_aggregateDateArray.length - 1] ]},
      type: 'rev_date'
    },
    yaxis: {
      autorange: true,
      type: 'linear'
    }
  };

  Plotly.newPlot(CHART_DIV, data, layout);

  /**
   *  Define events
  **/
  myPlot.on('plotly_hover', function(data){
    var pts = [];
    for(var i=0; i < data.points.length; i++) {
        pts[i] = 'x = '+data.points[i].x +'\ny = '+
            data.points[i].y.toPrecision(4) + '\n\n';
    }
    document.getElementById('chart1').innerHTML = 'data.points.length: ' + data.points.length + " | " + pts[0];
    aggregate = 'month';
    var CHART_DIV = aggregate + '_chart';
    var myPlot = document.getElementById(CHART_DIV);

    var data_update = getTraces(getYearData(rows,data.points[0].x));
    var layout_update = {
      title: 'Numero recensioni per l\'anno ' + data.points[0].x + '',
      barmode: 'stack',
      xaxis: {
        tick0: min_tick0,
        dtick: tick_step
      }
    };

    Plotly.react(myPlot, data_update, layout_update)
  });
})
