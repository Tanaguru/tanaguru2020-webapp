<template>
    <div class="wrapper">
        <p>{{$t('form.help')}}</p>
        <form @submit.prevent="sendResetPassword" novalidate>
            <div class="form-block">
                <label class="label" for="email">{{$t('entity.user.email')}} *</label>
                <input
                    class="input"
                    type="email"
                    name="email"
                    id="email"
                    :placeholder="$t('entity.user.email')"
                    v-model="emailInput"
                    autocomplete="email"
                    :aria-describedby="emailError ? 'email-error' : ''"
                    required>
                <p class="info-error" id="email-error">{{ emailError }}</p>
            </div>
            <button class="btn btn--default btn-modify" type="submit">{{$t('action.resetPassword')}}</button>
        </form>
        <div>
            <p v-if="validationSuccess" class="info-success">{{ validationSuccess }}</p>
            <p v-if="validationError" class="info-error">{{validationError}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name:'forgotPassword',
        data(){
            return{
                emailInput: '',
                validationSuccess: '',
                validationError: '',
                emailError: null
            }
        },
        methods:{
            sendResetPassword(){
                if(this.emailInput.length == 0){
                    this.emailError = this.$i18n.t('form.emptyInput')
                } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.emailInput) == false){
                    this.emailError = "This should be an e-mail adress."
                }
                this.validationSuccess = '';
                this.validationError = '';
                this.userService.forgotPassword(
                    this.emailInput,
                    () => {
                        this.validationSuccess = this.$t('form.resetPasswordMailSuccess');
                    },
                    (error)=>{
                        console.error(error);
                        this.validationError = this.$t('form.resetPasswordMailError');
                    }
                )
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
