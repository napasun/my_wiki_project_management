exports.commonSelect = function(db, sql, data, callBack) {
  db.all(sql, data, function(err, rows) {
    if (err) {
      console.log(err)
    }
    callBack(rows);
  });
}

exports.commonSelectOne = function(db, sql, data, callBack) {
  db.get(sql, data, function(err, rows) {
    if (err) {
      console.log(err)
    }
    callBack(rows);
  });
}

exports.commonRun = function (db, sql, data, callBack) {
  db.run(sql, data, function (err) {

  }); 
}

exports.commonSelect = function(db, sql, data, callBack) {
  db.all(sql, data, function(err, rows) {
    if (err) {
      console.log(err)
    }
    callBack(rows);
  });
}


exports.selectBookReservationByAll = function(db, callBack) {
  db.all("SELECT * FROM bookReservation ORDER BY idx", [], function(err, rows) {
    if(err)
      console.log(err);
    callBack(rows);
  });
}

exports.selectBookReservationByFinish = function(db, callBack) {
  db.all("SELECT * FROM bookReservation WHERE finish = 0 ORDER BY orderNum", [], function(err, rows) {
    callBack(rows)
  });
  
}

exports.selectBookByAll = function(db, callBack) {
  db.all("SELECT * FROM book ORDER BY publicationDate", [], function(err, rows) {
    if (err)
      console.log(err)
    callBack(rows);
  });
}

exports.selectBookByNotTranslate = function(db, callBack) {
  db.all("SELECT isbn FROM book WHERE isbn NOT IN (SELECT isbn FROM bookTranslate)", [], function(err, rows) {
    if (err)
      console.log(err)
    callBack(rows);
  }); 
}

exports.selectContentByIsbnAndContentIndex = function(db, callBack, isbn, save) {
  db.all("SELECT * FROM content WHERE isbn = ? AND contentIndex > ? order by contentIndex", [isbn, save], function(err, rows) {
    if (err)
      console.log(err);
    callBack(rows);
  }); 
}

exports.selectContentTranslateByIsbn = function(db, isbn, callBack) {
  db.all("SELECT * FROM contentTranslate WHERE isbn = ? ORDER BY contentIndex", [isbn], function(err, rows) {
    if (err) {
      console.log(err);
    }
    callBack(rows);
  });
}

exports.insertBookReservation = function(db, data, callBack) {
  db.run("INSERT INTO bookReservation (isbn, finish, save, orderNum) VALUES (?, ?, ?, ?)", data, function(err) {
    callBack(err);
  });
}

exports.deleteBookReservation = function(db, isbn, callBack) {
  db.run("DELETE FROM bookReservation WHERE isbn = ? AND save = 0", [isbn], function(err) {
    callBack(err);
  });
}

exports.insertBookTranslate = function(db, isbn, callBack) {
  db.run("INSERT INTO bookTranslate (isbn) VALUES (?)", [isbn], (err) => {
    callBack(err);
  });
}

exports.insertContentTranslate = function(db, data, callBack) {
  db.run("INSERT INTO contentTranslate (isbn, menuNum, contentIndex, title, content) VALUES (?, ?, ?, ?, ?)", data, (err) => {
    callBack(err);
  });
}

exports.updateContentTranslate = function(db, data, callBack) {
  db.run("UPDATE contentTranslate SET content = ? WHERE isbn = ? AND contentIndex = ?", data, (err) => {
    callBack(err);
  });
}

exports.updateBookReservation = function(db, data, callBack) {
  db.run("UPDATE bookReservation SET finish = ?, save = ?  WHERE isbn = ?", data, (err) => {
    callBack(err);
  });
}



//exports.selectBookByNotTranslate((rows) => {console.log(rows)})


function insertTranslateContent() {
  selectBookReservationByAll((e) => {
    if (e.length != 0) {
      e.forEach(function(){
        selectContent((r) => {
          //TODO 번역 + 저장
        }, this.isbn, this. save);
      });
    }
  })
}
