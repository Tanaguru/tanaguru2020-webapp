<template>
	<div>
		<p>{{ $t('form.indications.help') }}</p>

		<form @submit.prevent="createUser" novalidate>
			<div class="form-row">
				<div class="form-column">
					<div class="form-block">
						<label class="label" for="username">{{ $t('entity.user.username') }} *</label>
						<input
							class="input"
							v-bind:class="{'has-error': userCreateForm.usernameError}"
							:aria-describedby="usernameDescribedBy"
							type="text"
							name="username"
							id="username"
							:placeholder="$t('entity.user.username')"
							v-model="userCreateForm.username"
							required>
						<p class="info-text" id="username-constraint">{{ $t('form.indications.usernameConstraint') }}</p>
						<p v-if="userCreateForm.usernameError" id="username-error" class="info-error">
							{{ userCreateForm.usernameError }}</p>
					</div>
				</div>

				<div class="form-column">
					<div class="form-block">
						<label class="label" for="email">{{ $t('entity.user.email') }} *</label>
						<input
							class="input"
							v-bind:class="{'has-error': userCreateForm.emailError}"
							:aria-describedby="emailDescribedBy"
							type="email"
							name="email"
							id="email"
							:placeholder="$t('entity.user.email')"
							v-model="userCreateForm.email"
							required>
						<p id="email-constraint" class="info-text">(exemple: nom.prenom@boitemail.com)</p>
						<p v-if="userCreateForm.emailError" id="email-error" class="info-error">
							{{ userCreateForm.emailError }}</p>
					</div>
				</div>
			</div>

			<div class="form-row">
				<div class="form-column">
					<div class="form-block">
						<label class="label" for="password">{{ $t('entity.user.password') }} *</label>
						<input
							class="input"
							v-bind:class="{'has-error': userCreateForm.passwordError}"
							type="password"
							:aria-describedby="passwordDescribedBy"
							name="password"
							id="password"
							:placeholder="$t('entity.user.password')"
							v-model="userCreateForm.password"
							required>
						<p class="info-text">{{ $t('form.indications.passwordConstraint') }}</p>
						<p v-if="userCreateForm.passwordError" id="password-error" class="info-error">
							{{ userCreateForm.passwordError }}</p>
					</div>
				</div>

				<div class="form-column" v-show="this.$store.state.auth.authorities['PROMOTE_USER']">
					<div class="form-block">
						<label class="label" for="role-select">{{ $t('entity.user.status') }} *</label>
						<div class="select">
							<select
								id="role-select"
								v-bind:class="{'has-error': userCreateForm.roleError}"
								name="status-select"
								:describedBy="userCreateForm.roleError ? 'role-error' : ''"
								v-model="userCreateForm.appRole"
								:key="'role-error'"
								required>
								<option value="">{{ $t('entity.user.selectStatus') }}</option>
								<option value="SUPER_ADMIN">{{ $t('entity.user.role.superAdmin') }}</option>
								<option value="ADMIN">{{ $t('entity.user.role.admin') }}</option>
								<option value="USER">{{ $t('entity.user.role.user') }}</option>
							</select>
						</div>
						<p v-if="userCreateForm.roleError" id="role-error" class="info-error">
							{{ userCreateForm.roleError }}</p>
					</div>
				</div>
			</div>

			<fieldset class="checkbox-wrapper">
				<legend class="checkbox-wrapper__legend">{{ $t('entity.user.enabled') }}</legend>
				<div class="checkbox">
					<input
						class="checkbox__input"
						type="checkbox"
						name="enabled"
						id="enabled"
						v-model="userCreateForm.enabled">
					<label class="checkbox__label" for="enabled">{{ $t('entity.user.enabled') }}</label>
				</div>
			</fieldset>

			<button class="btn btn--default btn-create" type="submit">{{ $t('action.create') }}</button>
			<p class="info-success" id="form-success" v-if="userCreateForm.successMsg">{{ userCreateForm.successMsg }}</p>
			<p v-if="userCreateForm.error" class="info-error" id="form-error">{{ userCreateForm.error }}</p>
		</form>
	</div>
</template>

<script>
import EmailHelper from '../../helper/emailHelper';
import PasswordHelper from '../../helper/PasswordHelper';

export default {
	name: 'userCreationForm',
	components: {
		EmailHelper,
		PasswordHelper
	},
	data() {
		return {
			userCreateForm: {
				username: "",
				password: "",
				email: "",
				appRole: null,
				enabled: false,
				successMsg: "",
				error: "",
				emailError: "",
				passwordError: "",
				usernameError: "",
				roleError: ""
			}
		}
	},
	props: [ 'selected' ],
	watch: {
    	selected: function(newVal, oldVal) {  
			if(newVal == 1) {
			this.userCreateForm.username = ""
			this.userCreateForm.password = ""
			this.userCreateForm.email = ""
			this.userCreateForm.appRole = ""
			this.userCreateForm.enabled = ""
			this.userCreateForm.usernameError = ""
			this.userCreateForm.passwordError = ""
			this.userCreateForm.emailError = ""
			this.userCreateForm.roleError = ""
			this.userCreateForm.error = ""
			this.userCreateForm.successMsg = ""
			} 
		}
	},
	computed: {
		emailDescribedBy() {
			let description = 'email-constraint';
			if (this.userCreateForm.emailError) {
				description = 'email-error email-constraint'
			}
			return description;
		},
		passwordDescribedBy() {
			let description = 'password-constraint';
			if (this.userCreateForm.passwordError) {
				description = 'password-error'
			}
			return description;
		},
		usernameDescribedBy() {
			let description = 'username-constraint';
			if (this.userCreateForm.usernameError) {
				description = 'username-error'
			}
			return description;
		},
	},
	created(){
		if(this.$store.state.auth.authorities['CREATE_CONTRACT']){
			this.userCreateForm.appRole = null;
		} else {
			this.userCreateForm.appRole = 'User'
		}
	},
	methods: {
        checkValidEmail: EmailHelper.checkValidEmail,
		checkValidPassword: PasswordHelper.checkValidPassword,
		checkUsername(){
			this.userCreateForm.usernameError = "";
			if (!this.userCreateForm.username) {
				this.userCreateForm.usernameError = this.$i18n.t("form.errorMsg.emptyInput");
				return false;
			}

			if (this.userCreateForm.username.length < 4 || this.userCreateForm.username.length > 30) {
				this.userCreateForm.usernameError = this.$i18n.t("form.errorMsg.username.usernameError");
				return false;
			}
			return true;
		},
		checkEmail(){
			this.userCreateForm.emailError = "";
			if (!this.userCreateForm.email) {
				this.userCreateForm.emailError = this.$i18n.t("form.errorMsg.emptyInput");
				return false;
			}

			if (!this.checkValidEmail(this.userCreateForm.email)) {
				this.userCreateForm.emailError = this.$i18n.t("form.indications.emailConstraint");
				return false;
			}
			return true;
		},
		checkPassword(){
			this.userCreateForm.passwordError = "";
			if (!this.userCreateForm.password) {
				this.userCreateForm.passwordError = this.$i18n.t("form.errorMsg.emptyInput")
				return false;
			}

			if (!this.checkValidPassword(this.userCreateForm.password)) {
				this.userCreateForm.passwordError = this.$i18n.t("form.indications.passwordConstraint")
				return false;
			}
			return true;
		},
		checkStatus(){
			this.userCreateForm.roleError = "";
			if (!this.userCreateForm.appRole) {
				this.userCreateForm.roleError = this.$i18n.t("form.errorMsg.emptyInput")
			}
			return true;
		},
		createUser: function () {
			this.userCreateForm.error = "";
			this.userCreateForm.successMsg = "";

			let isFormValid = this.checkUsername();
			isFormValid &= this.checkEmail();
			isFormValid &= this.checkPassword();
			isFormValid &= this.checkStatus();

			if(isFormValid){
				this.userService.create(
					this.userCreateForm.username,
					this.userCreateForm.email,
					this.userCreateForm.password,
					this.userCreateForm.appRole,
					this.userCreateForm.enabled,
					(user) => {
						this.$emit('createUser', user)
						this.userCreateForm.successMsg = this.$i18n.t("form.successMsg.userCreation")
					},
					(error) => {
						this.userCreateForm.error = this.$i18n.t("form.errorMsg.genericError");
						if(error.response.data.error){
							switch(error.response.data.error){
								case this.userService.USERNAME_ALREADY_EXISTS:
									this.userCreateForm.usernameError = this.$i18n.t("form.errorMsg.username.existingUsername");
									break;

								case this.userService.EMAIL_ALREADY_EXISTS:
									this.userCreateForm.emailError = this.$i18n.t("form.errorMsg.email.existingEmail");
									break;

								default:
									console.error(error)
							}
						}

					}
				)
			}
			this.userCreateForm.username = "";
			this.userCreateForm.email = "";
			this.userCreateForm.appRole = "";
			this.userCreateForm.enable = "";
		},
	}
}
</script>
