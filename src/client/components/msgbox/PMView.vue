<template>
	<div>
		<button class="button is-primary" @click="$emit('messagelist')">Back</button>
		<div class="card">
			<div class="card-content">
				<div class="media">
					<div class="media-left">
						<figure class="image is-48x48">
						<img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
						</figure>
					</div>
					<div class="media-content" style="overflow:hidden;">
						<p class="title">From: {{messagedata.from}}</p>
						<p class="subtitle">Subject: {{messagedata.subject}}</p>
					</div>
				</div>
				Content:
				<div class="content">
					{{messagedata.message}}
				</div>
			</div>
		</div>
        
    </div>
</template>
<script>
import bus from '../../bus';

export default {
	props:['messagedata'],
	data() {
		return{

		}
	},
    created(){
		console.log('view message');
		console.log(this.messagedata);
	},
	watch: {
		messagedata(val){
			console.log(val);
			console.log('change???');
			this.getMessageContent();
		}
	},
	methods:{
		getMessageContent(){
			console.log('data');
			let gun = this.$root.$gun;
			console.log(this.messagedata);

			//gun.get(this.messageid).once(data=>{
				//console.log('content!');
				//console.log(data);
			//});

		},
    },
}
</script>
<style lang="scss">

</style>