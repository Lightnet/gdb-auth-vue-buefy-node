<template>
    <div>
        <div id="messagescroll" style="overflow-y: scroll;">
            <label class="label is-text">Messages:</label>
            <div class="card" v-for="message in messages" :key="message.id">
                <div>
                <label class="button is-text" @click="$emit('viewmessage',message)">From: {{ message.from }} </label>
                <label class="button is-text" @click="$emit('viewmessage',message)"> {{ message.subject }} </label>

                <a class="icon" style="float: right;" v-if="aliasid!=message.owner" v-on:click="$emit('deletemessage',message)">
                    <b-icon
                        pack="fas"
                        icon="trash"
                        >
                    </b-icon>
                </a>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
// private messsage list from contacts
export default {
    props:['messages','aliasid'],
    data(){
        return{
            messagescrollid:'messagescroll',
        }
    },
    mounted(){
		window.addEventListener('resize', this.handleResize);
		this.handleResize();
    },
    methods:{
		handleResize(event){
			if(!document.getElementById(this.messagescrollid))
				return;
			if(window.innerHeight > 400){
				let scrollheight = window.innerHeight - 250;
				document.getElementById(this.messagescrollid).style.height = scrollheight + 'px';
			}
        },
    },
    beforeDestroy() {
		//console.log('beforeDestroy');
  		window.removeEventListener('resize', this.handleResize);
	}
}
</script>

