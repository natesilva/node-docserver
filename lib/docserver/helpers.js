
// shallow merge all objects passed in as arguments

function merge() {
 var result = {};
 
 for (var index = 0; index < arguments.length; ++index) {
   var obj = arguments[index];
   for (var key in obj) {
     if (obj.hasOwnProperty(key)) {
       result[key] = obj[key];
     }
   }
 }

 return result;
}

exports.merge = merge;
