<template>
  <header class="header" role="banner">
	<banner></banner>
	<div class="header__wrapper">
		<router-link to='/' class="header-logo">
			<img src="/assets/images/logo-desktop.svg" :alt="$t('global.logoAlt')" role="img" />
		</router-link>

		<DesktopMenu v-if="window.width > 992" :currentUser="currentUser"/>
		<MobileMenu class="header-menu" v-else :currentUser="currentUser" />
	</div>
  </header>
</template>

<script>
import Banner from './Banner'
import DesktopMenu from './NavMenu/DesktopMenu'
import MobileMenu from './NavMenu/MobileMenu'

export default {
	name: 'tngHeader',
	components: {
		Banner,
		DesktopMenu,
		MobileMenu,
  	},
	data(){
		return{
			locale : "en",
			window : {
				width: null
			},
		}
	},
    methods: {
		handleResize() {
			this.window.width = window.innerWidth;
		}
    },
    computed: {
		currentUser() {
			if(this.$store.getters.isLoggedIn) {
				return this.$store.state.auth.user.username;
			}
		}
	},
	created() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    }
}
</script>

<style lang="scss" scoped>
.header {
	border-bottom: .1rem solid $border-secondary;

	.header__wrapper {
		display: flex;
		margin: 0 auto;
		padding: 1.6rem 2.4rem;
		max-width: $wrapper-width;
		align-items: center;
		justify-content: space-between;

		@media #{$media-wrapper-viewport} {
			padding: 1.6rem $wrapper-spacing;
		}

	}
}

.header-logo {
	display: block;
	flex: 0 1 auto;

	img {
		width: 15rem;

		@media #{$media-md-viewport} {
			width: 22.3rem;
		}
	}
}

.header-menu {
	flex: 0 0 auto;
}
</style>
