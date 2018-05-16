<template>
	<div>
        <b-switch v-model="bdisplaydatabase">Display Peers Database Options</b-switch>
        <div v-if="bdisplaydatabase">
            <button class="button  is-danger" v-on:click="cleardata">
				<b-icon pack="fas" icon="exclamation-triangle"></b-icon>
				<span>
				Clear Local Database 
				</span>
			</button>
			<div class="field is-grouped is-grouped-left">
				<p class="control">
					<b-field>
					<label class="button is-text">Gun Peers</label>
					<b-select placeholder="Select a peer" v-model="peerselect" v-on:input="$emit('peerselect',peerselect)">
						<option  
							v-for="peer in peers" 
							:key="peer" 
							:value="peer"
							>
							{{peer}}
							</option>
					</b-select>
					</b-field>
				</p>
				<p class="control">
					<button class="button is-primary" v-on:click="Connect"><span>Connect</span>
						<b-icon pack="fas" icon="sync"></b-icon>
					</button>
					<button class="button is-warning" v-on:click="Disconnect">
						<span>Disconnect</span>
						<b-icon pack="fas" icon="unlink"></b-icon>
					</button>
				</p>
			</div>
			<b-field>
				<label class="button is-text">Url Peer:</label>
				<b-input v-model="newgunpeer" @keyup.enter.native="getgunpeerurl"></b-input>
				<p class="control">
                	<span class="button is-static">/gun</span>
            	</p>
				<button class="button is-primary" @click="checkPeerUrl">
					<span>Add</span>
					<b-icon pack="fas" icon="server"></b-icon>
				</button>
				<p class="control">
					<span class="button is-static">
						<label class="label">Status:{{gunpeerstatus}}</label>
					</span>
				</p>
			</b-field>

        </div>
    </div>
</template>
<script>
//import bus from '../bus';

export default {
	props:[],
	data() {
		return{
			bdisplaydatabase:false,
			peers:[],
			peerselect:null,
			newgunpeer:'',
			gunpeerstatus:'N/A',
		}
    },
    created(){
		this.updateDatabaseList();
	},
	methods:{
        updateDatabaseList(){
			let peers = this.$root.$gun.back('opt.peers');
			//console.log(peers);
			for(let peer in peers){
				//console.log(peer); 
				this.peers.push(peer); //url address
			}
		},
		getgunpeerurl(){
			console.log(this.newgunpeer);
		},
        Connect(){//need to fix this
			//let gun = this.$root.$gun;
			//gun.get('data').once(function(){});
			let peers = this.$root.$gun.back('opt.peers');
			let url = this.peerselect;
			if(peers[url] == null){
				console.log('null');
				return;
			}
			if(url == '')
				return;
			console.log(peers[url]);

			if(peers[url].url == null){//if url is null and set url for connect
				peers[url].url = url;
				peers[url].wire.onopen();
				console.log("connect????");
			}
			//peers[url].url = null;
			//peers[url].wire.onopen();
		},
		Disconnect(){//need to fixed this
			let peers = this.$root.$gun.back('opt.peers');
			let url = this.peerselect;
			console.log(peers[url]);
			if(peers[url] == null){
				console.log('null');
				return;
			}
			if(url == ''){
				return;
			}
			//if(location.origin == 'http://localhost:3000'){
				//url ='http://localhost:8080' + '/gun';
			//}else{
				//url = location.origin + '/gun';
			//}
			//console.log(peers);
			peers[url].wire.close();
			peers[url].url = null;
			//console.log(peers[url]);
            clearTimeout(peers[url].defer);
		},
		cleardata(){
			localStorage.clear(); //clear database for gun
			this.$toast.open({
				message: 'Clear Database!',
				type: 'is-success'
			})
		},
		checkPeerUrl(){
			let gun =this.$root.$gun;
			console.log(gun);

			//gun._.opt.peers.push();
		}
    },
}
</script>
<style lang="scss">

</style>