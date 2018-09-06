/*
function getFacebookData(value) {
  return value.Source == "Facebook";
}
function getTripAdvisorData(value) {
  return value.Source == "Tripadvisor";
}
*/

/* Get reviews for particular social */
function getSocialData(data_array, social) {
  // define filter callback
  function filterSocial(value) {
    return value.Source == social;
  }
  // apply filter on data array
  return data_array.filter(filterSocial);
}

/* Get reviews for particular year */
function getYearData(data_array, year) {
  // define filter callback
  function filterYear(value) {
    return value.rev_date.indexOf(year) > -1;
  }
  // apply filter on data array
  return data_array.filter(filterYear);
}

var getTraces = function ( rows ) {

  var FB_array = getSocialData(rows,'Facebook');
  var TA_array = getSocialData(rows,'Tripadvisor');

  var FB_dateArray = unpack(FB_array, 'rev_date');
  var TA_dateArray = unpack(TA_array, 'rev_date');

  function unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
  }

  switch (aggregate) {
    case 'year':
        console.log('aggregating for year');
        FB_aggregateDateArray = FB_dateArray.map(function(date) { return date.split('-')[0]; });
        TA_aggregateDateArray = TA_dateArray.map(function(date) { return date.split('-')[0]; });
        tick_step = "M12";
      break;
    case 'month':
        console.log('aggregating for month');
        FB_aggregateDateArray = FB_dateArray.map(function(date) { return date.split('-')[0] + "-" + date.split('-')[1]; });
        TA_aggregateDateArray = TA_dateArray.map(function(date) { return date.split('-')[0] + "-" + date.split('-')[1]; });
        tick_step = "M1";
      break;
    default:
      console.log('not aggregating');
      FB_aggregateDateArray = FB_dateArray;
      TA_aggregateDateArray = TA_dateArray;
  }

  var FB_tick0 = FB_aggregateDateArray[0];
  var TA_tick0 = TA_aggregateDateArray[0];
  min_tick0 = ( new Date(FB_tick0) < new Date(TA_tick0) ) ? FB_tick0 : TA_tick0;

  /* count reviews for each X item */
  var FB_reviewNumberForTime = FB_aggregateDateArray.reduce(function (acc, curr) {
    if (typeof acc[curr] == 'undefined') {
      acc[curr] = 1;
    } else {
      acc[curr] += 1;
    }
    return acc;
  }, {});
  /* count reviews for each X item */
  var TA_reviewNumberForTime = TA_aggregateDateArray.reduce(function (acc, curr) {
    if (typeof acc[curr] == 'undefined') {
      acc[curr] = 1;
    } else {
      acc[curr] += 1;
    }
    return acc;
  }, {});

  console.log(FB_reviewNumberForTime);
  console.log(TA_reviewNumberForTime);


  // get the date array
  var FB_keys = Object.keys(FB_reviewNumberForTime);
  var TA_keys = Object.keys(TA_reviewNumberForTime);
  // get the numbers of reviews for each Date
  var FB_values = Object.values(FB_reviewNumberForTime);
  var TA_values = Object.values(TA_reviewNumberForTime);

  /*
  // sum number of reviews
  var y_values = [];
  values.reduce( function(totalCount, currentCount) {
    var sum = totalCount + currentCount;
      console.log(totalCount + ":" + currentCount);
      y_values.push( sum );
      return sum; // reducer function
    }, 0 // initial accumulator value
  );
  */

  var FB_trace = {
    type: "bar",
    name: 'Recensioni Facebook',
    source: 'source',
    x: FB_keys,
    y: FB_values
  }

  var TA_trace = {
    type: "bar",
    name: 'Recensioni Tripadvisor',
    source: 'source',
    x: TA_keys,
    y: TA_values
  }

  return traces_array = [ FB_trace, TA_trace ];

}
