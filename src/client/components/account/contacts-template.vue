<template>
	<div>
        <div class="container">
			<b-field>
				<label class="label">Profile Contact:</label>
			</b-field>
			<b-field>
				<label class="button is-text">Public key:</label>
				<b-input style="width:760px;" v-model="pubkey" placeholder="profile key">
				</b-input>
				<button class="button is-primary" @click="addcontact">Add</button>
			</b-field>
			<b-field>
				<label class="label is-text">Status: {{pubkeystatus}}</label>
			</b-field>
			<b-field>
				<b-switch v-model="bprofileinfo">Display information</b-switch>
			</b-field>
			<span v-if="bprofileinfo">
			<b-field label="Name">
				<b-input v-model="pubname" placeholder="name"  style="width:400px;"> </b-input>
			</b-field>
			<b-field label="Born">
				<b-input v-model="pborn" placeholder="born"  style="width:400px;"> </b-input> 
			</b-field>
			<b-field label="Education">
				<b-input v-model="peducation" placeholder="education"  style="width:400px;"></b-input>
			</b-field>
			<b-field label="Skills">
				<b-input v-model="pskills" placeholder="skills"  style="width:400px;"></b-input> 
			</b-field>
			</span>
		</div>

		<div>
			<label class="label is-text">Contacts:</label>
			<div id="contactscroll"  class="container" style="overflow:auto;">

				<div class="card" style="width:900px;border-style:solid;border-width:1px;" v-for="item in contacts" :key="item.id">
					<header class="card-header">
						<p class="card-header-title">
							Alias: {{ item.alias }}
						</p>

						<a class="card-header-icon" style="float: right;" v-on:click="deletecontact(item)">
							<b-icon
								pack="fas"
								icon="trash"
								>
							</b-icon>
							</a>
					</header>

					<div class="content">
						
						<b-field>
							<label class="button is-text">Public Key:</label>
							<b-input :id="item.id" v-model="item.id" readonly="readonly" style="width:740px;"> </b-input>
							<p class="control">
								<button class="button" v-on:click="copypubkey(item.id)">
									<b-icon
										pack="far"
										icon="copy"
										>
									</b-icon>
								</button>
							</p>
						</b-field>
					</div>
				</div>

			</div>
		</div>

    </div>
</template>
<script>
import bus from '../../bus';

export default {
	//props:['blogin','contacts'],
	props:['blogin'],
	data() {
		return{
			pubkeystatus:'Normal',
			pubkey:'',
			pubname:'',
			pborn:'',
			peducation:'',
			pskills:'',
			contacts:[],
			contactscrollid:'contactscroll',
			bprofileinfo:false,
		}
    },
    created(){
		this.updatecontacts();
		window.addEventListener('resize', this.handleResize);
	},
	mounted(){
		this.handleResize();
	},
	watch: {
		pubkey:function(newvalue,oldvalue){
			//console.log("new string?");
			this.pubkeystatus = 'typing...';
			this.getpubkey();
		},
	},
	methods:{
		handleResize(event){
			//console.log('resize');
			//console.log(window.innerHeight);
			//console.log(document.getElementById(this.topicidhandle).clientHeight);
			//document.getElementById(this.topicidhandle).clientHeight = window.innerHeight;//read only
			if(window.innerHeight > 300){
				let scrollheight = window.innerHeight - 200;
				document.getElementById(this.contactscrollid).style.height = scrollheight + 'px';
			}
		},
		copypubkey(publicid){
			/* Get the text field */
			var copyText = document.getElementById(publicid);
			//console.log(copyText);
			/* Select the text field */
			copyText.select();  
			/* Copy the text inside the text field */
			document.execCommand("Copy");  
			/* Alert the copied text */
			//alert("Copied the text: " + copyText.value);
			//this.$message({message:'Public Key Copy:' + copyText.value ,type: 'success',duration:800});
			this.$toast.open({
				message: 'Public Key Copy:' + copyText.value,
				type: 'is-success'
			});
		},
		async addcontact(){
			let user = this.$root.$gun.user();
			//console.log(this.pubkey);
			let pub = (this.pubkey || '').trim();
			if(!pub){ return }
			let to = this.$root.$gun.user(pub);
			let who = await to.then() || {};
			this.contactpubstatus = who.alias || "User not found.";
			//console.log(this.pmusercheck);
			if(!who.alias){ return }
			user.get('contacts').get(pub).put({alias:who.alias});
			//this.$message({message:'Contacts Added!',type: 'success',duration:800});
			this.$toast.open({
				message: 'Contacts Added!',
				type: 'is-success'
			});
			//need to fix this. incase over lap copy
			//this.contacts.push({id:pub,alias:who.alias});
			//console.log('added contact!');
		},
		getpubkey:_.debounce(//typing key checks pub key string
			async function(){
				//console.log(this.pubkey.length);
				if(this.pubkey.length == 87){
					this.checkpubkey();
				}else{
					this.pubkeystatus = 'Not pub key and single key current!'
				}
			}
		,500)
		,
		async checkpubkey(){
			this.messages = [];
			this.pubkeystatus = 'checking pub key...'
			let user = this.$root.$gun.user();
			let pub = (this.pubkey || '').trim();
			if(!pub){ return }
			let to = this.$root.$gun.user(pub);
			let who = await to.then() || {};
			this.pubkeystatus = 'Name: '+ who.alias || "User not found.";
			if(!who.alias){ return }
			console.log(who.alias);

			to.get('profile').map().once((data,id)=>{
				//console.log("profile");
				console.log(data);
				console.log(id);
				if(id == 'name'){
					this.pubname = data;
				}
				if(id == 'born'){
					this.pborn = data;
				}
				if(id == 'education'){
					this.peducation = data;
				}
				if(id == 'skills'){
					this.pskills = data;
				}
				//this.UI(say,id,dec);
			});
		},
		updatecontacts(){
			let user = this.$root.$gun.user();
			let self = this;
			//console.log('contacts');
			user.get('contacts').map().once((data,id)=>{
				if(data == 'null')
					return;
				//console.log(data);
				//console.log(id);
				self.contacts.push({id:id,alias:data.alias});
			});
		},
		deletecontact(event){
			//console.log('event');
			//console.log(event);
			let user = this.$root.user;
			let self = this;
			
			this.$dialog.confirm({
				message: 'This will permanently delete the '+ event.alias  + '. Continue?',
				onConfirm:(value)=>{
					this.$toast.open({message:'Delete completed!',type:'is-success'});

					self.contacts = self.contacts.filter(contact => {
						if(contact.id == event.id){
							user.get('contacts').get(contact.id).put('null');
						}
						return contact.id !== event.id;
					});

				},
				onCancel:()=>{
					this.$toast.open({message:'Cancel Delete!',type:'is-warning'});
				}
			});

		},
    },
	beforeDestroy() {
		console.log('beforeDestroy');
  		window.removeEventListener('resize', this.handleResize);
	}
}
</script>

<style lang="scss">
</style>
