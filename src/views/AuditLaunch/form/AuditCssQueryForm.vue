<template>
	<div class="layout-content">
		<input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

		<div class="layout-content__main">
            <div class="form-block">
                <label class="label" for="cssQuery">{{$t('audit.definition.cssQuery.title')}}</label>
                <input class="input" v-bind:class="{'has-error':cssQueryError && !isValid}" type="text" name="cssQuery" id="cssQuery"
                        v-model="cssQuery"
                        @input="$emit('input', cssQuery)"
						@focus="hideError()"
                       	@blur="showError()"
                        :aria-describedby="cssQueryError && !isValid ? 'css-query-error css-query-help' : 'css-query-help'"/>
                <p id="css-query-help" class="info-text">{{$t('audit.definition.cssQuery.help')}}</p>
                <p v-if="cssQueryError && !isValid" role="alert" id="css-query-error" class="info-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    <span>{{ $t("audit.form.error.cssQuery") }}</span>
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
    name: 'auditCssQueryForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['value', 'isValid', 'hasBeenSent'],
    data() {
        return {
			cssQuery: this.value,
			cssQueryError: false
        }
	},
    methods: {
        hideError() {
            this.cssQueryError = false
        },
        showError() {
            this.cssQueryError = true
        },
    }
}

</script>

<style lang="scss" scoped>
@import "../AuditLaunch.style";
</style>
