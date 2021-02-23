<template>
    <div class="wrapper">
        <h2 class="user__title-2">{{$t('action.changePassword')}}</h2>

        <div>
            <p>{{$t('form.indications.help')}}</p>
            <form @submit.prevent="modifyPassword" novalidate>
                <div class="form-block">
                    <label class="label" for="password2">{{$t('entity.user.newPassword')}} *</label>
                    <input 
                        class="input" 
                        type="password" 
                        name="password" 
                        id="password2"
                        :placeholder="$t('entity.user.password')" 
                        v-model="modifyPasswordForm.password"
                        autocomplete="new-password"
                        required>
                </div>

                <div class="form-block">
                    <label class="label" for="passwordConfirm">{{$t('entity.user.passwordConfirm')}} *</label>
                    <input 
                        class="input" 
                        type="password" 
                        name="passwordConfirm" 
                        id="passwordConfirm"
                        :placeholder="$t('entity.user.passwordConfirm')" 
                        v-model="modifyPasswordForm.passwordConfirm"
                        autocomplete="new-password"
                        required>
                </div>

                <button class="btn btn--default btn-modify" type="submit">{{$t('action.changePassword')}}</button>
            </form>
        </div>

        <div>
            <p v-if="modifyPasswordForm.successMsg" class="info-success" id="password-success">{{ modifyPasswordForm.successMsg }}</p>
            <p v-if="modifyPasswordForm.error" class="info-error" id="password-error">{{modifyPasswordForm.error}}</p>
        </div>
    </div>
</template>

<script>
    import PasswordHelper from '../helper/PasswordHelper';

    export default {
        name: 'resetPassword',
        components: {
            PasswordHelper
        },
        data() {
            return {
                userId: null,
                token: null,
                modifyPasswordForm: {
                    password: "",
                    passwordConfirm: "",
                    error: "",
                    successMsg:""
                }
            }
        },
        created() {
            this.userId = this.$route.params.userId;
            this.token = this.$route.params.token;
        },
        methods:{
		    checkValidPassword: PasswordHelper.checkValidPassword,
            modifyPassword() {
                if(!this.checkValidPassword(this.modifyPasswordForm.password)){
                    this.modifyPasswordForm.error = this.$i18n.t("form.errorMsg.password.passwordError")
                } else {
                    this.modifyPasswordForm.error = "";
                    if (this.modifyPasswordForm.password === this.modifyPasswordForm.passwordConfirm) {
                        this.userService.changePassword(
                            this.modifyPasswordForm.password,
                            this.userId,
                            this.token,
                            (user) => {
                                this.modifyPasswordForm.active = false;
                                this.modifyPasswordForm.successMsg = this.$i18n.t("form.successMsg.savedChangesChange")
                            },
                            (error) => this.modifyPasswordForm.error = this.$i18n.t("form.errorMsg.genericError")
                        )
                    } else {
                        this.modifyPasswordForm.error = this.$i18n.t("form.errorMsg.password.incorrectConfirmation")
                    }

                    this.modifyPasswordForm.password = "";
                    this.modifyPasswordForm.passwordConfirm = "";
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>