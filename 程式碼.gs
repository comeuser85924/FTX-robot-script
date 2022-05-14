function doGet() {
  var spreadsheet = SpreadsheetApp.openById(sheetID);
  var sheet = spreadsheet.getSheets()[0]; // 要第幾個sheet？ 0 就是第一個
  var data = sheet.getDataRange().getValues(); // 取得的資料

  var dataExportFormat = JSON.stringify(data);
  console.log(dataExportFormat)
  
  const offersURL = "https://ftx.com/api/spot_margin/offers"
  return ContentService.createTextOutput(dataExportFormat).setMimeType(ContentService.MimeType.JSON);
}

function getBalances(){
  const resp = UrlFetchApp.fetch('https://ftx.com/api/wallet/balances',params);
}

function getHeader(){
  
}