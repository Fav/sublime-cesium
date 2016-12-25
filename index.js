var fs = require("fs");
var cesium = require("cesium");
/* 
 * 用来遍历指定对象所有的属性名称和值 
 * obj 需要遍历的对象 
 * author: Jet Mah 
 */
function allPrpos(obj) {
    // 用来保存所有的属性名称和值 
    var props = "";
    // 开始遍历 
    for (var p in obj) {
        // 方法 
        if (typeof(obj[p]) == "function") {
            props += p + "   方法\r\n";
        } else {
            // p 为属性名称，obj[p]为对应属性的值 
            props += p + "   属性\r\n ";
        }
    }
    // 最后显示所有的属性 
   fs.writeFile("a.txt", props);
}

//console.log(cesium._shaders);

allPrpos(cesium);

function ShowObjProperty(Obj) {
    var PropertyList = '';
    for (i in Obj) {
        if (Obj.i != null) PropertyList = PropertyList + i + '属性：' + Obj.i + '\r\n';
        else PropertyList = PropertyList + i + '方法\r\n';
    }
    console.log(PropertyList);
    fs.writeFile("a.txt", PropertyList);
    //alert(PropertyList);
}
// console.log(cesium);