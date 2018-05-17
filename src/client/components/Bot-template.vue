<template>
	<div>
		<div v-if="blogin">
			<button class="button">Status</button>
			<button class="button">Commands</button>
			<button class="button">DataBase</button>
			<button class="button">Scripts</button>
			<button class="button">Help</button>
			<button class="button">Settings</button>


			<div class="container">
				<component :is="currentView"></component>
			</div>
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
	</div>
</template>
<script>
//import bus from '../../bus';

import BotStatus from './bot/BotStatus-template.vue';

export default {
	props:[],
	data() {
		return{
			blogin:false,
			bdisplaydatabase:false,
			currentView:'botstatus',
		}
    },
	components:{
		'botstatus':BotStatus,
	},
    created(){
		if(this.$root.blogin){
			this.blogin = true;
		}else{
			
		}
	},
	methods:{

    },
}
</script>
<style lang="scss">

</style>
