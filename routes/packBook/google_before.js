const request = require("request");
var rp = require('request-promise');
var cheerio = require("cheerio");

let FolderReplace = (s) => s.replace(/\?/g, "@").replace(/</g, "[").replace(/>/g, "]").replace(/:/g, "-").replace(/\*/g, "+").replace(/\\/g, " ").replace(/\//g, "&").replace(/\n/, "").replace(/|/, " ");
let htmlReplace = (s) => s.replace(/(<([^>]+)>)/ig,"");
let replace = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x2013;/g, '-').replace(/&apos;/g, '\'').replace(/&#xA0;/g, ' ').replace(/&amp;/g, '&').replace(/&#x/g, '%u').replace(/;/g, '');

function translateApiCall(oriStr) {
    let formData = "key=AIzaSyBkoF9oYJIpYB_Msi2ZENcNOkld3jNo4_o&target=ko&q="+oriStr
            
    let res = request("post", 'https://www.googleapis.com/language/translate/v2', {
        headers: {       
                'content-type': 'application/x-www-form-urlencoded'
            },
        body: formData
        }
    );
    let trStr = JSON.parse(res.getBody());
    let trText = trStr.data.translations[0].translatedText 

    return trText;
}

let formDefault = {
    method: 'POST',
    uri: 'https://www.googleapis.com/language/translate/v2',
    formData: {
        key : "AIzaSyBkoF9oYJIpYB_Msi2ZENcNOkld3jNo4_o"
         , target : "ko"
         , q : ""
    }
};

exports.HtmlToWiki = function(h, callBack/*, draftPath, step, contentIndex*/) {
    let temp = cheerio.load(h);
    let count = temp("h2.title").length + temp("h3.title").length + temp("h4.title").length + temp("p").length + temp("ul").find("li").length + temp("ol").find("li").length;
    let pointent = 0;

    temp("h2.title").each(function(i, elem) {
        let formData = formDefault;
        formData.formData.q = temp(this).text()

        let point = this;
        rp(formData)
            .then(function(body) {
                let trStr = JSON.parse(body);
                let trText = trStr.data.translations[0].translatedText 

                temp(point).text(temp(point).text() + " - " + trText);  
                temp(point).prepend("# ");
                pointent += 1;
            })
            .catch(function() {
                //console.log("err = " + step+"_"+contentIndex+".md");
            })
            .then(function() {
                if (count == pointent) {
                    callBack(unescape(replace(htmlReplace(temp.html()))));
                    //createMD(draftPath+"/ch"+step, step+"_"+contentIndex+".md", unescape(replace(htmlReplace(temp.html()))));
                }
            });
    });
    temp("h3.title").each(function(i, elem) {
        let formData = formDefault;
        formData.formData.q = temp(this).text()

        let point = this;
        rp(formData)
            .then(function(body) {
                let trStr = JSON.parse(body);
                let trText = trStr.data.translations[0].translatedText 

                temp(point).text(temp(point).text() + " - " + trText);  
                temp(point).prepend("\n\n## ");
                pointent += 1;
            })
            .catch(function() {
                //console.log("err = " + step+"_"+contentIndex+".md");
            })
            .then(function() {
                if (count == pointent) {
                    callBack(unescape(replace(htmlReplace(temp.html()))));
                    //createMD(draftPath+"/ch"+step, step+"_"+contentIndex+".md", unescape(replace(htmlReplace(temp.html()))));
                }
            });
    });
    
    temp("h4.title").each(function(i, elem) {
        let formData = formDefault;
        formData.formData.q = temp(this).text()

        let point = this;
        rp(formData)
            .then(function(body) {
                let trStr = JSON.parse(body);
                let trText = trStr.data.translations[0].translatedText 
                
                temp(point).text(temp(point).text() + " - " + trText);  
                temp(point).prepend("\n\n### ");
                pointent += 1;
            })
            .catch(function() {
                //console.log("err = " + step+"_"+contentIndex+".md");
            })
            .then(function() {
                if (count == pointent) {
                    callBack(unescape(replace(htmlReplace(temp.html()))));
                    //createMD(draftPath+"/ch"+step, step+"_"+contentIndex+".md", unescape(replace(htmlReplace(temp.html()))));
                }
            });
    });
    
    temp("pre.programlisting").prepend("\n\n```java\n").append("\n```");
    temp("strong").prepend("**").append("**");
    temp("img").each(function(i, elem) {
        temp(this).parent().prepend("\n\n![](" + temp(this).attr("src") + ")").append("\n");
    });
    temp("code.literal").each(function(i, elem) {
        temp(this).prepend("\`").append("\`");
        //temp(this).prepend("&lt;span style='color:red'&gt;").append("&lt;/span&gt;");
        //temp(this).prepend("[[").append("]]");
    });
    
    temp("p").each(function(i, elem) {
        let formData = formDefault;
        formData.formData.q = temp(this).text()

        let point = this;
        rp(formData)
            .then(function(body) {
                let trStr = JSON.parse(body);
                let trText = trStr.data.translations[0].translatedText 
    
                temp(point).text(trText);  
                temp(point).prepend("\n\n");
                pointent += 1;
            })
            .catch(function() {
                //console.log("err = " + step+"_"+contentIndex+".md");
            })
            .then(function() {
                if (count == pointent) {
                    callBack(unescape(replace(htmlReplace(temp.html()))));
                    //createMD(draftPath+"/ch"+step, step+"_"+contentIndex+".md", unescape(replace(htmlReplace(temp.html()))));
                }
            });
    });
    
    temp("ul").prepend("\n");
    temp("ol").prepend("\n");

    temp("ul").find("li").each(function(i, elem) {
        let formData = formDefault;
        formData.formData.q = temp(this).text()

        let point = this;
        rp(formData)
            .then(function(body) {
                let trStr = JSON.parse(body);
                let trText = trStr.data.translations[0].translatedText 
    
                temp(point).text(trText);  
                temp(point).prepend("\n* ");
                pointent += 1;
            })
            .catch(function() {
                //console.log("err = " + step+"_"+contentIndex+".md");
            })
            .then(function() {
                if (count == pointent) {
                    callBack(unescape(replace(htmlReplace(temp.html()))));
                    //createMD(draftPath+"/ch"+step, step+"_"+contentIndex+".md", unescape(replace(htmlReplace(temp.html()))));
                }
            });
    });
    
    temp("ol").find("li").each(function(i, elem) {
        let formData = formDefault;
        formData.formData.q = temp(this).text()

        let point = this;
        rp(formData)
            .then(function(body) {
                let trStr = JSON.parse(body);
                let trText = trStr.data.translations[0].translatedText 
                
                temp(point).text(trText);  
                if (temp(point).parent().attr("start") == undefined) {
                    temp(point).prepend("\n1. ");
                } else {
                    temp(point).prepend("\n"+temp(point).parent().attr("start")+ ". ");
                } 
                pointent += 1;
            })
            .catch(function() {
                //console.log("err = " + step+"_"+contentIndex+".md");
            })
            .then(function() {
                if (count == pointent) {
                    callBack(unescape(replace(htmlReplace(temp.html()))));
                    //createMD(draftPath+"/ch"+step, step+"_"+contentIndex+".md", unescape(replace(htmlReplace(temp.html()))));
                }
            });
    }); 
}

