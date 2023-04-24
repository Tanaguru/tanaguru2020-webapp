<template></template>
<script>
export default {
	name: 'logout',
	metaInfo() {
		return {
			// if no subcomponents specify a metaInfo.title, this title will be used
			title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.logout"),
		}
	},
	created() {
		this.$store.dispatch('logout').then(() => this.$router.push('/'))
	}
}
</script>
