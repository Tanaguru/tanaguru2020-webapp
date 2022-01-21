<template>
    <nav role="navigation" :class="burgerOpen ? 'nav is-active' : 'nav'" aria-label="$t('menu.open')" @keydown.esc="toggleMenu">
		<div class="nav__header">
			<span class="nav__title" v-if="burgerOpen">{{$t('menu.title')}}</span>
			<button
				:class="burgerOpen ? 'btn btn--nude btn-menu is-active' : 'btn btn--nude btn-menu'"
				:aria-expanded="burgerOpen"
				aria-controls="main-menu"
				@click="toggleMenu"
			>
				<span v-if="burgerOpen">{{$t('menu.close')}}</span>
				<span v-else>{{$t('menu.title')}}</span>
				<span aria-hidden="true" class="toggle">
					<span class="toggle__bar toggle__bar--top"></span>
					<span class="toggle__bar toggle__bar--middle"></span>
					<span class="toggle__bar toggle__bar--bottom"></span>
				</span>
			</button>
		</div>

		<div id="main-menu" :hidden="!burgerOpen" @click="toggleMenu">
			<div class="user-menu" v-if="$store.getters.isLoggedIn">
				<div class="user-menu__picture">
					<router-link v-if="$store.state.auth.user.appRole.name == 'USER'" :to="'/users/'+ $store.state.auth.user.id" :aria-label="$t('menu.account') + currentUser" :event="$store.state.auth.user.appAccountType.name != 'FREE' ? 'click' : ''" :aria-disabled="$store.state.auth.user.appAccountType.name === 'FREE'" :class="$store.state.auth.user.appAccountType.name != 'FREE' ? 'user-picture' : 'user-picture disabled'" style="background-image:url('https://i.ibb.co/f2HHwzx/collection-caracteres-bebe-dragon-dessines-main-23-2147831551-2.jpg?region=0,0,600,600')" />

					<router-link v-else-if="$store.state.auth.user.appRole.name == 'ADMIN'" :to="'/users/'+ $store.state.auth.user.id" :aria-label="$t('menu.account') + currentUser" :event="$store.state.auth.user.appAccountType.name != 'FREE' ? 'click' : ''" :aria-disabled="$store.state.auth.user.appAccountType.name === 'FREE'" :class="$store.state.auth.user.appAccountType.name != 'FREE' ? 'user-picture' : 'user-picture disabled'" style="background-image:url('https://i.ibb.co/ZW7dgkw/baby-dragon-character-collection-with-flat-design-23-2147823681-2.jpg?region=0,0,600,600')" />

					<router-link v-else :to="'/users/'+ $store.state.auth.user.id" :aria-label="$t('menu.account') + currentUser" :event="$store.state.auth.user.appAccountType.name != 'FREE' ? 'click' : ''" :aria-disabled="$store.state.auth.user.appAccountType.name === 'FREE'" :class="$store.state.auth.user.appAccountType.name != 'FREE' ? 'user-picture' : 'user-picture disabled'" style="background-image:url('https://i.ibb.co/kGq4gxY/tanaguru-logo-dragon-10x.png?region=0,0,600,600')" />
				</div>
				<router-link :to="'/#/users/'+ $store.state.auth.user.id" :event="$store.state.auth.user.appAccountType.name != 'FREE' ? 'click' : ''" :aria-disabled="$store.state.auth.user.appAccountType.name === 'FREE'" :class="$store.state.auth.user.appAccountType.name != 'FREE' ? 'link-independent user-menu__username' : 'link-independent user-menu__username disabled'" :aria-label="$t('menu.account') + currentUser">{{ currentUser }}</router-link>
			</div>

			<Navbar :menuType="menuType" v-if="$store.getters.isLoggedIn"/>

			<ul v-else class="navbar list-unstyled">
				<li v-for="module in orderedOfflineModules" :key="module.name" class="navbar__item">
					<router-link  exact :to="'/external-module/' + module.name"
								class="link-independent link-independent--icon">
						<span>{{moduleName(module)}}</span>
					</router-link>
				</li>
			</ul>
		</div>

		<div class="nav__bottom" :class="burgerOpen ? 'secondary-menu is-active' : 'secondary-menu'" >
			<div class="secondary-menu__item">
				<div class="">
					<label class="screen-reader-text" for="locale">{{$t('global.language.label')}}</label>
					<div class="select select--lang">
						<select v-model="locale" name="locale" id="locale" @change="updateLocale">
							<option value="en" lang="en">
							{{$t('global.language.english')}}
							</option>
							<option value="fr" lang="fr">
							{{$t('global.language.french')}}
							</option>
						</select>
					</div>
				</div>
			</div>

			<div class="secondary-menu__item">
				<button class="btn btn--nude btn--logout" @click="logout" v-if="$store.getters.isLoggedIn">
					{{$t('action.logout')}}
				</button>
				<button class="btn btn--nude btn--logout" @click="login" v-else>
					{{$t('action.login')}}
				</button>
			</div>
		</div>
    </nav>
</template>

<script>
import Navbar from '../Navbar';
import ModuleHelper from '../../helper/ModuleHelper';

  export default {
    name: 'MobileMenu',
    components: {
        Navbar
    },
    data(){
      return{
		burgerOpen: false,
		menuType: "mobile",
		locale : this.$i18n.locale
      }
    },
	props: [ 'currentUser' ],
	computed: {
		offlineModule() {
			return this.$store.getters.getOfflineModules
		},
		orderedOfflineModules(){
			return this.offlineModule.sort((a, b) => { return b.priorityNumber < a.priorityNumber;});
		}
	},
	methods: {
		getModuleName: ModuleHelper.getModuleName,
		toggleMenu() {
			const el = document.body;
			if(this.burgerOpen === true){
				this.burgerOpen = false
				el.classList.remove('noScroll');
				el.classList.add('scroll');
			} else {
				this.burgerOpen = true
				el.classList.add('noScroll');
				el.classList.remove('scroll');
			}
		},
		closeMenu() {
			if(this.burgerOpen === true){
				this.burgerOpen = false
			}
		},
        updateLocale : function(){
           this.bus.$emit("updateLocale", this.locale);
        },
        logout : function(event){
			this.toggleMenu()
            this.$store.dispatch('logout')
			.then(() => {
				if (this.$route.path !== '/')
					this.$router.push('/')
			})
		},
		login : function(event){
			this.toggleMenu()
			this.$router.push('/login')
		},
		moduleName(module){
			return this.getModuleName(module);
		}
	}
  }
</script>

<style lang="scss" scoped>
// Menu button
.btn-menu {
	color: $text-primary;
	text-transform: uppercase;

	> span {
		vertical-align: middle;
	}

	&.is-active {
		.toggle {
			.toggle__bar {
				&.toggle__bar--top {
					top: 50%;
					transform: rotate(45deg) translateY(-50%);
				}

				&.toggle__bar--middle {
					opacity: 0;
				}

				&.toggle__bar--bottom {
					bottom: 50%;
					transform: rotate(-45deg) translateY(50%);
				}
			}
		}
	}
}

// Toggle burger menu
.toggle {
	position: relative;
	display: inline-block;
	margin-left: 1rem;
	width: 2.8rem;
	height: 2.2rem;

	.toggle__bar {
		position: absolute;
		right: 0;
		left: 0;
		display: block;
		width: 2.8rem;
		height: .2rem;
		transform-origin: center;
		transition: transform .3s ease-out, opacity .3s ease-out;
		background-color: $text-secondary;

		&.toggle__bar--top {
			top: 0;
		}

		&.toggle__bar--middle {
			top: 50%;
			transform: translateY(-50%);
		}

		&.toggle__bar--bottom {
			bottom: 0;
		}
	}
}

// Navigation
.nav {
	&.is-active {
		position: fixed;
		z-index: 200;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		padding: 7rem 2.4rem 0;
		background-color: $bg-primary;
		background-image: url("#{$img-path}menu_background.png");
		background-repeat: no-repeat;
		background-position: top left;
		background-size: 60% auto;
	}

	.nav__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.nav__title {
		color: $text-secondary;
		font-size: 2.6rem;
		font-weight: 600;
		font-family: $font-stack-secondary;
	}

	.nav__bottom {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
	}
}

.user-menu {
	display: flex;
	margin: 1.6rem 0 2.4rem;
	align-items: center;

	.user-menu__picture {
		margin-right: .8rem;

		a {
			display: block;
			width: 4.8rem;
			height: 4.8rem;
			border-radius: 50%;
			background-position: center;
			background-repeat: no-repat;
			background-size: cover;
		}
	}

	.user-menu__username {
		color: $text-primary;
		font-size: $base-font-size;
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
	.user-picture {

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
}

.secondary-menu {
	display: none;
	border-top: 1px solid $border-secondary;
	text-align: center;

	&.is-active {
		display: flex;
		align-items: center;
	}

	.secondary-menu__item {
		flex: 0 0 50%;
		padding: 1.6rem;

		&:first-child {
			border-right: 1px solid $border-secondary;
		}

		.select {
			select {
				border: 0;
				color: $text-primary;
				text-align: center;
			}

			&::before,
			&::after {
				content: none;
			}
		}
	}
}
</style>
