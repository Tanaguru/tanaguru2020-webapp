<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <div class="input-name form-block">
                <label class="label" for="password">{{ $t('audit.basicAuth.password') }}
                    <span v-if="isValid"
                          class="screen-reader-text">{{ $t('audit.form.indications.help.checked') }}</span>
                    <span v-else class="screen-reader-text">{{ $t('audit.form.indications.help.empty') }}</span>
                </label>
                <input class="input" :class="[{'has-error':passwordError && !isValid}]"
                       type="password"
                       name="password"
                       id="password"
                       v-model="password"
                       @input="onPasswordInput"
                       @focus="hideError"
                       @blur="showError"
                       :aria-describedby="passwordError ? 'info-error' : ''"/>

                <p v-if="!isValid && passwordError" role="alert" class="info-error" id="password-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    <span>{{ $t('audit.basicAuth.passwordError') }}</span>
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
    name: 'BasicAuthPasswordForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['value', 'isValid'],
    data() {
        return {
            password: "",
            hasInput: false,
            passwordError: false,
        }
    },
    methods:{
        onPasswordInput(){
            this.hasInput = true;
            this.$emit('input', this.password);
        },
        showError() {
            this.passwordError = true
        },
        hideError() {
            this.passwordError = false
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