<template>
	<div id="app">
		<tng-header></tng-header>
		
		<ExpiredTrial v-if="$store.getters.isLoggedIn && $store.state.auth.user.expired === true"/>

		<router-view></router-view>
		<tng-footer></tng-footer>

		<session-popup v-if="isSessionPopupVisible"/>
	</div>
</template>

<script>
import SessionPopup from "./components/SessionPopup";
import TngHeader from "@/components/Header";
import ExpiredTrial from "@/components/ExpiredTrial"
import TngFooter from "@/components/Footer";

export default {
	components: {
		TngFooter,
		TngHeader,
		ExpiredTrial,
		SessionPopup
	},
	data() {
		return {
			sessionTimer: null,
			sessionDuration: 3600000,
			currentDate: new Date(),
		}
	},
	created() {
		console.log(this.$store.state)
		let _locale = localStorage.getItem("locale") || "en"
		this.$moment.locale(_locale)
		this.$i18n.locale = _locale

		this.bus.$on("updateLocale", (locale) => {
			this.$i18n.locale = locale;
			this.$moment.locale(this.locale)
			localStorage.setItem("locale", locale);
		})
		this.$store.dispatch('getServerVersion');
		this.$store.dispatch('getWebextVersion');
		this.configService.getSessionDuration(
			(sessionDuration) => {
				this.sessionDuration = sessionDuration * 1000
			},
			(error) => {
				console.error(error)
			}
		)
		this.sessionTimer = setInterval(this.refreshCurrentDate, 10000);
	},
	computed: {
		isSessionPopupVisible() {
			// Show window 5 mn before timeout
			return this.$store.state.auth.user &&
				this.$store.state.auth.loginDate &&
				this.currentDate.getTime() > this.$store.state.auth.loginDate.getTime() + this.sessionDuration - 300000;
		},

		isSessionTimedOut() {
			return this.$store.state.auth.user &&
				this.$store.state.auth.loginDate &&
				this.currentDate.getTime() > this.$store.state.auth.loginDate.getTime() + this.sessionDuration;
		}
	},
	methods: {
		refreshCurrentDate() {
			this.currentDate = new Date();
			if (this.isSessionTimedOut) {
				this.$store.dispatch("logout")
			}
		}
	},
	beforeDestroy() {
		clearInterval(this.timer)
	},
}
</script>

<style lang="scss">
@import "@/scss/style.scss";
</style>
