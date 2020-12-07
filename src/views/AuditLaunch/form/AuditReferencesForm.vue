<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <div class="form-block">
                <fieldset class="checkbox-wrapper checkbox-guidelines">
					<legend class="checkbox-wrapper__legend">{{ $t('audit.guidelines.reference.title') }} *
						<span v-if="isValid" class="screen-reader-text">{{ $t('audit.form.help.checked') }}</span>

						<span v-else class="screen-reader-text">{{ $t('audit.form.help.empty') }}</span>
					</legend>

					<p class="info-text">{{ $t('audit.guidelines.reference.explanation') }}</p>

				    <div v-for="reference of references" class="checkbox">
                        <input
                            :class="['checkbox__input', {'has-error':!isValid}]"
                            type="checkbox"
                            :value="reference" :id="'checkbox-' + reference.id"
                            name="input-reference"
                            v-model="selectedReferences"
                            @change="$emit('input', selectedReferences)"
                        />
                        <label :for="'checkbox-' + reference.id" class="checkbox__label">{{ reference.name }}
                            ({{ reference.code }})</label>
                    </div>
                </fieldset>

                <p v-if="!isValid" class="info-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    <span>{{ $t("audit.form.error.auditReferences") }}</span>
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
    name: 'AuditReferencesForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['references', 'value', 'isValid', 'hasBeenSent'],
    data() {
        return {
            selectedReferences: this.value
        }
    },
}

</script>

<style lang="scss" scoped>
@import "src/views/AuditLaunch/AuditLaunch.style";
</style>
