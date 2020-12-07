<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <div class="form-block">
                <label class="label" for="maxDepth">{{ $t('audit.site.parameters.labelMaxDepth') }}
                    *</label>
                <input class="input" v-bind:class="{'has-error':!isValid}" type="number"
                       name="maxDepth" id="maxDepth"
                       v-model.number="maxDepth" required
                       @input="$emit('input', maxDepth)"
                />
                <p class="info-text">{{ $t('audit.site.parameters.labelMaxDepthHelp') }}</p>
                <p v-if="!isValid" class="info-error">
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
    props: ['value', 'isValid', 'hasBeenSent'],
    data() {
        return {
            maxDepth: this.value
        }
    },
}

</script>

<style lang="scss" scoped>
@import "src/views/AuditLaunch/AuditLaunch.style";

</style>
