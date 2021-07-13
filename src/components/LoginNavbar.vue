<template>
    <div>
		<router-link v-for="module in orderedModules" :key="module.name" exact :to="'/external-module/' + module.name" class="btn btn--default">
			<span>{{moduleName(module)}}</span>
		</router-link>

		<router-link exact to="/login" class="btn btn--default">
			<span>{{$t('action.login')}}</span>
		</router-link>
    </div>
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
