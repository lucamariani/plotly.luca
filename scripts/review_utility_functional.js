var allSocialsEntry, allSocials, socials_array;


/*** LAYOUT SETTINGS ***/
/* define social colors */
var social_colors = {
  Facebook: '#4867AA',
  Tripadvisor: '#8DC45F',
  Google: '#EA4235'
}

/* define custom margins */
var custom_margin = { l: 30, r: 30, b: 100, t: 100, pad: 4 }

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

/*
 * Get reviews for particular month
 * x es. get Juanuary's reviews for all years
 */
function getMonthData(data_array, month) {
  // define filter callback
  function filterMonth(value) {
    return value.rev_date.indexOf('-' + month + '-') > -1;
  }
  // apply filter on data array
  return data_array.filter(filterMonth);
}

var getSocialArrays = function ( rows ) {
  /**
   get all the values in column "Source":
    allSocialsEntry = ["Facebook","Facebook","Tripadvisor","Facebook","Google",...]
   **/
  allSocialsEntry = rows.map(row => row.Source);

  /**
   remove duplicates from allSocialsEntry
    allSocials = ["Facebook","Tripadvisor","Google"]
   **/
  allSocials = allSocialsEntry.reduce( function(acc,curr) {
     if ( ! acc.includes(curr) ) acc.push(curr);
     return acc;
   }, []);

  console.log('socials:');
  console.log(allSocials);

  /**
   create array of singles social data:
    x es.
      socials_array[0]: getSocialData(rows,'Facebook') //facebook reviews array
      socials_array[1]: getSocialData(rows,'Tripadvisor') //tripadvisr reviews array
      socials_array[2]: getSocialData(rows,'Google') //google reviews array
      ...
   **/
  socials_array = allSocials.map( social => getSocialData(rows,social));
  console.log('socials_array');
  console.log(socials_array);
}

/**
 * Prepare data array for stacked bar chart
**/
var getTraces = function ( rows ) {

  getSocialArrays(rows);

  /**
   for each singles social data gets the reviews Date array:
    socials_date_array[i] = unpack(socials_array[i], 'rev_date')
   **/
  var socials_date_array = socials_array.map( social_array => unpack(social_array, 'rev_date'));
  console.log('socials_date_array');
  console.log(socials_date_array);
/*
  var FB_dateArray = unpack(FB_array, 'rev_date');
  var TA_dateArray = unpack(TA_array, 'rev_date');
*/

  function unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
  }

  switch (aggregate) {
    case 'year':
        console.log('aggregating for year');
        /*
        FB_aggregateDateArray = FB_dateArray.map(function(date) { return date.split('-')[0]; });
        TA_aggregateDateArray = TA_dateArray.map(function(date) { return date.split('-')[0]; });
        */
        socials_aggregate_date_array = socials_date_array.map(
          date_array => date_array.map(
            date => date.split('-')[0]
          )
        );
        console.log(socials_aggregate_date_array);
        tick_step = "M12";
      break;
    case 'month':
        console.log('aggregating for month');
        /*
        FB_aggregateDateArray = FB_dateArray.map(function(date) { return date.split('-')[0] + "-" + date.split('-')[1]; });
        TA_aggregateDateArray = TA_dateArray.map(function(date) { return date.split('-')[0] + "-" + date.split('-')[1]; });
        */
        socials_aggregate_date_array = socials_date_array.map(
          date_array => date_array.map(
            date => date.split('-')[0] + "-" + date.split('-')[1]
          )
        );
        console.log(socials_aggregate_date_array);
        tick_step = "M1";
      break;
    default:
      console.log('not aggregating');
      socials_aggregate_date_array = socials_date_array;
  }

  /*
  var FB_tick0 = FB_aggregateDateArray[0];
  var TA_tick0 = TA_aggregateDateArray[0];
  min_tick0 = ( new Date(FB_tick0) < new Date(TA_tick0) ) ? FB_tick0 : TA_tick0;
  */

  // get the oldest review date (min_tick0)
  var oldest_date_for_social = socials_aggregate_date_array.map( date_array => date_array[0] );

  min_tick0 = oldest_date_for_social.reduce( function(acc,curr) {
    var lowest = ( new Date(acc) < new Date(curr) ) ? acc : curr;
    return lowest;
  });

  console.log("min_tick0: " + min_tick0);

  /* for every social counts how many reviews for each X item ( x = month or year) */
  var socials_reviewNumberForTime = socials_aggregate_date_array.map(
    date_array => date_array.reduce(function (acc, curr) {
      if (typeof acc[curr] == 'undefined') {
        acc[curr] = 1;
      } else {
        acc[curr] += 1;
      }
      return acc;
    }, {})
  );
  console.log('socials_reviewNumberForTime');
  console.log(socials_reviewNumberForTime);


  // get the date array
  /*
  var FB_keys = Object.keys(FB_reviewNumberForTime);
  var TA_keys = Object.keys(TA_reviewNumberForTime);
  */
  var socials_keys = socials_reviewNumberForTime.map( counts => Object.keys(counts) );
  console.log('socials_keys');
  console.log(socials_keys);

  // get the numbers of reviews for each Date
  /*
  var FB_values = Object.values(FB_reviewNumberForTime);
  var TA_values = Object.values(TA_reviewNumberForTime);
  */
  var socials_values = socials_reviewNumberForTime.map( counts => Object.values(counts) );
  console.log('socials_values');
  console.log(socials_values);

  var traces_array = allSocials.map( (social,index) =>
      trace = {
        type: 'bar',
        name: 'Recensioni ' + social,
        x: socials_keys[index],
        y: socials_values[index],
        marker: {
          color: social_colors[social]
        },
      }
  );

  console.log('traces_array');
  console.log(traces_array);

  return traces_array;

}
