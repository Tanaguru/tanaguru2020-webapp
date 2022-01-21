<template>
    <nav role="navigation" class="nav" aria-label="menu-principal">
        <div>
			<div class="with-button" v-if="$store.getters.isLoggedIn">
				<router-link :to="'/users/'+ $store.state.auth.user.id" :event="$store.state.auth.user.appAccountType.name != 'FREE' ? 'click' : ''" :aria-disabled="$store.state.auth.user.appAccountType.name === 'FREE'" :class="$store.state.auth.user.appAccountType.name != 'FREE' ? 'link-independent nav__username' : 'link-independent nav__username disabled'" :aria-label="$t('menu.account') + currentUser">{{ currentUser }}</router-link>
				<TrialTooltip spot="profil-text" v-if="$store.state.auth.user.appAccountType.name == 'FREE'"/>
			</div>
            <Navbar :menuType="menuType" />
		</div>

		<div class="nav__picture with-button" v-if="$store.getters.isLoggedIn">
			<router-link v-if="$store.state.auth.user.appRole.name == 'USER'" :to="'/users/'+ $store.state.auth.user.id" :aria-label="$t('menu.account') + currentUser" :event="$store.state.auth.user.appAccountType.name != 'FREE' ? 'click' : ''" :aria-disabled="$store.state.auth.user.appAccountType.name === 'FREE'" :class="$store.state.auth.user.appAccountType.name != 'FREE' ? 'user-picture' : 'user-picture disabled'" style="background-image:url('https://i.ibb.co/f2HHwzx/collection-caracteres-bebe-dragon-dessines-main-23-2147831551-2.jpg?region=0,0,600,600')" />

			<router-link v-else-if="$store.state.auth.user.appRole.name == 'ADMIN'" :to="'/users/'+ $store.state.auth.user.id" :aria-label="$t('menu.account') + currentUser" :event="$store.state.auth.user.appAccountType.name != 'FREE' ? 'click' : ''" :aria-disabled="$store.state.auth.user.appAccountType.name === 'FREE'" :class="$store.state.auth.user.appAccountType.name != 'FREE' ? 'user-picture' : 'user-picture disabled'" style="background-image:url('https://i.ibb.co/ZW7dgkw/baby-dragon-character-collection-with-flat-design-23-2147823681-2.jpg?region=0,0,600,600')" />

			<router-link v-else :to="'/users/'+ $store.state.auth.user.id" :aria-label="$t('menu.account') + currentUser"  :event="$store.state.auth.user.appAccountType.name != 'FREE' ? 'click' : ''" :aria-disabled="$store.state.auth.user.appAccountType.name === 'FREE'" :class="$store.state.auth.user.appAccountType.name != 'FREE' ? 'user-picture' : 'user-picture disabled'" style="background-image:url('https://i.ibb.co/kGq4gxY/tanaguru-logo-dragon-10x.png?region=0,0,600,600')" />
			<TrialTooltip spot="profil-pic" v-if="$store.state.auth.user.appAccountType.name == 'FREE'"/>
		</div>
    </nav>
</template>

<script>
import Navbar from '../Navbar'
import TrialTooltip from '../TrialTooltip.vue'

  export default {
    name: 'DesktopMenu',
    components: {
    	Navbar,
		TrialTooltip
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


	.nav__username, .user-picture {
		color: $text-primary;
		font-weight: 600;

		&.disabled {
			text-decoration: none;
			cursor: default;
			opacity: .7;

			&:hover {
				text-decoration: none;
				cursor: default;
			}
		}
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

.with-button {
	display: flex;
	align-items: center;
	justify-content: right;

	div {
		margin-left: .5rem;
	}
}
</style>
