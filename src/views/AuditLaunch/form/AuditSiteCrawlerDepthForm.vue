<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <div class="form-block">
                <label class="label" for="maxDepth">{{ $t('audit.site.parameters.labelMaxDepth') }}
                    *</label>
                <input class="input" v-bind:class="{'has-error':depthError && !isValid}" type="number"
                       name="maxDepth" id="maxDepth"
                       v-model.number="maxDepth" required
                       @input="$emit('input', maxDepth)"
                       @focus="hideError()"
                       @blur="showError()"
                       :aria-describedby="depthError && !isValid ? 'depth-error depth-help' : 'depth-help'"
                />
                <p id="depth-help" class="info-text">{{ $t('audit.site.parameters.labelMaxDepthHelp') }}</p>
                <p v-if="depthError && !isValid" role="alert" id="depth-error" class="info-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    <span>{{ $t("audit.form.error.crawlerDepth") }}</span>
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
    name: 'auditSiteCrawlerMaxDepthForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['value', 'isValid'],
    data() {
        return {
            maxDepth: this.value,
            depthError: false
        }
    },
    methods: {
        hideError() {
            this.depthError = false
        },
        showError() {
            this.depthError = true
        },
    }
}

</script>

<style lang="scss" scoped>
@import "../AuditLaunch.style";

</style>
