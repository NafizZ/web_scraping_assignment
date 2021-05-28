// const request = require('request');
// const cheerio = require('cheerio');

// request('https://www.w3schools.com', (error, response, html) => {
//     if(!error && response.statusCode == 200){
//         // const $ = cheerio.load(html);

//         // const body = $('body');
//         // console.log(body);

//         const $ = cheerio.load(body);

//         links = $('a'); //jquery get all hyperlinks
//         $(links).each(function(i, link){
//             console.log($(link).text() + ':\n  ' + $(link).attr('href'));
//         });
//     }
// });

var request = require('request');
var cheerio = require('cheerio');

// const fs = require('fs');
// const writeStream = fs.createWriteStream('scrape_links.csv');

// //write headers
// writeStream.write('title, link \n');

 var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE IF NOT EXISTS WebScrapeInfo (id INT AUTO_INCREMENT PRIMARY KEY, Title VARCHAR(255), Link VARCHAR(255) UNIQUE, Frequency INT(10))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});


request('https://www.w3schools.com', (err, resp, body)=> {    
  if (!err && resp.statusCode == 200){

//database connection
// con.connect(function(err) {
// if (err) throw err;
// console.log("Connected!");

      const $ = cheerio.load(body);
      //jquery get all hyperlinks
      $('a').each(function(i, el){

              const title = 't_' + $(el).text().replace(/\s/g, '');
              const link = $(el).attr('href');
              const freq = 1;
              // console.log( title + ":  " + link);

                var sql = "INSERT INTO `webscrapeinfo` (Title, Link, Frequency) VALUES ('"+title+"', '"+link+"', '"+freq+"') ON DUPLICATE KEY UPDATE `Frequency`= Frequency+1"
                //database insert 
                // var sql = "INSERT INTO WebScrapeInfo (Title, Link, Frequency) VALUES ('"+title+"', '"+link+"', '1')";
                con.query(sql, function (err, result) {
                  if (err) throw err;
                  console.log("1 record inserted");
                });
              

              // //write to csv 
              // writeStream.write(' '+title+', '+link+' \n');
      });

    // console.log( "scraping done!");

  }
});
// });