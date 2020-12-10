<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <div class="form-block">
                <label class="label" for="maxDocument">{{ $t('audit.site.parameters.labelMaxDocument') }}
                    *</label>
                <input class="input" v-bind:class="{'has-error':documentError && !isValid}" type="number"
                       name="maxDocument" id="maxDocument"
                       v-model.number="maxDocument" required
                       @input="$emit('input', maxDocument)"
                       @focus="hideError()"
                       @blur="showError()"
                       :aria-describedby="documentError && !isValid ? 'document-error document-help' : 'document-help'"
                />
                <p id="document-help" class="info-text">{{ $t('audit.site.parameters.labelMaxDocumentHelp') }}</p>
                <p v-if="documentError && !isValid" role="alert" id="document-error" class="info-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    <span>{{ $t("audit.form.error.crawlerDocument") }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>

import InputValidationDisplay from "../InputValidationDisplay";
import IconBaseDecorative from "../../../components/icons/IconBaseDecorative";
import IconAlert from "../../../components/icons/IconAlert";

export default {
    name: 'auditSiteCrawlerMaxDocumentForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['value', 'isValid'],
    data() {
        return {
            maxDocument: this.value,
            documentError: false
        }
    },
     methods: {
        hideError() {
            this.documentError = false
        },
        showError() {
            this.documentError = true
        },
    }
}

</script>

<style lang="scss" scoped>
@import "../AuditLaunch.style";

</style>
