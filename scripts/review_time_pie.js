var PIE_CHART_DIV = 'pie_chart';
var PiePlot = document.getElementById(PIE_CHART_DIV);

var csvFile = "./csv/social_time_chart.csv" + "?" + Math.floor(Date.now());
Plotly.d3.csv(csvFile, function(err, rows) {

  // check if another script already prepared needed arrays
  if ( ! socials_array )
    getSocialArrays( rows );

  //getSocialArrays( getMonthData(rows,'01') );  

  /* associate colors */
  var piecolors = allSocials.map( social => social_colors[social] );

  var data = [{
    values: socials_array.map( items => items.length ),
    labels: allSocials,
    type: 'pie',
    marker: {
      colors: piecolors
    }
  }]

  var layout = {
    title: 'Numero di recensioni per sorgente',
    barmode: 'stack',
    legend: {"orientation": "h"},
    margin: custom_margin
  };

  Plotly.newPlot(PIE_CHART_DIV, data, layout);

  /**
   *  Define events

  PiePlot.on('plotly_hover', function(data){
    var pts = [];
    for(var i=0; i < data.points.length; i++) {
        pts[i] = 'x = '+data.points[i].x +'\ny = '+
            data.points[i].y.toPrecision(4) + '\n\n';
    }
    document.getElementById('chart1').innerHTML = 'data.points.length: ' + data.points.length + " | " + pts[0];
    aggregate = 'month';
    var PIE_CHART_DIV = aggregate + '_chart';
    var PiePlot = document.getElementById(PIE_CHART_DIV);

    var data_update = getTraces(getYearData(rows,data.points[0].x));
    var layout_update = {
      title: 'Numero recensioni per l\'anno ' + data.points[0].x + '',
      barmode: 'stack',
      legend: {"orientation": "h"},
      margin: custom_margin,
      xaxis: {
        tick0: min_tick0,
        dtick: tick_step
      }
    };

    Plotly.react(PiePlot, data_update, layout_update)
  });
**/
  window.onresize = function() {
    $('.chart').each( function(index,value) {
      Plotly.Plots.resize(value);
    });
  };

})
