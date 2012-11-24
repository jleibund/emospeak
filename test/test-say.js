var say = require('../lib/say'), natural = require('natural');
var wordnet = new natural.WordNet();
var spell = require('spell');

//wordnet.lookup('lea*', function(results) {
//    results.forEach(function(result) {
//        console.log('------------------------------------');
//        console.log(result.synsetOffset);
//        console.log(result.pos);
//        console.log(result.lemma);
//        console.log(result.synonyms);
//        console.log(result.pos);
//        console.log(result.gloss);
//    });
//});

var dict = spell();
dict.load("I am going to the park with Theo today. It's going to be the bomb");
console.log(dict.suggest('th'));


//say.say('say what', 'Victoria');