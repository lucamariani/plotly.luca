Plotly.d3.csv("/time_chart.csv", function(err, rows) {

  function unpack(rows, key) {
    return rows.map(function(row) {
      return row[key];
    });
  }


  var trace1 = {
    type: "scatter",
    mode: "markers",
    name: 'Stars',
    x: unpack(rows, 'rev_date'),
    y: unpack(rows, 'rev_stars'),
    line: {color: '#17BECF'}
  }

  var data = [trace1];

  var layout = {
    title: 'Time Series with Rangeslider',
    xaxis: {
      autorange: true,
      range: ['2015-03-01', '2018-12-31'],
      rangeselector: {buttons: [
          {
            count: 1,
            label: '1m',
            step: 'month',
            stepmode: 'backward'
          },
          {
            count: 6,
            label: '6m',
            step: 'month',
            stepmode: 'backward'
          },
          {step: 'all'}
        ]},
      rangeslider: {range: ['2015-03-01', '2018-12-31']},
      type: 'rev_date'
    },
    yaxis: {
      autorange: true,
      range: [0,5],
      size: 'x',
      type: 'linear'
    }
  };

  Plotly.newPlot('chart1', data, layout, {displayModeBar: true});
})
