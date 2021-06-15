<template>
	<main class="wrapper" id="page" role="main">
		<div v-if="checkDisplayAllowed" id="frame-container">
			<iframe ref="iframe" :src="moduleData.url"></iframe>
		</div>

		<div v-else></div>
	</main>
</template>

<script>
export default {
	name: "ExternalModule",
	data() {
		return {
			moduleData: null
		}
	},
	created() {
		let moduleName = this.$route.params.name;
		this.moduleData = this.$store.getters.getModuleByName(moduleName);

	},
	mounted() {
		window.addEventListener('message', this.onMessage, false)
	},
	computed: {
		checkDisplayAllowed() {
			return true
		}
	},
	methods: {
		onMessage(e) {
			let message = e.data;
			switch (message.name) {
				case 'on-module-mounted':
					this.$refs.iframe.style.height = message.height + "px"
					break;
			}
		},
	}
}
</script>

<style scoped>

iframe {
	width: 100%;
	border: 0;
}
</style>
