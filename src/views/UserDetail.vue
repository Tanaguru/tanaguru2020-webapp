<template>
    <main v-if="user" id="page" role="main" class="wrapper user">
        <Breadcrumbs :breadcrumbsItems='breadcrumbProps'></Breadcrumbs>

        <header class="headline">
            <h1>{{ user.username }}</h1>
        </header>

        <article>
            <h2 class="user__title-2">{{ $t('user.profile') }}</h2>

            <div v-if="modifyUserForm.active">
                <p>{{ $t('form.help') }}</p>
                <form @submit.prevent="modifyUser" novalidate>
                    <div class="form-row">
                        <div class="form-column">
                            <div class="form-block">
                                <label class="label" for="username">{{ $t('entity.user.username') }} *</label>
                                <p class="info-text">{{ $t('form.invalidUsername') }}</p>
                                <input
                                    class="input"
                                    v-bind:class="{ 'has-error': modifyUserForm.usernameError }"
                                    type="text"
                                    name="username"
                                    id="username"
                                    :placeholder="$t('entity.user.username')"
                                    v-model="modifyUserForm.username">
                                <p v-show="modifyUserForm.usernameError" class="info-error">
                                    {{ modifyUserForm.usernameError }}</p>
                            </div>
                        </div>

                        <div class="form-column">
                            <div class="form-block">
                                <label class="label" for="email">{{ $t('entity.user.email') }} *</label>
                                <input
                                    class="input"
                                    v-bind:class="{ 'has-error': modifyUserForm.emailError }"
                                    type="email"
                                    name="email"
                                    id="email"
                                    :placeholder="$t('entity.user.email')"
                                    v-model="modifyUserForm.email">
                                <p v-show="modifyUserForm.emailError" class="info-error">{{
                                        modifyUserForm.emailError
                                    }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-column">
                            <div class="form-block"
                                 v-show="isCurrentUser == false && $store.state.user.appRole.name != 'USER'">
                                <label class="label" for="status-select">{{ $t('entity.user.role.role') }} *</label>
                                <div class="select">
                                    <select name="status-select" id="status-select" v-model="modifyUserForm.appRole">
                                        <option value="SUPER_ADMIN">{{ $t('entity.user.role.superAdmin') }}</option>
                                        <option value="ADMIN">{{ $t('entity.user.role.admin') }}</option>
                                        <option value="USER">{{ $t('entity.user.role.user') }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="form-column">
                            <fieldset class="checkbox-wrapper"
                                      v-show="isCurrentUser == false && $store.state.user.appRole.name != 'USER'">
                                <legend class="checkbox-wrapper__legend">{{ $t('entity.user.status') }} *</legend>
                                <div class="checkbox" v-if="$store.state.authorities['MODIFY_USER']">
                                    <input class="checkbox__input" type="checkbox" name="enabled" id="enabled"
                                           v-model="modifyUserForm.enabled">
                                    <label class="checkbox__label" for="enabled">{{ $t('entity.user.enabled') }}</label>
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    <button class="btn btn--default btn-modify" type="submit">{{ $t('action.modify') }}</button>
                    <p v-if="modifyUserForm.error" class="info-error">{{ modifyUserForm.error }}</p>
                </form>
            </div>

            <div v-else>
                <p class="info-success" v-if="modifyUserForm.successMsg">{{ modifyUserForm.successMsg }}</p>

                <ul class="infos-list">
                    <li><span class="infos-list__exergue">{{ $t('entity.user.username') }}</span> : {{ user.username }}
                    </li>
                    <li><span class="infos-list__exergue">{{ $t('entity.user.email') }}</span> : {{ user.email }}</li>
                    <li><span class="infos-list__exergue">{{ $t('entity.user.role.role') }}</span> :
                        {{ user.appRole.name.charAt(0) + user.appRole.name.slice(1).toLowerCase().replace(/_/g, ' ') }}
                    </li>
                    <li><span class="infos-list__exergue">{{ $t('entity.user.enabled') }}</span> : {{ user.enabled }}
                    </li>
                </ul>

                <button
                    class="btn btn--default btn-modify"
                    v-if="$store.state.authorities['MODIFY_USER'] || isCurrentUser"
                    @click="showModifyUserForm()">
                    {{ $t('action.modify') }}
                </button>
                <p v-if="modifyUserForm.error" class="info-error">{{ modifyUserForm.error }}</p>
            </div>
        </article>

        <!-- password -->

        <article v-show="isCurrentUser">
            <h2 class="user__title-2">{{ $t('action.changePassword') }}</h2>

            <div v-if="modifyPasswordForm.active">
                <p>{{ $t('form.help') }}</p>
                <form @submit.prevent="modifyPassword" novalidate>
                    <div class="form-block">
                        <label class="label" for="password2">{{ $t('entity.user.newPassword') }} *</label>
                        <input
                            class="input"
                            type="password"
                            name="password"
                            id="password2"
                            :placeholder="$t('entity.user.password')"
                            v-model="modifyPasswordForm.password"
                            autocomplete="new-password"
                            required>
                        <p v-if="modifyPasswordForm.passwordError" class="info-error">{{ modifyPasswordForm.passwordError }}</p>
                    </div>

                    <div class="form-block">
                        <label class="label" for="passwordConfirm">{{ $t('entity.user.passwordConfirm') }} *</label>
                        <input
                            class="input"
                            type="password"
                            name="passwordConfirm"
                            id="passwordConfirm"
                            :placeholder="$t('entity.user.passwordConfirm')"
                            v-model="modifyPasswordForm.passwordConfirm"
                            autocomplete="new-password"
                            required>
                        <p v-if="modifyPasswordForm.confirmationError" class="info-error">{{ modifyPasswordForm.confirmationError }}</p>
                    </div>

                    <button class="btn btn--default btn-modify" type="submit">{{ $t('action.changePassword') }}</button>
                    <p v-if="modifyPasswordForm.error" class="info-error">{{ modifyPasswordForm.error }}</p>
                </form>
            </div>

            <div v-else>
                <button
                    class="btn btn--default btn-modify"
                    @click="showModifyPasswordForm()">
                    {{ $t('action.modify') }}
                </button>
            </div>
        </article>

        <article id="user-contracts">
            <h2 class="user__title-2">{{ $t('user.contracts') }}</h2>
            <ProfileContractTable v-if="contracts.length > 0" :contracts="contracts"/>
            <p v-else-if="$route.params.id == $store.state.user.id">{{ $t('user.noContract') }}</p>
            <p v-else>{{ $t('user.adminNoContract') }}</p>

        </article>

        <BackToTop/>

    </main>
</template>

<script>
import IconBaseDecorative from '../components//icons/IconBaseDecorative'
import IconArrowBlue from '../components//icons/IconArrowBlue'
import Breadcrumbs from '../components/Breadcrumbs';
import ProfileContractTable from '../components/ProfileContractTable';
import BackToTop from '../components/BackToTop';

export default {
    name: 'userDetail',
    components: {
        IconBaseDecorative,
        IconArrowBlue,
        ProfileContractTable,
        Breadcrumbs,
        BackToTop
    },
    data() {
        return {
            breadcrumbProps: [
                {
                    name: this.$i18n.t('page.dashboard'),
                    path: '/'
                }
            ],
            user: null,
            isCurrentUser: false,
            contracts: [],
            modifyUserForm: {
                active: false,
                username: "",
                email: "",
                appRole: "",
                enabled: false,
                emailError: "",
                usernameError: "",
                successMsg: ""
            },
            modifyPasswordForm: {
                active: false,
                password: "",
                passwordConfirm: "",
                error: "",
                passwordError: "",
                confirmationError: "",
                successMsg: ""
            },
        }
    },
    metaInfo() {
        return {
            // if no subcomponents specify a metaInfo.title, this title will be used
            title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.profile"),
            meta: [
                {
                    name: 'robots', content: 'noindex'
                }
            ]
        }
    },
    methods: {
        showModifyUserForm() {
            this.modifyUserForm.username = this.user.username;
            this.modifyUserForm.email = this.user.email;
            this.modifyUserForm.appRole = this.user.appRole.name;
            this.modifyUserForm.enabled = this.user.enabled;
            this.modifyUserForm.active = true;
        },
        modifyUser() {
            this.modifyUserForm.error = ""

            if (this.isCurrentUser) {
                if (this.modifyUserForm.username === '' || this.modifyUserForm.username.length < 4) {
                    this.modifyUserForm.usernameError = this.$i18n.t("form.invalidUsername")
                }
                if (this.modifyUserForm.email === '') {
                    this.modifyUserForm.emailError = this.$i18n.t("entity.user.emailError")
                } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) == false) {
                    this.modifyUserForm.emailError = "This should be an e-mail adress."
                }

                if (this.modifyUserForm.email !== '' && this.modifyUserForm.username !== '' && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) == true) {
                    this.userService.modifyMe(
                        this.modifyUserForm.username,
                        this.modifyUserForm.email,
                        this.user.appRole.name,
                        this.user.enabled,
                        (user) => {
                            this.$store.state.user = user;
                            this.user = user;
                            this.modifyUserForm.active = false;
                            this.modifyUserForm.successMsg = this.$i18n.t("form.savedChange")
                        },
                        (error) => this.modifyUserForm.error = this.$i18n.t("form.genericError")
                    )
                }

            } else {
                if (this.modifyUserForm.username === '' || this.modifyUserForm.username.length < 4) {
                    this.modifyUserForm.usernameError = this.$i18n.t("form.invalidUsername")
                }
                if (this.modifyUserForm.email === '') {
                    this.modifyUserForm.emailError = this.$i18n.t("entity.user.emailError")
                }

                if (this.modifyUserForm.email !== '' && this.modifyUserForm.username !== '') {
                    this.userService.modifyUser(
                        this.user.id,
                        this.modifyUserForm.username,
                        this.modifyUserForm.email,
                        this.modifyUserForm.appRole,
                        this.modifyUserForm.enabled,
                        (user) => {
                            this.user = user;
                            this.modifyUserForm.active = false;
                            this.modifyUserForm.successMsg = this.$i18n.t("form.savedChange")
                        },
                        (error) => this.modifyUserForm.error = this.$i18n.t("form.genericError")
                    )
                }
            }
        },

        showModifyPasswordForm() {
            this.modifyPasswordForm.password = "";
            this.modifyPasswordForm.passwordConfirm = "";
            this.modifyPasswordForm.active = true;
        },
        modifyPassword() {
            if(this.modifyPasswordForm.password.length == 0 || this.modifyPasswordForm.passwordConfirm.length == 0){
                if(this.modifyPasswordForm.password.length == 0){
                    this.modifyPasswordForm.passwordError = this.$i18n.t("form.emptyInput")
                }
                if (this.modifyPasswordForm.passwordConfirm.length == 0){
                    this.modifyPasswordForm.confirmationError = this.$i18n.t("form.emptyInput")
                }
            }
            else if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-,;:_]).{8,}$/.test(this.modifyPasswordForm.password) == false) {
                this.modifyPasswordForm.confirmationError = "Your password should be at least 8 characters long and contain at least 1 upper case, 1 lower case, 1 number and 1 special character."
            }
            else if (this.modifyPasswordForm.password != this.modifyPasswordForm.passwordConfirm) {
                this.modifyPasswordForm.error = this.$i18n.t("form.incorrectConfirmation")
            }
            else {
                this.modifyPasswordForm.error = "";
                this.userService.changePassword(
                    this.modifyPasswordForm.password,
                    this.user.id,
                    null,
                    (user) => {
                        this.modifyPasswordForm.active = false;
                        this.modifyPasswordForm.successMsg = this.$i18n.t("form.savedChange")
                    },
                    (error) => this.modifyPasswordForm.error = this.$i18n.t("form.genericError")
                )
            }
        }
    },
    created() {
        this.isCurrentUser = this.$store.state.user.id == this.$route.params.id;
        if (this.$route.params.id) {
            if (!this.isCurrentUser && !this.$store.state.authorities['SHOW_USER']) {
                this.$router.replace('/');
            } else {
                this.userService.findById(
                    this.$route.params.id,
                    (user) => {
                        this.user = user

                        if (this.$store.state.user.appRole.name === 'USER') {
                            this.breadcrumbProps.push({
                                name: 'Configuration',
                                path: '/configuration'
                            })
                        } else {
                            this.breadcrumbProps.push({
                                name: 'Administration',
                                path: '/administration'
                            })
                        }
                        this.breadcrumbProps.push({
                            name: 'Profil de ' + this.user.username,
                            path: '/users/' + this.user.id
                        })
                    },
                    (err) => {
                        this.$router.replace('/404');
                    }
                )

                this.contractService.findByUserId(
                    this.$route.params.id,
                    (contracts) => this.contracts = contracts,
                    (error) => console.error(error)
                )
            }
        } else {
            this.$router.replace('/');
        }
    },
}
</script>

<style lang="scss" scoped>
.user {
    .user__title-2 {
        margin-top: 6.2rem;
        margin-bottom: 3.1rem;
    }

    .infos-list {
        margin-bottom: 2.4rem;
    }

    .select {
        max-width: 35rem;
    }

    .btn-modify {
        margin-top: 1.6rem;
    }
}
</style>
