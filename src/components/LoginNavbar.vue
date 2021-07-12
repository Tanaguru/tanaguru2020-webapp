<template>
    <div>
		<router-link v-for="module in orderedModules" :key="module.name" exact :to="'/external-module/' + module.name" class="btn btn--default">
			<span>{{moduleName(module.i18n)}}</span>
		</router-link>

		<router-link exact to="/login" class="btn btn--default">
			<span>{{$t('action.login')}}</span>
		</router-link>
    </div>
</template>

<script>
    export default {
        name: 'loginNavbar',
		computed: {
			offlineModule() {
				return this.$store.getters.getOfflineModules
			},
			orderedModules(){
				return this.offlineModule.sort((a, b) => { return b.number < a.number;});
			}
		},
		methods:{
			moduleName(traductions){
				var moduleName = traductions.en;
				if(this.$i18n.locale == 'fr'){
					moduleName = traductions.fr;
				}else if( this.$i18n.locale == 'es'){
					moduleName = traductions.es;
				}else if( this.$i18n.locale == 'en'){
					moduleName = traductions.en;
				}
				return moduleName;
			}
		}
	}
</script>
