<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <div class="input-name form-block">
                <label class="label" for="username">Username *
                    <span v-if="isValid"
                          class="screen-reader-text">{{ $t('audit.form.help.checked') }}</span>
                    <span v-else class="screen-reader-text">{{ $t('audit.form.help.empty') }}</span>
                </label>
                <input class="input" :class="[{'has-error':usernameError && !isValid}]"
                       type="text"
                       name="username"
                       id="username"
                       v-model="username"
                       @input="onUsernameInput"
                       @focus="hideError"
                       @blur="showError"
                       required
                       :aria-describedby="usernameError ? 'info-error' : ''"/>

                <p v-if="!isValid && usernameError" role="alert" class="info-error" id="username-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    <span>Your username is incorrect.</span>
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
    name: 'BasicAuthUsernameForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['value', 'isValid'],
    data() {
        return {
            username: this.value,
            hasInput: false,
            usernameError: false,
        }
    },
    methods:{
        onUsernameInput(){
            this.hasInput = true;
            this.$emit('input', this.username);
        },
        showError() {
            this.usernameError = true
        },
        hideError() {
            this.usernameError = false
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