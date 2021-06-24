<template>
	<main class="wrapper" id="page" role="main">
		<div id="frame-container">
			<iframe ref="iframe" :src="moduleData.url"></iframe>
		</div>
	</main>
</template>

<script>
import router from "@/router/index";

export default {
	name: "ExternalModule",
	data() {
		return {
			moduleData: null
		}
	},
	created() {
		let moduleName = this.$route.params.name;
		this.moduleData = this.$store.getters.getModuleByName(moduleName)
	},
	mounted() {
		window.addEventListener('message', this.onMessage, false)
		this.onChangeLocale();
	},
	methods: {
		onMessage(e) {
			let message = e.data;
			if(this.$refs.iframe != undefined){
				switch (message.name) {
					case 'on-module-mounted':
						this.$refs.iframe.style.height = message.height + "px"
						this.setIframeLocale(localStorage.getItem('locale'))
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
		onChangeLocale(){
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
			this.$refs.iframe.contentWindow.postMessage({'name': 'init-locale','locale': locale}, '*')
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
