<template>
    <div>
		<router-link exact to="/login" class="btn btn--default">
			<span>{{$t('action.login')}}</span>
		</router-link>

		<router-link v-for="module in offlineModule" :key="module" exact :to="'/external-module/' + module.name" class="btn btn--default">
			<span>{{module.name}}</span>
		</router-link>
    </div>
</template>

<script>
    export default {
        name: 'loginNavbar',
		computed: {
			offlineModule() {
				return this.$store.getters.getOfflineModules
			}
		}
	}
</script>
