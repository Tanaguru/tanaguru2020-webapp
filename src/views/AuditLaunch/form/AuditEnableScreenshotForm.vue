<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="enableScreenShot == true || enableScreenShot == false"/>

        <div class="layout-content__main">
            <div class="layout-content-heading">
                <h3 class="layout-content-heading__subtitle layout-subtitle"
                    aria-describedby="pages-explanations">{{ $t('audit.definition.screenshot.title') }}</h3>

                <p class="layout-content-heading__info" id='pages-explanations'>
                    {{ $t('audit.definition.screenshot.explanation') }}</p>

                <fieldset class="radio-addition">
                    <legend class="screen-reader-text">{{ $t('audit.definition.screenshot.radioLegend') }}</legend>
                    <div class="radio">
                        <input class="radio__input" id="screenshotYes" type="radio" :value="true"
                               v-model="enableScreenShot"
                               @input="$emit('input', true)"
                               name="screenshot"/>
                        <label class="radio__label"
                               for="screenshotYes">{{ $t('audit.definition.screenshot.radioYes') }}</label>
                    </div>
                    <div class="radio">
                        <input class="radio__input" id="screenshotNo" type="radio" :value="false"
                               v-model="enableScreenShot"
                               @input="$emit('input', false)"
                               name="screenshot"/>
                        <label class="radio__label"
                               for="screenshotNo">{{ $t('audit.definition.screenshot.radioNo') }}</label>
                    </div>
                </fieldset>
            </div>
        </div>
    </div>
</template>

<script>
import InputValidationDisplay from "../InputValidationDisplay";

export default {
    name: 'AuditEnableScreenshotForm',
    components: {InputValidationDisplay},
    props: ['value'],
    data() {
        return {
            enableScreenShot: this.value
        }
    }
}

</script>
