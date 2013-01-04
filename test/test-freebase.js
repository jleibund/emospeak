var $ = require('jquery'), _=require('underscore');
//type=/common/topic&
console.log('search',process.argv[2]);
$.getJSON('http://www.freebase.com/private/suggest?type=%2Fbase%2Fwordnet%2Fword&type_strict=any&prefix='+process.argv[2], function(data){


    _.each(data.result, function(r){
//        if (!~r.name.indexOf('Undefined') && !~r.name.indexOf('undefined'))
            console.log(r.name);
    })
});