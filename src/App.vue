<template>
	<div id="app">
		<tng-header></tng-header>
		<router-view :key="$route.fullPath"></router-view>
		<tng-footer></tng-footer>

		<session-popup v-if="isSessionPopupVisible"/>
	</div>
</template>

<script>
import SessionPopup from "./components/SessionPopup";
import {bus} from './vue';
import TngHeader from "@/components/Header";
import TngFooter from "@/components/Footer";

export default {
	components: {
		TngFooter,
		TngHeader,
		SessionPopup,
		bus
	},
	data() {
		return {
			bus: bus,
			sessionTimer: null,
			sessionDuration: 3600000,
			currentDate: new Date(),
		}
	},
	created() {
		this.$store.dispatch('getServerVersion');
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
