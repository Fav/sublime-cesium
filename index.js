var fs = require("fs");
var cesium = require("cesium");
/* 
 * 用来遍历指定对象所有的属性名称和值 
 * obj 需要遍历的对象 
 * author: Jet Mah 
 */
function allPrpos(obj, name) {
    // 开始遍历 
    for (var p in obj) {
        let outobj = {};
        // 方法 
        if (typeof(obj[p]) == "function") {
            let fn = obj[p];
            let code = getParaDescrip(fn);
            let k = code.slice(code.indexOf('('), code.indexOf(')') + 1).replace(/[\r\n ]/g, ""); //去掉回车，空格
            outobj["trigger"] = name + "." + p + k;
            //如果存在就进入下一次循环
            if (existPara(outobj["trigger"])) {
                continue;
            }
            //如果没有参数，进入下一次循环
            if (fn.length == 0) {
                outobj["trigger"] = name + "." + p + "(" + ");$0";
                continue;
            } else {
                let paras = getParameterNames(fn);
                let des = "";
                for (var i = 0; i < paras.length; i++) {
                    des += "${{0}:{1}},".format(i + 1, paras[i]);
                }
                //去掉最后的逗号
                des = des.slice(0, des.lastIndexOf(','));
                outobj["contents"] = name + "." + p + "(" + des + ");$0";
            }
            tips.push(outobj);
        } else if (typeof(obj[p]) == "object") {
            // p 为属性名称，obj[p]为对应属性的值 
            outobj["trigger"] = name + "." + p;
            //如果存在就进入下一次循环
            if (existPara(outobj["trigger"])) {
                continue;
            }
            outobj["contents"] = name + "." + p + ";$0";
            tips.push(outobj);
            allPrpos(obj[p], name + "." + p);
        } else {
            continue;
        }
    }
    // 最后显示所有的属性 
}

function existPara(trigger) {
    for (let i = 0; i < tips.length; i++) {
        if (tips[i].trigger == trigger) return true;
    }
    return false;
}
//console.log(cesium._shaders);
/*
获取方法的所有参数
 */
function getParameterNames(fn) {
    var code = getParaDescrip(fn);
    var result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);
    return result === null ? [] : result;
}

function getParaDescrip(fn) {
    var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    return fn.toString().replace(COMMENTS, '');
}
String.prototype.format = String.prototype.f = function() {
        var s = this,
            i = arguments.length;
        while (i--) {
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
        }
        return s;
    }
    //"chen {0} hua".format("zeng")  -> "chen zeng hua"
var resultJson = {};
resultJson["scope"] = "source.js - variable.other.js";
var tips = [];
allPrpos(cesium, "Cesium");
resultJson["completions"] = tips;
fs.writeFile("cesium.sublime-completions", JSON.stringify(resultJson));