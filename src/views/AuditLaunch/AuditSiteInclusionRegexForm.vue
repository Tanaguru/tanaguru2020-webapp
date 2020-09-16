<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <div class="form-block">
                <label class="label" for="inclusionRegex">{{$t('audit.site.parameters.labelInclusionRegex')}}</label>
                <input class="input" type="text" name="inclusionRegex" id="inclusionRegex"
                       v-model="inclusionRegex"
                        @input="$emit('input', inclusionRegex)"/>
                <p class="info-text">{{$t('audit.site.parameters.labelInclusionRegexHelp')}}</p>
            </div>
        </div>
    </div>
</template>

<script>

import InputValidationDisplay from "./InputValidationDisplay";
import IconBaseDecorative from "../../components/icons/IconBaseDecorative";
import IconAlert from "../../components/icons/IconAlert";

export default {
    name: 'auditSiteCrawlerInclusionRegexForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['value', 'isValid', 'hasBeenSent'],
    data() {
        return {
            inclusionRegex: this.value
        }
    },
}

</script>

<style lang="scss" scoped>
@import "AuditLaunch.style";

</style>
