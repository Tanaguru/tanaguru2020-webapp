<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <div class="input-seeds form-block">
                <label class="label" for="seeds">{{ $t('audit.site.parameters.labelSiteSeeds') }}
                    *</label>
                <input class="input"
                       v-bind:class="{'has-error':!isValid}"
                       type="text"
                       name="seeds"
                       id="seeds"
                       v-model="seeds"
                       @input="$emit('input', seeds.split(';'))"
                       required/>
                <p class="info-text">{{ $t('audit.site.parameters.labelSiteSeedsHelp') }}</p>
                <p v-if="!isValid" class="info-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    <span>{{ $t("audit.form.error.seedsError") }}</span>
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
    name: 'auditSiteSeedsForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['value', 'isValid', 'hasBeenSent'],
    data() {
        return {
            seeds: this.value.join(';')
        }
    },
}

</script>

<style lang="scss" scoped>
.input-seeds {
    max-width: 64rem;
}
</style>
