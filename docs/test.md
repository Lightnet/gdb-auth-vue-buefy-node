http://jsbin.com/botagizefu/edit?html,js,console

;(async () => {
//get a stream that we can put events in
var stream = gun.get("streams").get("aStream");

gun.get("events").get("event").put({
    type: "update",
    name: "feed"
});

var event = await gun.get("events").get("event").then();

console.log(event);

//put the event into the stream
stream.get("events").put(event);
})();

http://jsbin.com/buxoxegifu/1/edit?js,console,output

var gun = Gun();

var stream = gun.get("streams").get("aStream");

stream.on((data)=>{
  console.log('stream event');
  console.log(data);
})

function test(){
  console.log('test');
  stream.get('event').put({type: "update",name: "feed"});
}


Mark Nadal @amark 16:21
@Lightnet you are such a code hustler!! :D

Lightnet @Lightnet 16:22
gun.get('stream').on() event is cool to listen to child node when being push to sub child XD

Mark Nadal @amark 16:22
@Lightnet yeah :D
so even gun.get('stream').map().once(cb) the "once" is just to grab each item once
the table itself is still subscribed to
and you get reatlime updates on items added, that then get grabbed once
gun.get('stream').map().on(cb) obvoiusly also gets each item as it is updates, and as it is added.

Lightnet @Lightnet 16:23
oh

Mark Nadal @amark 16:23
gun.get('stream').once().map().once(cb) grabs the table once, then each item once
gun.get('stream').once().map().on(cb) grabs the table once, then subscribes to chnages on those items.
this is in the docs just FYI so you don't need to worry about forgetting it :P

gun.get('stream').once().map().once(cb) grabs the table once, then each item once
gun.get('stream').once().map().on(cb) grabs the table once, then subscribes to chnages on those items.
this is in the docs just FYI so you don't need to worry about forgetting it :P
that is why it is pretty easy to build some powerful extensions on top, like timegraph or .open and stuff
or even .load
that can sync documents, tables, key-value pairs, or even javascript objects with circular references
crowd source help for ideas on memory-eviction (GC)
should GUN...
garbage collect every "once in a while"
which might cause things to pause while ti finds everything to evict
(from memory, not disk, just so RAM utililzation stays constant)
should it check on every read? Slows perf down, but doesn't "pause"
etc. ? any good LRU ideas?


