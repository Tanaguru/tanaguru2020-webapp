<template>
	<ul class="navbar list-unstyled" v-if="$store.getters.isLoggedIn">
		<li class="navbar__item">
			<router-link exact to="/" class="link-independent link-independent--icon">
				<span>{{ $t('page.dashboard') }}</span>
			</router-link>
		</li>

		<li class="navbar__item">
			<router-link exact to="/administration" class="link-independent link-independent--icon">
				<span>{{ $t('title.administration') }}</span>
			</router-link>
		</li>

		<li v-for="module in onlineModule" :key="module.name" class="navbar__item">
		<router-link  exact :to="'/external-module/' + module.name"
					  class="link-independent link-independent--icon">
			<span>{{moduleName(module)}}</span>
		</router-link>
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

			&::after {
				content: '';
				display: block;
				margin: 1.2rem 0 1.2rem -#{$wrapper-spacing};
				width: 7.2rem;
				height: .1rem;
				background-color: $border-secondary;

				@media #{$media-lg-viewport} {
					display: inline-block;
					margin: 0 0 0 .6rem;
					vertical-align: middle;
					height: 1.2rem;
					width: .2rem;
				}
			}
		}
	}

	.router-link-active {
		color: $link-hover;
		font-weight: bolder;

		svg {
			.stroke-color {
				stroke: $link-hover;
			}
		}
	}
}
</style>
