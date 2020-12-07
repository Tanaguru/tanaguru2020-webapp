<template>
    <article class="admin-users">
		<header>
			<h1>{{$t('page.adminUser')}}</h1>
		</header>

		<section>
			<h2 class="admin-users__title-2">{{$t('users.createUser')}}</h2>

			<p>{{$t('form.help')}}</p>

			<div v-if="$store.state.auth.authorities['CREATE_USER']" id="contract-user-form">
				<form @submit.prevent="createUser" novalidate>
					<div class="form-row">
						<div class="form-column">
							<div class="form-block">
								<label class="label" for="username">{{$t('entity.user.username')}} *</label>
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
								<p class="info-text" id="username-constraint">{{ $t('form.usernameConstraint') }}</p>
								<p v-if="userCreateForm.usernameError" id="username-error" class="info-error">{{userCreateForm.usernameError}}</p>
							</div>
						</div>

						<div class="form-column">
							<div class="form-block">
								<label class="label" for="email">{{$t('entity.user.email')}} *</label>
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
								<p v-if="userCreateForm.emailError" id="email-error" class="info-error">{{userCreateForm.emailError}}</p>
							</div>
						</div>
					</div>

					<div class="form-row">
						<div class="form-column">
							<div class="form-block">
								<label class="label" for="password">{{$t('entity.user.password')}} *</label>
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
								<p class="info-text">{{ $t('form.passwordConstraint') }}</p>
								<p v-if="userCreateForm.passwordError" id="password-error" class="info-error">{{userCreateForm.passwordError}}</p>
							</div>
						</div>

						<div class="form-column">
							<div class="form-block">
								<label class="label" for="role-select">{{$t('entity.user.status')}} *</label>
								<div class="select">
									<select
                                        id="role-select"
                                        v-bind:class="{'has-error': userCreateForm.roleError}"
                                        name="status-select"
                                        :describedBy="userCreateForm.roleError ? 'role-error' : ''"
                                        v-model="userCreateForm.appRole"
                                        :key="'role-error'"
                                        required>
										<option value="">{{$t('entity.user.selectStatus')}}</option>
										<option value="SUPER_ADMIN">{{$t('entity.user.role.superAdmin')}}</option>
										<option value="ADMIN">{{$t('entity.user.role.admin')}}</option>
										<option value="USER">{{$t('entity.user.role.user')}}</option>
									</select>
								</div>
								<p v-if="userCreateForm.roleError" id="role-error" class="info-error">{{userCreateForm.roleError}}</p>
							</div>
						</div>
					</div>

                    <fieldset class="checkbox-wrapper">
						<legend class="checkbox-wrapper__legend">{{$t('entity.user.enabled')}}</legend>
						<div class="checkbox">
							<input
                                class="checkbox__input"
                                type="checkbox"
                                name="enabled"
                                id="enabled"
                                v-model="userCreateForm.enabled">
							<label class="checkbox__label" for="enabled">{{$t('entity.user.enabled')}}</label>
						</div>
					</fieldset>

					<button class="btn btn--default btn-create" type="submit">{{$t('action.create')}}</button>
                    <p class="info-success" v-show="userCreateForm.successMsg">{{ userCreateForm.successMsg }}</p>
					<p v-if="userCreateForm.error" class="info-error">{{userCreateForm.error}}</p>
				</form>
			</div>
		</section>

		<section v-if="users">
        	<h2 class="admin-users__title-2">{{$t('users.usersList')}}</h2>
			<AdminUserTable :users="users" @delete-user="deleteUser" />
		</section>

        <BackToTop />

    </article>
</template>

<script>
    import AdminUserTable from './AdminUserTable'
    import BackToTop from '../../../components/BackToTop';
    import IconBaseDecorative from '../../../components/icons/IconBaseDecorative'
    import IconArrowBlue from '../../../components/icons/IconArrowBlue'
    import IconDelete from '../../../components/icons/IconDelete'

    export default {
        name: 'adminUserList',
        components: {
            AdminUserTable,
            IconBaseDecorative,
            IconArrowBlue,
            IconDelete,
            BackToTop
        },
        data() {
            return {
                userCreateForm : {
                    username: "",
                    password: "",
                    email: "",
                    appRole: "",
                    enabled: false,
                    successMsg: "",
                    error: "",
                    emailError: "",
                    passwordError: "",
                    usernameError: "",
                    roleError: ""
                },
                passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-,;:_]).{8,}$/
            }
        },
        props: [ 'users' ],
        computed:{
            emailDescribedBy(){
                let description = 'email-constraint';
                if(this.userCreateForm.emailError){
                    description = 'email-error email-constraint'
                }
                return description;
            },
            passwordDescribedBy(){
                let description = 'password-constraint';
                if(this.userCreateForm.passwordError){
                    description = 'password-error'
                }
                return description;
            },
            usernameDescribedBy(){
                let description = 'username-constraint';
                if(this.userCreateForm.usernameError){
                    description = 'username-error'
                }
                return description;
            }
        },
        methods: {
            createUser: function(){
                if(this.userCreateForm.username == "" || this.userCreateForm.username.length < 4 || this.userCreateForm.username.length > 30 || this.userCreateForm.email == "" || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.userCreateForm.email) == false || this.userCreateForm.password == "" || /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-,;:_]).{8,}$/.test(this.userCreateForm.password) == false || this.userCreateForm.appRole == "") {

                    if(this.userCreateForm.username == ""){
                        this.userCreateForm.usernameError = this.$i18n.t("form.emptyInput")
                    } else if(this.userCreateForm.username.length < 4 || this.userCreateForm.username.length > 30){
                        this.userCreateForm.usernameError = this.$i18n.t("form.usernameError")
                    } else {
                        this.userCreateForm.usernameError = ""
                    }

                    if(this.userCreateForm.email == "") {
                        this.userCreateForm.emailError = this.$i18n.t("form.emptyInput")
                    } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.userCreateForm.email) == false){
                        this.userCreateForm.emailError = this.$i18n.t("form.emailConstraint")
                    } else {
                        this.userCreateForm.emailError = ""
                    }

                    if(this.userCreateForm.password == "") {
                        this.userCreateForm.passwordError = this.$i18n.t("form.emptyInput")
                    } else if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-,;:_]).{8,}$/.test(this.userCreateForm.password) == false) {
                        this.userCreateForm.passwordError = this.$i18n.t("form.passwordConstraint")
                    } else {
                        this.userCreateForm.passwordError = ""
                    }
                    if(this.userCreateForm.appRole == "") {
                        this.userCreateForm.roleError = this.$i18n.t("form.emptyInput")
                    } else {
                        this.userCreateForm.roleError = ""
                    }

                } else {
                    this.userCreateForm.error = "";
                    this.userCreateForm.usernameError = "";
                    this.userCreateForm.emailError = "";
                    this.userCreateForm.passwordError = "";

                    this.userService.create(
                        this.userCreateForm.username,
                        this.userCreateForm.email,
                        this.userCreateForm.password,
                        this.userCreateForm.appRole,
                        this.userCreateForm.enabled,
                        (user) => {
                            this.$emit('create-user', user)

                            this.userCreateForm.successMsg = this.$i18n.t("form.userCreation")
                            this.userCreateForm.usernameError = "";
                            this.userCreateForm.passwordError = "";
                            this.userCreateForm.emailError = "";
                            this.userCreateForm.roleError = "";
                            setTimeout(() => {
                                this.userCreateForm.successMsg = ""
                            }, 2000)
                        },
                        (error) =>{
                            if(error == 'Username already exists'){
                                this.userCreateForm.usernameError = this.$i18n.t("form.existingUsername");
                                this.userCreateForm.error = this.$i18n.t("form.genericError");
                            }

                            if(error == 'Email already exists'){
                                this.userCreateForm.emailError = this.$i18n.t("form.existingEmail");
                                this.userCreateForm.error = this.$i18n.t("form.genericError");
                            }
                        }
                    )

                    this.userCreateForm.username = "";
                    this.userCreateForm.password = "";
                    this.userCreateForm.email = "";
                    this.userCreateForm.role = "";
                }
            },
            deleteUser(user){
                var index = this.users.indexOf(user);
                if(index > -1){
                    this.userService.delete(
                        user.id,
                        () => {
                            this.users.splice(index, 1)
                        },
                        (error) => console.error(error)
                    )
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.admin-users {
	.admin-users__title-2 {
		margin-top: 6.2rem;
		margin-bottom: 3.1rem;
	}

	.select {
		max-width: 35rem;
	}

	.btn-create {
		margin-top: 1.6rem;
	}
}
</style>
