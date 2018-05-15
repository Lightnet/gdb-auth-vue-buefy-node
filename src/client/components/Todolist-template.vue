<template id="todolistapp">
	<div v-if="$root.blogin">
		<h1>My To do List!</h1>
		<TodoList/>
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
import TodoList from './todolist/TodoList.vue'

export default {
	components: {
		TodoList
	}
}
</script>

<style lang="scss">

</style>