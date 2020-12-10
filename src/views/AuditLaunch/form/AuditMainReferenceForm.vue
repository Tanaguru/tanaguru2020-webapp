<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <div class="form-block select-guidelines">
                <label class="label" for="main-reference-select">{{ $t('audit.guidelines.mainReference.title') }} *
                    <span v-if="mainReference != null"
                          class="screen-reader-text">{{ $t('audit.form.help.checked') }}</span>
                    <span v-else class="screen-reader-text">{{ $t('audit.form.help.empty') }}</span>
                </label>

				<p class="info-text">{{ $t('audit.guidelines.mainReference.explanation') }}</p>

			    <div class="select">
                    <select id="main-reference-select"
                            v-model="mainReference">
                        <option v-for="reference in selectedReferences"
                                :value="reference"
                                :key="reference.name">{{ reference.name }} ({{ reference.code }})
                        </option>
                    </select>
                </div>

                <p v-if="!isValid" class="info-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    <span>{{ $t("audit.form.error.mainReference") }}</span>
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
    name: 'AuditMainReferenceForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['selectedReferences', 'value', 'isValid', 'hasBeenSent'],
    data() {
        return {
            mainReference: null
        }
    },
    computed:{
    },
    watch: {
        selectedReferences: {
            immediate: true,
            handler: function () {
                this.mainReference = this.selectedReferences.length > 0 ?
                    this.selectedReferences[this.selectedReferences.length - 1] :
                    null;
                this.$emit('input', this.mainReference);
            }
        }
    },
}
</script>

<style lang="scss">
@import "../AuditLaunch.style";
</style>