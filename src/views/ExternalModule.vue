<template>
	<main id="page" role="main">
		<div id="frame-container">
			<iframe v-if="moduleData" ref="iframe" :title="moduleData.name" :src="moduleData.url"></iframe>
		</div>
	</main>
</template>

<script>
import router from "@/router/index";

export default {
	name: "ExternalModule",
	mounted() {
		window.addEventListener('message', this.onMessage, false)
		this.onLocaleChangeUpdateIframeLocale();
	},
	methods: {
		onMessage(e) {
			let message = e.data;
			console.log('msg : ', message)
			if(this.$refs.iframe != undefined){
				switch (message.name) {
					case 'on-module-mounted':
						this.setIframeLocale(localStorage.getItem('locale'))
						break;
					case 'on-resize':
						this.$refs.iframe.style.height = message.height + "px";
						break;
					case 'on-oauth2-auth-success':
						this.$store.commit('auth_success', {token: message.token ,user: message.user})
						localStorage.setItem('method','oauth2')
						router.push('/')
						break;
					case 'on-oauth2-auth-error':
						this.$store.commit('auth_error')
						break;
					case 'on-oauth2-auth-request':
						this.$store.commit('auth_request')
						break;
				}
			}
		},
		onLocaleChangeUpdateIframeLocale(){
			this.bus.$on("updateLocale", (locale) => {
				let message = {
					'name': 'locale-change',
					'locale': locale
				}
				if(this.$refs.iframe != null){
					this.$refs.iframe.contentWindow.postMessage(message, '*')
				}
			})
		},
		setIframeLocale(locale){
			locale = locale ? locale : this.$i18n.locale;
			this.$refs.iframe.contentWindow.postMessage({'name': 'init-locale','locale': locale}, '*')
		}
	},
	computed: {
		moduleData() {
			let moduleName = this.$route.params.name;
			return this.$store.getters.getModuleByName(moduleName)
		}
	}
}
</script>

<style scoped>

iframe {
	width: 100%;
	border: 0;
}
</style>
