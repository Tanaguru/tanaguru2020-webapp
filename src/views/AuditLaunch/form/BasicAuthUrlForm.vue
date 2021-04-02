<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <div class="input-name form-block">
                <label class="label" for="basic-auth-url">URL
                    <span v-if="isValid"
                          class="screen-reader-text">{{ $t('audit.form.indications.help.checked') }}</span>
                    <span v-else class="screen-reader-text">{{ $t('audit.form.indications.help.empty') }}</span>
                </label>
                <input class="input" :class="[{'has-error':urlError && !isValid}]"
                       type="text"
                       name="basic-auth-url"
                       id="basic-auth-url"
                       v-model="url"
                       @input="onUrlInput"
                       @focus="hideError"
                       @blur="showError"
					   autocomplete="chrome-off"
                       :aria-describedby="urlError ? 'info-error' : ''"/>

                <p v-if="!isValid && urlError" role="alert" class="info-error" id="url-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    <span>{{ $t('audit.basicAuth.urlError') }}</span>
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
    name: 'BasicAuthUrlForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['value', 'isValid', 'domain'],
    data() {
        return {
            url: "",
            hasInput: false,
            urlError: false,
        }
    },
    methods:{
        onUrlInput(){
            this.hasInput = true;
            this.$emit('input', this.url);
        },
        showError() {
            this.urlError = true
        },
        hideError() {
            this.urlError = false
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
