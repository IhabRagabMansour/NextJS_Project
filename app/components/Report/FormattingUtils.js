export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatReportName() {
  // Get current date and time
  var now = new Date();

  // Extract year, month, day, hours, minutes, and seconds
  var year = now.getFullYear().toString();
  var month = (now.getMonth() + 1).toString().padStart(2, '0');
  var day = now.getDate().toString().padStart(2, '0');
  var hours = now.getHours().toString().padStart(2, '0');
  var minutes = now.getMinutes().toString().padStart(2, '0');
  var seconds = now.getSeconds().toString().padStart(2, '0');

  // Concatenate them into a single string with underscores
  var currentDateTimeString = year + '_' + month + '_' + day + '_' + hours + '_' + minutes + '_' + seconds;
  return "report_" + currentDateTimeString + ".pdf";
}
