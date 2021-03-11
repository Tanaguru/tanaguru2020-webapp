<template>
    <div class="layout-content">
        
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <div class="input-name form-block">
                <label class="label" for="login">{{ $t('audit.basicAuth.login') }}
                    <span v-if="isValid"
                        class="screen-reader-text">{{ $t('audit.form.indications.help.checked') }}</span>
                    <span v-else class="screen-reader-text">{{ $t('audit.form.indications.help.empty') }}</span>
                </label>
                <input class="input" :class="[{'has-error':loginError && !isValid}]"
                    type="text"
                    name="login"
                    id="login"
                    v-model="login"
                    @input="onLoginInput"
                    @focus="hideError"
                    @blur="showError"
                    :aria-describedby="loginError ? 'info-error' : ''"/>

                <p v-if="!isValid && loginError" role="alert" class="info-error" id="login-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    <span>{{ $t('audit.basicAuth.loginError') }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import IconBaseDecorative from '../../../components/icons/IconBaseDecorative';
import IconAlert from '../../../components/icons/IconAlert';
import InputValidationDisplay from "../InputValidationDisplay";
export default {
    name: 'BasicAuthLoginForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['value', 'isValid'],
    data() {
        return {
            login: this.value,
            hasInput: false,
            loginError: false,
        }
    },
    methods:{
        onLoginInput(){
            this.hasInput = true;
            this.$emit('input', this.login);
        },
        showError() {
            this.loginError = true
        },
        hideError() {
            this.loginError = false
        }
    },
    
}
</script>

<style lang="scss" scoped>
@import "../AuditLaunch.style";
.input-name {
    max-width: 64rem;
}
</style>