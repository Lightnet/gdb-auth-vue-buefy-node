<template>
  	<li>
		<div class="card">
			<div class="card-content">
				<span v-if="!todo.bedit">{{ todo.text }}</span>
				<b-input v-if="todo.bedit" v-model="todo.text" :id="todo.id" v-on="inputListeners"></b-input>
				<span style="float: right; padding: 3px 0">
				<button class="button is-primary" @click="$emit('edit', todo.id)">
					<b-icon
						pack="fas"
						icon="edit">
					</b-icon>
				</button>
				<button class="button is-danger" @click="$emit('remove', todo.id)">
					<b-icon
						pack="fas"
						icon="trash">
					</b-icon>
				</button>
				</span>
			</div>
		</div>
  	</li>
</template>

<script>
export default {
  	props: {
    	todo: {
      		type: Object,
      		required: true
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