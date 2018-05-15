<template>
	<div v-if="$root.blogin">
        <button class="button" v-on:click="test1">Test</button>
        <button class="button" v-on:click="test2">Test2</button>
        <button class="button" v-on:click="test3">Test3</button>
	</div>
	<div v-else>
		<br>
		<center>
            <b-icon pack="fas" icon="user"></b-icon>
            Please Login.
            <b-icon
                pack="fas"
                icon="exclamation-triangle">
            </b-icon>
        </center>
	</div>
</template>

<script>
export default {
	components: {
		
    },
    methods:{
        test1(){
            console.log('test1');
            let gun = this.$root.$gun;
            console.log(gun);
            gun.get('test').put({text:'text'},(ack)=>{
                console.log(ack);
            });

            gun.get('test').once((data)=>{
                console.log(data);
            });
        },

        test2(){
            console.log('test2');
            let gun = this.$root.$gun;
            let user = gun.user();
            console.log(gun);

            //user data is bind to this variable key
            let room = user.get('room').put({name:'room'});
            console.log(room);
            //get current user to see variable for room
            //set room and then genrate id key that is current user
            user.get('room').once((data)=>{
                console.log(data);
                console.log(data._['#']); //id key for using gun.get('jh4wa2x2~qjbFKQnhE0gSsO9ylW-0AlEfcf9MZ2AUc0HnO__7Jzg.5XrlD8CuBE1Brr6Pju4a5Fe2eQqzhp4uKNlWZErpNeA')
            });
            //get user from room id from current user and not other user rooms.
            gun.get('jh4wa2x2~qjbFKQnhE0gSsO9ylW-0AlEfcf9MZ2AUc0HnO__7Jzg.5XrlD8CuBE1Brr6Pju4a5Fe2eQqzhp4uKNlWZErpNeA').once((data)=>{
                console.log(data);
            });
            //set data for user create is current own this id room as other users can't write this.
            gun.get('jh4wa2x2~qjbFKQnhE0gSsO9ylW-0AlEfcf9MZ2AUc0HnO__7Jzg.5XrlD8CuBE1Brr6Pju4a5Fe2eQqzhp4uKNlWZErpNeA').put({name:'test4'});
        },

        test3(){
            let gun = this.$root.$gun;
            let user = gun.user();
            //console.log(gun);
            //let hash = Gun.text.random(32);
            //console.log(hash);
            let hash = 'HHFOPGBCEhz0zzQRvr8ppnER8sqTc7P7'; //object id // Gun.text.random(32); // <-random text generate
            //key id used for gun.get('key') from hash object gun.get(hash).put({name:'room'});
            let key = 'jh4xoamd~qjbFKQnhE0gSsO9ylW-0AlEfcf9MZ2AUc0HnO__7Jzg.5XrlD8CuBE1Brr6Pju4a5Fe2eQqzhp4uKNlWZErpNeA'; 
            //let room = user.get(hash).put({name:'room'}); //object id hash
            //user.get(hash).once((data)=>{
                //console.log(data);
                //console.log(data._['#']); //key id > 'jh4xoamd~qjbFKQnhE0gSsO9ylW-0AlEfcf9MZ2AUc0HnO__7Jzg.5XrlD8CuBE1Brr6Pju4a5Fe2eQqzhp4uKNlWZErpNeA'
            //});
            //works
            //gun.get(key).once((data)=>{
                //console.log(data);//{name:'room'} and key id for this object
            //});

        },

    },
}
</script>

<style lang="scss">

</style>