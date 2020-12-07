<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <div class="input-name form-block">
                <label class="label" for="name">{{ $t('audit.definition.labelName') }} *
                    <span v-if="isValid"
                          class="screen-reader-text">{{ $t('audit.form.help.checked') }}</span>
                    <span v-else class="screen-reader-text">{{ $t('audit.form.help.empty') }}</span>
                </label>
                <input class="input" :class="[{'has-error':showError}]"
                       type="text"
                       name="name"
                       id="name"
                       v-model="name"
                       @input="onNameInput"
                       required
                       :aria-describedby="showError ? 'info-error' : ''"/>

                <p v-if="showError" class="info-error" id="name-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    <span>{{ $t("audit.form.error.auditName") }}</span>
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
    name: 'auditNameForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['value', 'isValid', 'hasBeenSent'],
    data() {
        return {
            name: this.value,
            hasInput: false
        }
    },
    methods:{
        onNameInput(){
            this.hasInput = true;
            this.$emit('input', this.name);
        }
    },
    computed:{
        showError(){
            return (this.hasInput || this.hasBeenSent) && !this.isValid;
        }
    }
}

</script>

<style lang="scss" scoped>
@import "src/views/AuditLaunch/AuditLaunch.style";

.input-name {
    max-width: 64rem;
}
</style>
