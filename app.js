var config = require('./config.js');
var Twitter = require('twitter');
var removeDiacritics = require('diacritics').remove;
var fs = require('fs');

var client = new Twitter({
    consumer_key: config.CONSUMER_KEY,
    consumer_secret: config.CONSUMER_SECRET,
    access_token_key: config.ACCESS_TOKEN_KEY,
    access_token_secret: config.ACCESS_TOKEN_SECRET
});


var params = {
    screen_name: 'ArthurFlam',
    count:200
};
// twitter lets you use pagination
// unfortunately, you can only go back ~3200 favs :(
var max_id = Infinity
if(config.USE_MAX_ID){ // otherwise we reset the pagination
    var data = fs.readFileSync('./data.json')
    max_id = JSON.parse(data);
    params.max_id = max_id
}

client.get('favorites/list', params, function(error, tweets, response){
    var text
    var needs_removal
    if(error) throw error;
    // console.log(response.headers) //  debug API rate limits
    console.log(tweets.length);
    for(tweet_i in tweets){
        tweet = tweets[tweet_i]
        console.log(tweet.text)
	if(tweet.id_str < max_id){
	    max_id = tweet.id_str // JS integer precision forces you to use str !
	}
        text = removeDiacritics(tweet.text).toLowerCase()
        needs_removal = false
        for(token_i in config.BLACKLIST){
            var in_blacklist = text.indexOf(config.BLACKLIST[token_i]) > -1
            if(in_blacklist){
                needs_removal = true
            }            
        }
	for(token_i in config.WHITELIST){
	    var in_whitelist = text.indexOf(config.WHITELIST[token_i]) > -1
	    if(in_whitelist){
		needs_removal = false
	    }
	}
        if(needs_removal){
            console.log("💣")
            client.post('favorites/destroy', {"id": tweet.id_str}, function(error, tweets, response){
		if(error){
		    console.log(error)
		}
                process.stdout.write("💀 ")
            })
        }
    }
    // save oldest tweet id in order to use pagination
    fs.writeFile('./data.json', max_id, function (err) {
	if (err) {
	    console.log(err.message);
	    return;
	}
    });
})
