/**
 * Projet libr2ddoc
 * Fichier google AppsScrips (extension gSheet)
 * 
 * Ajoute une ligne en fin de tableau avec le JSON exportable pour la partie Rust.
 *
 */
function subarray_push(array, i, j, value) {
  let al = array.length;
  for(var k=0;k<(i-al+1);k++){
    array.push([]);
  }

  al = array[i].length;
  for(var k=0;k<(j-al+1);k++){
    array[i].push([]);
  }

  array[i][j].push(value);
}

function s6() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Section 6");
  var range = sheet.getDataRange();
  var values = range.getValues();

  var data = {};
  values.forEach((row, i) => {

    if(row[0] == '')
      return;
    
    data[row[1]] = {
      'type': row[0],
      'date_emission': row[2] == 'O' ? true : false,
      'description': row[3]
    };
  })
  sheet.appendRow(['', 'JSON: ', JSON.stringify(data)]);
}

function s7() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Section 7");
  var range = sheet.getDataRange();
  var values = range.getValues();

  var data = {};
  values.forEach((row, i) => {

    if(row[0] == '')
      return;
    
    data[row[2]] = {
      'nom': row[3],
      'taille_min': row[4],
      'taille_max': row[5],
      'type': row[6],
      'description': row[7],
      'condition_type': row[8],
      'condition': row[9]
    };
  })
  sheet.appendRow(['', 'JSON: ',JSON.stringify(data)]);
}

function s8(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Section 8");
  var range = sheet.getDataRange();
  var values = range.getValues();

  var valuesT = values[0].map((_, colIndex) => values.map(row => row[colIndex])); //Transpose the matrix

  var data = {}
  valuesT.forEach((col, index_col) => {
    name_col = valuesT[index_col][2];

    data[name_col] = {
      "O": [],
      "F": [],
      "C": []
    };

    col.forEach((value, index_line) => {

      name_line = valuesT[1][index_line];

      //Only keep data in table
      if(name_col == '' || name_line == '')
        return;
      
      switch(value){
        case 'O': //Mandatory
        case 'F': //Optional
          data[name_col][value].push(name_line);
        case '': //Refused (not added)
          break;
        default: //Conditional
          if(value.match(/^O.[0-9].[0-9]$/) != null){
            let explode = value.split('.');
            subarray_push(data[name_col]["C"], parseInt(explode[1])-1, parseInt([explode[2]])-1, name_line);
          }else{
            data[name_col]['F'].push(name_line); //Handle functions
            console.log("ERROR CONDITIONAL: ", name_col, name_line, value);
          }
          
        //End of hack
      }
    });
  });

  sheet.appendRow(['JSON: ', '', JSON.stringify(data)]);
}











function all(){
  s6()
  s7()
  s8()
}