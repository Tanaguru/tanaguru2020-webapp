<template>
	<ul class="navbar list-unstyled" v-if="$store.getters.isLoggedIn">
		<li class="navbar__item">
			<router-link exact to="/" class="link-independent link-independent--icon">
				<span>{{ $t('page.dashboard') }}</span>
			</router-link>
		</li>

		<li class="navbar__item with-button">
			<router-link 
				exact 
				to="/administration" 
				:class="$store.state.auth.user.appAccountType.name != 'FREE' ? 'link-independent link-independent--icon' : 'link-independent link-independent--icon disabled'" 
				:aria-disabled="$store.state.auth.user.appAccountType.name === 'FREE'" 
				:event="$store.state.auth.user.appAccountType.name != 'FREE' ? 'click' : ''"
			>
				<span>{{ $t('title.administration') }}</span>
			</router-link>
			<TrialTooltip spot="administration" v-if="$store.state.auth.user.expired" />
		</li>

		<li class="navbar__item" v-if="menuType == 'desktop'">
			<button class="btn btn--nude btn--icon" @click="logout">
				<icon-base-decorative>
					<icon-logout/>
				</icon-base-decorative>
				<span>{{ $t('action.logout') }}</span>
			</button>
		</li>
	</ul>

	<loginNavbar v-else></loginNavbar>
</template>

<script>
import LoginNavbar from './LoginNavbar'
import IconBaseDecorative from './icons/IconBaseDecorative'
import IconParameters from './icons/IconParameters'
import IconLogout from './icons/IconLogout'
import IconDashboard from './icons/IconDashboard'
import ModuleHelper from '../helper/ModuleHelper'
import TrialTooltip from '../components/TrialTooltip.vue'

export default {
	name: 'navbar',
	data() {
		return {
			locale: "en"
		}
	},
	props: ['menuType'],
	components: {
		LoginNavbar,
		IconBaseDecorative,
		IconParameters,
		IconLogout,
		IconDashboard,
		TrialTooltip
	},
	methods: {
		getModuleName: ModuleHelper.getModuleName,
		updateLocale: function () {
			this.bus.$emit("updateLocale", this.locale)
			this.$moment.locale(this.locale)
		},
		logout: function (event) {
			this.$store.dispatch('logout')
				.then(() => {
					if (this.$route.path !== '/')
						this.$router.push('/')
				})
		},
		moduleName(module){
			return this.getModuleName(module)
		}
	},
	computed: {
		onlineModule() {
			return this.$store.getters.getOnlineModules
		}
	}
}
</script>

<style lang="scss">
.navbar {
	color: $text-secondary;
	font-size: $medium-font-size;
	list-style: none;

	@media #{$media-lg-viewport} {
		display: flex;
		align-items: center;
		font-size: $small-font-size;
	}

	&__item {
		&:not(:last-child) {
			padding-right: .6rem;
		}
	}

	.router-link-active {
		background-color: $text-secondary;
		color: $color-white;

		.fill-color {
			fill: $color-white;
		}

		.stroke-color {
			stroke: $color-white;
		}
	}
}

.with-button {
	display: flex;
	align-items: center;

	div {
		margin-left: .5rem;
	}
}
</style>
