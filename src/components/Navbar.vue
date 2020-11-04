<template>
	<ul class="navbar list-unstyled" v-if="$store.getters.isLoggedIn">
		<li class="navbar__item" v-for="navbarLink in showableNavbarLinks" :key="navbarLink.id">
			<router-link exact v-if="navbarLink.isInternal" :to="navbarLink.url" class="link-independent link-independent--icon">
				<span>{{navbarLink.i18n && navbarLink.i18n[$i18n.locale] ? navbarLink.i18n[$i18n.locale] : $t(navbarLink.name)}}</span>
			</router-link>
			<router-link v-else :to="navbarLink.url" class="link-independent link-independent--icon">
				<span>{{navbarLink.i18n && navbarLink.i18n[$i18n.locale] ? navbarLink.i18n[$i18n.locale] : $t(navbarLink.name)}}</span>
			</router-link>
		</li>

		<li class="navbar__item" v-if="menuType == 'desktop'">
			<button class="btn btn--nude btn--icon" @click="logout">
				<icon-base-decorative ><icon-logout /></icon-base-decorative>
				<span>{{$t('action.logout')}}</span>
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

export default {
    name: 'navbar',
    data(){
    return{
      locale : "en"
    }
  },
  props: [ 'menuType' ],
    components: {
		LoginNavbar,
		IconBaseDecorative,
		IconParameters,
		IconLogout,
		IconDashboard,
	},
    methods: {
        updateLocale : function(){
            this.$i18n.locale = this.locale;
            this.moment.locale(this.locale)
		},
        logout : function(event){
            this.$store.dispatch('logout')
			.then(() => {
				if (this.$route.path !== '/')
					this.$router.push('/')
			})
        }
	},
	computed: {
    	showableNavbarLinks() {
    		return this.NAVBAR_LINKS.filter((navbarLink) =>{
    			return navbarLink.showOnline &&
						(
								!navbarLink.requiredAuthorities ||
								navbarLink.requiredAuthorities.every((authority) =>{
									return Object.keys(this.$store.state.auth.authorities).includes(authority);
								})
						);

			})
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

		svg {
			.stroke-color {
				stroke: $link-hover;
			}
		}
	}
}
</style>
