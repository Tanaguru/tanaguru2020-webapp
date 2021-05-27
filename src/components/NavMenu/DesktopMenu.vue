<template>
    <nav role="navigation" class="nav" aria-label="menu-principal">
        <div>
            <router-link :to="'/users/'+ $store.state.auth.user.id" v-if="$store.getters.isLoggedIn" class='link-independent nav__username' :aria-label="'Account settings for '+ currentUser+'\'s profile'">{{ currentUser }}</router-link>

            <Navbar :menuType="menuType" />
		</div>

		<div class="nav__picture" v-if="$store.getters.isLoggedIn">
			<router-link v-if="$store.state.auth.user.appRole.name == 'USER'" :to="'/users/'+ $store.state.auth.user.id" :aria-label="'Account settings for '+ currentUser+'\'s profile'" class="user-picture" style="background-image:url('https://i.ibb.co/f2HHwzx/collection-caracteres-bebe-dragon-dessines-main-23-2147831551-2.jpg?region=0,0,600,600')" />

			<router-link v-else-if="$store.state.auth.user.appRole.name == 'ADMIN'" :to="'/users/'+ $store.state.auth.user.id" :aria-label="'Account settings for '+ currentUser+'\'s profile'" class="user-picture" style="background-image:url('https://i.ibb.co/ZW7dgkw/baby-dragon-character-collection-with-flat-design-23-2147823681-2.jpg?region=0,0,600,600')" />

			<router-link v-else :to="'/users/'+ $store.state.auth.user.id" :aria-label="'Account settings for '+ currentUser+'\'s profile'" class="user-picture" style="background-image:url('https://i.ibb.co/kGq4gxY/tanaguru-logo-dragon-10x.png?region=0,0,600,600')" />
		</div>
    </nav>
</template>

<script>
import Navbar from '../Navbar'

  export default {
    name: 'DesktopMenu',
    components: {
    	Navbar,
  	},
    data(){
      return{
		menuOpen: false,
		menuType: "desktop"
      }
    },
    props: [ 'currentUser' ],
    methods: {
      toggleMenu() {
		this.menuOpen = !this.menuOpen;
		}
	}
  }
</script>

<style lang="scss" scoped>
.nav {
	display: flex;
	align-items: center;
	font-family: $font-stack-secondary;
	text-align: right;


	.nav__username {
		color: $text-primary;
		font-weight: 600;
	}

	.nav__picture {
		padding-left: 1.6rem;
		flex: 0 0 6.4rem;

		a {
			display: block;
			width: 6.4rem;
			height: 6.4rem;
			border-radius: 50%;
			background-position: center;
			background-repeat: no-repat;
			background-size: cover;
		}
	}
}
</style>
