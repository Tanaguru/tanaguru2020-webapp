<template>
	<div class="modal-content">
		<header class="modal-header" id="modalTitle">
			<h1 class="modal-header__title">{{$t('dashboard.project.team')}}</h1>
			<button type="button" class="btn btn--nude btn--icon" @click="closeModal" :aria-label="$t('action.closeModal')">
				<icon-base-decorative width="18" height="18"><icon-close /></icon-base-decorative>
				<span>{{$t('action.close')}}</span>
			</button>
		</header>
		<section class="modal-body" id="modalDescription">
			<ul class="team-list list-unstyled">
				<li class="team-list__item" v-for="(user) in users" :key="user.contractAppUser.id">
					<router-link :to="'/users/' + user.contractAppUser.user.id" :aria-label="user.contractAppUser.user.username + ' profile'">

						<span v-if="user.contractAppUser.user.appRole.name == 'USER'" class="team-list__picture" style="background-image:url('https://i.ibb.co/f2HHwzx/collection-caracteres-bebe-dragon-dessines-main-23-2147831551-2.jpg')"></span>

						<span v-else-if="user.contractAppUser.user.appRole.name == 'ADMIN'" class="team-list__picture" style="background-image:url('https://i.ibb.co/ZW7dgkw/baby-dragon-character-collection-with-flat-design-23-2147823681-2.jpg')"></span>

						<span v-else class="team-list__picture" style="background-image:url('https://i.ibb.co/kGq4gxY/tanaguru-logo-dragon-10x.png')"></span>

						<span class="team-list__name">{{ user.contractAppUser.user.username }}<br />{{ user.projectRole.name.charAt(0) + user.projectRole.name.slice(1).toLowerCase().replace(/_/g,' ') }}</span>
					</router-link>
				</li>
			</ul>
		</section>
	</div>
</template>

<script>
import IconBaseDecorative from './icons/IconBaseDecorative'
import IconClose from './icons/IconClose'

  export default {
    name: 'modal',
	components: {
		IconBaseDecorative,
		IconClose
	},
    props: {
        users: {
            type: Array,
            required: true
        }
    },
    methods: {
        closeModal() {
            this.$modal.close();
        }
    },
  };
</script>

<style lang="scss" scoped>
.team-list {
	display: flex;
	flex-wrap: wrap;
	font-size: $small-font-size;
	list-style-type: none;

	.team-list__item {
		width: 100%;
		margin-bottom: 3.2rem;

		@media #{$media-sm-viewport} {
			width: 50%;
		}

		@media #{$media-lg-viewport} {
			width: calc(100% / 3);
		}

		@media only screen and (min-width:90em) {
			width: 25%;
		}

		a {
			display: inline-block;
		}
	}

	.team-list__picture {
		display: inline-block;
		margin-right: 1.6rem;
		width: 7rem;
		height: 7rem;
		border-radius: 50%;
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		vertical-align: middle;
	}

	.team-list__name {
		display: inline-block;
		font-family: $font-stack-secondary;
		line-height: 1.2;
		vertical-align: middle;
	}
}
</style>
