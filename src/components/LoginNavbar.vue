<template>
    <ul class="navbar list-unstyled">
		<li class="navbar__item" v-for="module in orderedModules" :key="module.name">
			<router-link exact :to="'/external-module/' + module.name" class="btn btn--default">
				<span>{{moduleName(module)}}</span>
			</router-link>
		</li>
		<li class="navbar__item">
			<router-link exact to="/login" class="btn btn--default">
				<span>{{$t('action.login')}}</span>
			</router-link>
		</li>
    </ul>
</template>

<script>
import ModuleHelper from '../helper/ModuleHelper';
export default {
    name: 'loginNavbar',
	computed: {
		offlineModule() {
			return this.$store.getters.getOfflineModules
		},
		orderedModules(){
			return this.offlineModule.sort((a, b) => { return b.priorityNumber < a.priorityNumber;});
		}
	},
	methods:{
		getModuleName: ModuleHelper.getModuleName,
		moduleName(module){
			return this.getModuleName(module);
		}
	}
}
</script>