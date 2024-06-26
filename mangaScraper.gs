
function main() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0];

  for (let x = 25; x<35; x++){
    //removed my manga page for privacy's sake
    var url = ""+x;
    var response = UrlFetchApp.fetch(url);
    var $ = Cheerio.load(response.getContentText())

    var manga = $('div.manga');
    manga.each((i, element) => {

      var currentRow = sheet.getLastRow();
      var nextRow = currentRow+1;
      sheet.setRowHeight(nextRow, 150);

      var a = $(element);
      var title = a.find('.title').text();
      sheet.getRange(nextRow, 1).setValue(title);
      Logger.log(title);
      var image = a.find('img').attr('data-src');
      Logger.log(image);
      insertImageToCell(sheet, image, nextRow, 3);

      var dateAdded = a.find('.status-rate').text().trim();
      dateAdded = dateAdded.substring(0,dateAdded.indexOf(' '));
      Logger.log(dateAdded);
      sheet.getRange(nextRow, 7).setValue(dateAdded);

      var mangaLink = a.find('a').attr('href');
      var responseTwo = UrlFetchApp.fetch(mangaLink);
      var $$ = Cheerio.load(responseTwo.getContentText());

      var info = $$('div.content');

      var genre = info.find('.left').find('tr:nth-child(3)').text().replace(/\s/g, ' ').trim();
      genre = genre.substring(genre.indexOf(" ")+1)
      Logger.log(genre);
      sheet.getRange(nextRow, 2).setValue(genre);

      var summary = info.find('.manga_summary').text().trim();
      Logger.log(summary);
      sheet.getRange(nextRow, 4).setValue(summary);

      var rating = info.find('.rating_num').text();
      Logger.log(rating);
      sheet.getRange(nextRow, 5).setValue(rating);

      var numRatings = info.find('.rating_wrap').find('a').text();
      numRatings = numRatings.substring(0, numRatings.indexOf(" "));
      Logger.log(numRatings);
      var total = rating*numRatings;
      sheet.getRange(nextRow, 6).setValue(total);
      Logger.log(rating*numRatings);


      Logger.log(mangaLink);
      
    });

  }

}

function insertImageToCell(sheet, url, row, col) {
  const formula = '=IMAGE("' + url + '")'
  sheet.getRange(row, col).setValue(formula)
}
