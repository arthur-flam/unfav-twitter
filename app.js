var config = require('./config.js');
var Twitter = require('twitter');
var removeDiacritics = require('diacritics').remove;

var client = new Twitter({
    consumer_key: config.CONSUMER_KEY,
    consumer_secret: config.CONSUMER_SECRET,
    access_token_key: config.ACCESS_TOKEN_KEY,
    access_token_secret: config.ACCESS_TOKEN_SECRET
});


var params = {
    screen_name: 'ArthurFlam',
    count:200,
    //max_id
};

client.get('favorites/list', params, function(error, tweets, response){
    var text
    var needs_removal
    if(error) throw error;
    console.log(tweets.length);
    for(tweet_i in tweets){
        tweet = tweets[tweet_i]
        console.log(tweet.text)
        text = removeDiacritics(tweet.text).toLowerCase()
	console.log(text)
        flags = ["cop21", "developpement durable", "changement climatique", "dechet", "btp", "energies propres"]
        needs_removal = false
        for(flag_i in flags){
            var flag = flags[flag_i]
            if(text.indexOf(flag) > -1){
                needs_removal = true
            }            
        }
        if(needs_removal){
            console.log("💣")
            client.post('favorites/destroy', {"id": tweet.id}, function(error, tweets, response){
                console.log("💀")
            })
        }
    }
})
