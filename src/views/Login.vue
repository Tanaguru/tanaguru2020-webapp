<template>
	<main role="main" class="wrapper login">
		<div class="login__wrapper">
			<h1 class="login-title">
				<span class="login-title__headline">{{$t('global.siteName')}}</span>
				<span class="login-title__main" v-html="$t('login.title')"></span>
			</h1>
			<form class="login-form" @submit.prevent="login" novalidate>
				<p v-if="error" class="info-error" id="login-error" aria-live="polite">{{error}}</p>
				<div class="form-block">
					<label class="label" for="username">{{$t('login.labelId')}}</label>
					<p class="info-text">{{$t('login.caseSensitive')}}</p>
					<input
					class="input"
					v-bind:class="{'has-error':error}"
					id="username"
					autocomplete="username"
					required
					v-model="username"
					type="text"
					:placeholder="$t('entity.user.username')"
					:aria-describedby="error ? 'login-error' : ''"/>
				</div>

				<div class="form-block">
					<label class="label" for="password">{{$t('login.labelPassword')}}</label>
					<input
					id="password"
					class="input"
					v-bind:class="{'has-error':error}"
					autocomplete="current-password"
					required
					v-model="password"
					type="password"
					:placeholder="$t('entity.user.password')"
					aria-describedby="error ? login-error : ''"/>
				</div>

				<div class="login-form__footer">
					<button type="submit" class="btn btn--default btn--icon">
						<icon-base-decorative ><icon-logout /></icon-base-decorative>
						<span>{{$t('action.login')}}</span>
					</button>

					<router-link to="forgot-password" class="link-independent link-independent--icon">
						<icon-base-decorative ><icon-arrow-blue /></icon-base-decorative>
						<span>{{$t('login.password')}}</span>
					</router-link>
				</div>
			</form>
		</div>
 	</main>
</template>


<script>
import IconBaseDecorative from '../components/icons/IconBaseDecorative'
import IconLogout from '../components/icons/IconLogout'
import IconArrowBlue from '../components/icons/IconArrowBlue'

export default {
	name: 'login',
	components: {
		IconBaseDecorative,
		IconLogout,
		IconArrowBlue,
	},
	data(){
		return{
			username : "",
			password : "",
			error: ""
		}
	},
	methods: {
		login: function () {
			let username = this.username
			let password = this.password
			this.$store.dispatch('login', {username, password})
			.then(() => this.$router.push(this.$route.query.from || '/'))
			.catch(err => this.error = this.$i18n.t("login.incorrectLogin"))
		}
	},
	metaInfo(){
		return {
			// if no subcomponents specify a metaInfo.title, this title will be used
			title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.login"),
		}
	}
}
</script>

<style scoped lang="scss">
.login {
	.login__wrapper {
		margin: 0 auto;
		padding-top: 2.3rem;
		max-width: 45rem;

		@media #{$media-md-viewport} {
			padding-top: 13.6rem;
		}
	}
}

.login-title {
	margin: 0 0 2.2rem 0;
	font-weight: 300;

	&::after {
		display: block;
		margin-top: 2.6rem;
		width: 5.3rem;
		height: .4rem;
		background-color: $border-secondary;
		content: "";
	}

	.login-title__headline,
	.login-title__main {
		display: block;
	}

	.login-title__headline {
		margin-bottom: .8rem;
		font-size: .5em;
	}
}

.login-form {
	.login-form__footer {
		display: flex;
		align-items: center;
		flex-wrap: wrap;

		.btn,
		.link-independent {
			margin-bottom: 1.6rem;
		}

		.btn {
			margin-right: 1.6rem;
		}
	}
}
</style>
