/*
  Information: This partly babel es6 script code.
 */

//gun/sea/user.js
//https://gun.eco/docs/Adding-Methods-to-the-Gun-Chain
/*
topic
-permission/access
-token
-list forum
*/

export class Topic{
    constructor(){

    }

    async create(key,cb){
        console.log("create");
        console.log(this);
        const gunRoot = this.back(-1);
        var gun = this, cat = (gun._);
        cb = cb || function(){};

        return gun;  // gun chain commands must return gun chains!
    }

    async build(){
        const gunRoot = this.back(-1)
        console.log("build here?!");
        //return;
    }

    async createtoken(){
        //create token for user access
    }

    async verfiytoken(){

    }

}
//var TOPIC = new Topic();
Gun.chain.topic = function(arg) {
    //console.log("chain topic");
    const gunRoot = this.back(-1)  // always reference the root gun instance.
    const topic = gunRoot._.topic || (gunRoot._.topic = gunRoot.chain()); // create a user context.
    [
    'create',
    'build',
    'createtoken',

    //].map((method)=>topic[method] = TOPIC[method]);
    ].map((method)=>topic[method] = new Topic()[method]);
    return topic // return the user!
}

