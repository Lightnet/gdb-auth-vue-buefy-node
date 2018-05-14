<template>
	<div class="columns">
		<div class="column is-four-fifths">
			<b-input
				type="textarea"
				:value="value"
				v-on="inputListeners"
			></b-input>
		</div>
		<div class="column">
			<button class="button is-primary" @click="$emit('enterchat',chatmessage)"> Chat </button>
		</div>
	</div>
</template>

<script>
//event on and emit global
//import bus from '../../bus';

export default {
	props: {
    	value: {
      		type: String,
      		default: '',
    	}
  	},
	data() {
		return{
			chatmessage:'test message',
		}
	},
	computed: {
    	inputListeners: function () {
      		var vm = this;
      		// `Object.assign` merges objects together to form a new object
      		return Object.assign({},
        	// We add all the listeners from the parent
        	this.$listeners,
        	// Then we can add custom listeners or override the
        	// behavior of some listeners.
        	{
          		// This ensures that the component works with v-model
          		input: function (event) {
					//console.log(event);
            		//vm.$emit('input', event.target.value);//doesn't work with http://element.eleme.io
					vm.$emit('input', event);
          		}
        	})
    	}
  	}
}
</script>
<style lang="scss">
.wrap{
	content: "HTML";
}
</style>
