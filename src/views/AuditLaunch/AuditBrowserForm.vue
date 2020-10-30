<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
			<div class="layout-content-heading">
				<h3 class="layout-content-heading__subtitle layout-subtitle"
					aria-describedby="pages-explanations">{{ $t('audit.browsers.subtitle') }}</h3>

				<p class="layout-content-heading__info" id='pages-explanations'>
					{{ $t('audit.browsers.explanation') }}</p>

				<fieldset class="radio-addition">
					<legend class="screen-reader-text">{{ $t('audit.browsers.radioLegend') }}</legend>
					<div class="radio" v-for="browser in browsers" :key="browser">
						<input class="radio__input" :id="browser" type="radio"
							   :value="browser"
							   @change="$emit('input', selectedBrowser)"
							   v-model="selectedBrowser"/>
						<label class="radio__label"
							   :for="browser">{{ $t('audit.browsers.' + browser) }}</label>
					</div>
				</fieldset>
			</div>
        </div>
    </div>
</template>

<script>
import IconBaseDecorative from "../../components/icons/IconBaseDecorative";
import IconAlert from "../../components/icons/IconAlert";
import InputValidationDisplay from "./InputValidationDisplay";

export default {
    name: 'AuditBrowserForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['browsers', 'value', 'isValid', 'hasBeenSent'],
    data() {
        return {
            selectedBrowser: this.value
        }
    },
}

</script>

<style lang="scss" scoped>
@import "AuditLaunch.style";
</style>
