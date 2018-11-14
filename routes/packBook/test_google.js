var sqlite3 = require('sqlite3').verbose();

const bookDBPath = 'db/books.db';

const query = require('../query/contentGoogle');
const google = require('./google');

function translateSchedule(isbn) {
    let db = new sqlite3.Database(bookDBPath);
    query.selectContentByIsbnAndContentIndex(db, (contents) => {
        let i = 0;
        contents.forEach((content, i, arr) => {
            let replaceStr = google.HtmlToWiki(content.content)                
            i = i + 1;
            var percent = (i / contents.length * 100).toFixed(2);
            process.stdout.cursorTo(0);
            process.stdout.clearLine(1);
            process.stdout.write(percent + '%');
            query.insertContentGoogle(db, [isbn, content.menuNum, content.contentIndex, content.title, replaceStr], ()=> {            
                db.close();
            })
        }); 
    }, isbn, 0)
}
//9781788475709
translateSchedule("9781788475709")