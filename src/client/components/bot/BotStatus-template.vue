<template>
	<div>
        <label class="label">Bot Status: {{botstatus}}</label>
    </div>
</template>
<script>
import bus from '../../bus';

export default {
	props:[],
	data() {
		return{
			botstatus:'offline',
		}
    },
    created(){
		
	},
	methods:{

    },
}
</script>
<style lang="scss">

</style>