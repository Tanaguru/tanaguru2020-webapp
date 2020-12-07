<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <div class="form-block">
                <label class="label" for="exclusionRegex">{{$t('audit.site.parameters.labelExclusionRegex')}}</label>
                <input class="input" type="text" name="exclusionRegex" id="exclusionRegex"
                       v-model="exclusionRegex"
                        @input="$emit('input', exclusionRegex)"/>
                <p class="info-text">{{$t('audit.site.parameters.labelExclusionRegexHelp')}}</p>
            </div>
        </div>
    </div>
</template>

<script>

import InputValidationDisplay from "../InputValidationDisplay";
import IconBaseDecorative from "../../../components/icons/IconBaseDecorative";
import IconAlert from "../../../components/icons/IconAlert";

export default {
    name: 'auditSiteCrawlerExclusionRegexForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['value', 'isValid', 'hasBeenSent'],
    data() {
        return {
            exclusionRegex: this.value
        }
    },
}

</script>

<style lang="scss" scoped>
@import "src/views/AuditLaunch/AuditLaunch.style";

</style>
