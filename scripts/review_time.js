var aggregate = 'year';

Plotly.d3.csv("/social_time_chart.csv", function(err, rows){

  var dateArray = unpack(rows, 'rev_date');
  console.log('dateArray: ' + dateArray);

  function unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
  }

  switch (aggregate) {
    case 'year':
        console.log('aggregating for year');
        aggregateDateArray = dateArray.map(function(date) { return date.split('-')[0] + "-12"; });
      break;
    case 'month':
        console.log('aggregating for month');
        aggregateDateArray = dateArray.map(function(date) { return date.split('-')[0] + "-" + date.split('-')[1]; });
      break;
    default:
      console.log('not aggregating');
      aggregateDateArray = dateArray;
  }
  console.log('aggregateDateArray: ' + aggregateDateArray);

  /* count review for each X item */
  var reviewNumberForTime = aggregateDateArray.reduce(function (acc, curr) {
    if (typeof acc[curr] == 'undefined') {
      acc[curr] = 1;
    } else {
      acc[curr] += 1;
    }
    return acc;
  }, {});

  console.log(reviewNumberForTime);
  // get the date array
  var keys = Object.keys(reviewNumberForTime);
  // get the numbers of reviews for each Date
  var values = Object.values(reviewNumberForTime);
  // sum number of reviews
  var y_values = [];
  values.reduce( function(totalCount, currentCount) {
    var sum = totalCount + currentCount;
      console.log(totalCount + ":" + currentCount);
      y_values.push( sum );
      return sum; // reducer function
    }, 0 // initial accumulator value
  );

  console.log('y_values');
  console.log(y_values);

  var trace1 = {
    type: "scatter",
    fill: 'tozeroy',
    name: '# Recensioni',
    source: 'source',
    x: keys,
    y: y_values,
    line: {color: '#AB47BC'}
  }
/*
  var trace1 = {
    type: "scatter",
    fill: 'tozeroy',
    name: '# Recensioni',
    source: 'source',
    x: keys,
    y: y_values,
    line: {color: '#AB47BC'},
    transforms: [{
      type: 'aggregate',
      groups: subject,
      aggregations: [
        {target: 'y', func: 'avg', enabled: true},
      ]
    }]
  }
*/
  var data = [trace1];

  var layout = {
    title: '# Recensioni nel tempo',
    xaxis: {
      autorange: true,
      range: [ keys[0], keys[keys.length - 1] ],
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
      rangeslider: {range: [ keys[0], keys[keys.length - 1] ]},
      type: 'rev_date'
    },
    yaxis: {
      autorange: true,
      type: 'linear'
    }
  };

  Plotly.newPlot('review_time', data, layout);
})
