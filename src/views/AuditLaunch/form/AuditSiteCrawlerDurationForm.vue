<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <div class="form-block">
                <label class="label" for="maxDuration">{{ $t('audit.site.parameters.labelMaxDuration') }}
                    *</label>
                <input class="input" v-bind:class="{'has-error':durationError && !isValid}"
                       type="number"
                       name="maxDuration" id="maxDuration"
                       v-model.number="crawlerMaxDuration" required
                       @input="$emit('input', crawlerMaxDuration)"
                       @focus="hideError()"
                       @blur="showError()"
                       :aria-describedby="durationError && !isValid ? 'duration-error duration-help' : 'duration-help'" />
                <p id="duration-help" class="info-text">{{ $t('audit.site.parameters.labelMaxDurationHelp') }}</p>
                <p v-if="durationError && !isValid" role="alert" id="duration-error" class="info-error">
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
    props: ['isValid', 'value'],
    data() {
        return {
            crawlerMaxDuration: this.value,
            durationError: false
        }
    },
    methods: {
        hideError() {
            this.durationError = false
        },
        showError() {
            this.durationError = true
        },
    }
}

</script>

<style lang="scss" scoped>

</style>
