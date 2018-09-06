Plotly.d3.csv("/full.csv", function(err, rows){

  function unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
  }

  var headerNames = Plotly.d3.keys(rows[0]);

  var headerValues = [];
  var cellValues = [];
  for (i = 0; i < headerNames.length; i++) {
    headerValue = [headerNames[i]];
    headerValues[i] = headerValue;
    cellValue = unpack(rows, headerNames[i]);
    cellValues[i] = cellValue;
  }

  // clean date
  for (i = 0; i < cellValues[1].length; i++) {
    var dateValue = cellValues[1][i].split(' ')[0]
    cellValues[1][i] = dateValue
  }


var data = [{
  type: 'table',
  columnwidth: [350,1000,350,600,2000,400],
  columnorder: [1,3,2,4,5,6],
  header: {
    values: headerValues,
    align: "center",
    line: {width: 1, color: 'rgb(50, 50, 50)'},
    fill: {color: ['rgb(235, 100, 230)']},
    font: {family: "Arial", size: 11, color: "white"}
  },
  cells: {
    values: cellValues,
    align: ["center", "center"],
    line: {color: "black", width: 1},
    fill: {color: ['rgba(255, 255, 255, 0.65)', 'rgba(255, 255, 255, 0.65)','rgb(235, 193, 238)', 'rgba(255, 255, 255, 0.65)']},
    font: {family: "Arial", size: 10, color: ["black"]}
  }
}]

var layout = {
  title: "Bitcoin mining stats for 180 days"
}

Plotly.plot('chart2', data, layout);
});
