function KeepLending(){
  var coin = "USDT";
  
  var target = GetBalance().find((v) => v.coin === coin)
  insertNewData(coin,[[new Date().toLocaleString()]],'A')
  insertNewData(coin,[[target.total]],'B')
  insertNewData(coin,[[getGetLendingRates()]],'C')

  var size = Math.floor(target.total*1000000)/1000000;
  var rate = 1e-6;
  var data = {"coin": coin, "size": size, "rate": rate};
  var payload =JSON.stringify(data);

  var ts = String(Date.now());
  var method = "POST";
  var command = basepath + "/spot_margin/offers";
  var sign = toHexString(Utilities.computeHmacSha256Signature(ts + method + command + payload, keys.apisecret));
  function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }
  var header = {
    'FTX-KEY' : keys.apikey,
    'FTX-TS' : ts,
    'FTX-SIGN' : sign
  };
  var options = {
    'method' : method,
    'headers' : header,
    'contentType': 'application/json',
    'payload' : payload
  };

var result = UrlFetchApp.fetch(uri + command, options);
Logger.log(result)
}


function GetBalance(){
  var ts = String(Date.now());
  var method = 'GET';
  var command = basepath + "/wallet/balances";
  var sign = toHexString(Utilities.computeHmacSha256Signature(ts + method + command, keys.apisecret));
  function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }
  var header = {
    'FTX-KEY' : keys.apikey,
    'FTX-TS' : ts,
    'FTX-SIGN' : sign
  };
  var options = {
    'method' : method,
    'headers' : header
  };
  return JSON.parse(UrlFetchApp.fetch(uri + command, options)).result
}

function getTableList(tabName, rows='A') {
  const rangeName = `${tabName}!${rows}:${rows}`;
  const values = Sheets.Spreadsheets.Values.get(sheetID, rangeName).values;
    // console.log(values)

  if(!values) {
    Logger.log('no data')
    return []
  }
  return values;
}

function insertNewData(tabName, data, rows='A') {
  const values = getTableList(tabName, rows);
  const valuesIndex = (!values) ? 1 : values.length+1;
  // console.log(`Inserting dcard list and sheet index is : ${valuesIndex} ...`);
  const rangeName = `${tabName}!${rows}${valuesIndex}:${rows}`;
  // console.log(rangeName)
  const requestData = {
      majorDimension: "ROWS",
      values: data
  };
  Sheets.Spreadsheets.Values.update(
      requestData,
      sheetID,
      rangeName,
      {valueInputOption: "USER_ENTERED"}
    );
}

function getGetLendingRates(){
  var ts = String(Date.now());
  var method = "GET";
  var command = basepath + "/spot_margin/lending_rates";
  var sign = toHexString(Utilities.computeHmacSha256Signature(ts + method + command, keys.apisecret));
  function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }
  var header = {
    'FTX-KEY' : keys.apikey,
    'FTX-TS' : ts,
    'FTX-SIGN' : sign
  };
  var options = {
    'method' : method,
    'headers' : header
  };
  var resp = UrlFetchApp.fetch(uri + command, options);
  var result = JSON.parse(resp).result
  var filterUSDTRate =  result.filter(function (val) {
    return val.coin === 'USDT'
  });
  return ((filterUSDTRate[0].estimate)*1000000).toFixed(2) + '%'
}

