
function myFunction() {
  var keys = {apikey: '', apisecret: ''};  
  PropertiesService.getScriptProperties().setProperties(keys);
}


var uri = 'https://ftx.com'
var basepath = '/api'
var keys = PropertiesService.getScriptProperties().getProperties();
var sheetID = ''