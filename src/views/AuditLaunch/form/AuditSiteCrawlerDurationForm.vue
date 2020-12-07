<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <div class="form-block">
                <label class="label" for="maxDuration">{{ $t('audit.site.parameters.labelMaxDuration') }}
                    *</label>
                <input class="input" v-bind:class="{'has-error':!isValid}"
                       type="number"
                       name="maxDuration" id="maxDuration"
                       v-model.number="crawlerMaxDuration" required
                       @input="$emit('input', crawlerMaxDuration)"/>
                <p class="info-text">{{ $t('audit.site.parameters.labelMaxDurationHelp') }}</p>
                <p v-if="!isValid" class="info-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    <span>{{ $t("audit.form.error.crawlerDuration") }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import IconBaseDecorative from "../../../components/icons/IconBaseDecorative";
import IconAlert from "../../../components/icons/IconAlert";
import InputValidationDisplay from "../InputValidationDisplay";

export default {
    name: 'auditSiteCrawlerDurationForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['isValid', 'value', 'hasBeenSent'],
    data() {
        return {
            crawlerMaxDuration: this.value
        }
    },
}

</script>

<style lang="scss" scoped>

</style>
