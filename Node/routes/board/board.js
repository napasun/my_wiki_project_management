const showdown = require('showdown') 
const converter = new showdown.Converter();
const connect = require("../db/connect.js");
const boardDB = require('./db/boardDB');

function undefinedValueByDefaultValueEnter(data, def) {
    if (data == undefined)
        return def;
    else
        return data;
}

exports.BoardController = {
    listView: (req, res) => {
        res.render("board/board/list", {menu : ["게시판", "게시판 목록"]});
    },
    formView: (req, res) => {
        res.render("board/board/form", {menu : ["게시판", "게시판 편집"]});
    },
    list: (req, res) => {
        let page = undefinedValueByDefaultValueEnter(req.query.page, 1);

        connect.dbOpen({"path": connect.config.db.board, "findByAllParam": []})
        .then(boardDB.BoardService.findByAll)
        .then(connect.dbClose)
        .then((result) => {
            if (result.err) {
                console.log(result.err);
            }
            
            res.send({rows : result.findByAll, page: page, total: 1, records: result.findByAll.length});
        });
    },
    edit: (req, res) => {
        let oper = req.body.oper;
        let idx = req.body.id;
        let title = req.body.title;
        let hidden = req.body.hidden;

        if (oper == "add") {
            connect.dbOpen({"path": connect.config.db.board, "saveParam": [title, hidden]})
            .then(boardDB.BoardService.save)
            .then(connect.dbClose)
            .then((result) => {
                if (result.err) {
                    console.log(result.err);
                }

                res.send({result: result.err})
            });
        } else if(oper == "edit") {
            connect.dbOpen({"path": connect.config.db.board, "updateParam": [title, hidden, idx]})
            .then(boardDB.BoardService.update)
            .then(connect.dbClose)
            .then((result) => {
                if (result.err) {
                    console.log(result.err);
                }

                res.send({result: result.err})
            });
        } else {
            connect.dbOpen({"path": connect.config.db.board, "deleteParam": [idx]})
            .then(boardDB.BoardService.delete)
            .then(connect.dbClose)
            .then((result) => {
                if (result.err) {
                    console.log(result.err);
                }

                res.send({result: result.err})
            });
        }
    }
}

exports.BoardContentController = {
    listView: (req, res) => {
        res.render('board/content/list', {menu: ['게시판', '목록'] });
    },
    readView: (req, res) => {
        let idx = undefinedValueByDefaultValueEnter(req.params.idx, 0);
        
        connect.dbOpen({"path": connect.config.db.board, "findByIdxParam": [idx]})
        .then(boardDB.BoardContentService.findByIdx)
        .then(connect.dbClose)
        .then((result) => {
            if (result.findByIdx === undefined) {
                res.render('board/content/list', {menu: ['게시판', '내용'], errorMessage: "잘못된 호출입니다."}) 
            } else {
                result.findByIdx.content = converter.makeHtml(result.findByIdx.content);
                res.render('board/content/read', {menu: ['게시판', '내용',], "row" : result.findByIdx }) 
            }
        });
        
    },
    formView: (req, res) => {
        let idx = req.query.idx;
    
        if (idx == undefined) {
            idx = 0;
            res.render('board/content/form', {menu: ['게시판', '편집'], idx: idx , row: null})
        } else {
            connect.dbOpen({"path": connect.config.db.board, "findByIdxParam": [idx]})
            .then(boardDB.BoardContentService.findByIdx)
            .then(connect.dbClose)
            .then((result) => {
                result.findByIdx.content = result.findByIdx.content.replace(/```/g, "~~~")
                res.render('board/content/form', {menu: ['게시판', '편집'], idx: idx, row: result.findByIdx })
            });
        } 
    },
    save: (req, res) => { 
        connect.dbOpen({"path": connect.config.db.board, "saveParam": [1, req.body.title, req.body.content/*, Date()*/, 0]})
            .then(boardDB.BoardContentService.save)
            .then(connect.dbClose)
            .then((result) => {
                res.send({"result" : result.err, "idx" : result.lastID});
        });
    },
    update: (req, res) => {
        connect.dbOpen({"path": connect.config.db.board, "updateParam": [req.body.title, req.body.content, req.body.idx]})
            .then(boardDB.BoardContentService.update)
            .then(connect.dbClose)
            .then((result) => {
                res.send({"result" : result.err, "idx" : req.body.idx});
        });
    },
    delete: (req, res) => {
        let idx = req.body.idx;
    
        connect.dbOpen({"path": connect.config.db.board, "deleteParam": [idx]})
            .then(boardDB.BoardContentService.delete)
            .then(connect.dbClose)
            .then((result) => {
                res.send({"result" : result.err});
        });
    },
    list: (req, res) => {
        let boardIdx = req.query.boardIdx;
        let start = req.query.start;
        let rows = req.query.rows;
    
        boardIdx = undefinedValueByDefaultValueEnter(boardIdx, "1");
        start = undefinedValueByDefaultValueEnter(start, "0");
        rows = undefinedValueByDefaultValueEnter(rows, "10");
        
        connect.dbOpen({"path": connect.config.db.board, "findbyBoardIdxParam": [boardIdx, start, rows]})
            .then(boardDB.BoardContentService.findbyBoardIdx)
            .then(connect.dbClose)
            .then((result) => {
                res.send({"rows" : result.findbyBoardIdx});
        });
    },
    read: (req, res) => {
        let idx = req.query.idx;
    
        connect.dbOpen({"path": connect.config.db.board, "findByIdxParam": [idx]})
            .then(boardDB.BoardContentService.findByIdx)
            .then(connect.dbClose)
            .then((result) => {
                res.send({"rows" : result.findByIdx});
        });
    }
}

exports.JournalController = {
    list: (req, res) => {
        connect.dbOpen({"path": connect.config.db.board, "findByAllParam": []})
            .then(boardDB.JournalService.findByAll)
            .then(connect.dbClose)
            .then((result) => {
                result.findByAll.forEach(element => {
                    element.description = converter.makeHtml(element.description);
                });
                res.send({"rows" : result.findByAll});
        });
    },
    save: (req, res) => { 
        connect.dbOpen({"path": connect.config.db.board, "saveParam": [req.body.description]})
            .then(boardDB.JournalService.save)
            .then(connect.dbClose)
            .then((result) => {
                res.send({"result" : result.err, "idx" : result.lastID});
        });
    },
    update: (req, res) => {
        connect.dbOpen({"path": connect.config.db.board, "updateParam": [req.body.description, req.body.idx]})
            .then(boardDB.JournalService.update)
            .then(connect.dbClose)
            .then((result) => {
                res.send({"result" : result.err, "idx" : req.body.idx});
        });
    },
    delete: (req, res) => {
        connect.dbOpen({"path": connect.config.db.board, "deleteParam": [req.body.idx]})
            .then(boardDB.JournalService.delete)
            .then(connect.dbClose)
            .then((result) => {
                res.send({"result" : result.err});
        });
    },
}