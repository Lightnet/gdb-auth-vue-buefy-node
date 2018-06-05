# Gun

Object.keys(gun.back('opt.peers')).length

in package.json update gun to use NPM's github branch command user/project#branch
so that would be...
amark/gun#debug

GUN_ENV='debug'

in package.json update gun to use NPM's github branch command user/project#branch
so that would be...
amark/gun#debug

npm install amark/gun#debug

process.env.GUN_ENV ='false'

postStatus(){
  ...
  var item = user.get('profile').get('status').set(status); // whatever your existing code is
  gun.get('@').time(item); // index globally
}
onHomePageFeedRoute(){
  gun.get('@').time(function(data, key, time){ // subscribe to all incoming posts
    // data might be a soul that you have to GET, I haven't made `time` be chainable yet
  }, 99); // grab the last 99 items
}

gun.get("@username").time(notificationObject)

tg.time( (data, key, time) => {
    /*console.log(data); //This Gives me {"#":"Rand0mVa1u3"}*/
    /*console.log(key); //This Gives me just "Rand0mVa1u3"*/
    /*console.log(time); //gives a timestamp*/
    gun.get(Gun.val.rel.is(data)).once((data) => { /*Attempt to retrive the data*/
        console.log(data);
    });
} );



var Gun = require('gun');
var os = require('os');

var a = [];

// os.freemem() useless in detecting crash.
// process.memoryUsage().rss loosely correlated, explore more.

setInterval(function(){
    console.log((process.memoryUsage().rss / 1024 / 1024).toFixed(1), 'MB left.');
    a.push(Gun.text.random(1024 * 1024));
}, 1);

setInterval(function(){
    var save = JSON.stringify(a);
    require('fs').writeFileSync('ram.tmp', save);
}, 1000);