<template>
    <div class="layout-content">
        <input-validation-display
                class="layout-content__aside"
                :value="isValid"/>

        <div class="layout-content__main">
            <div class="layout-content-heading">
                <h3 class="layout-content-heading__subtitle layout-subtitle"
                    aria-describedby="pages-explanations">{{ $t('audit.pages.subtitle') }}</h3>

                <p class="layout-content-heading__info" id='pages-explanations'>
                    {{ $t('audit.pages.explanation') }}</p>

                <fieldset class="radio-addition">
                    <legend class="screen-reader-text">{{ $t('audit.pages.radioLegend') }}</legend>
                    <div class="radio" v-for="inputMode in inputModes" :key="inputMode">
                        <input class="radio__input" :id="inputMode" type="radio"
                               :value="inputMode"
                               v-model="selectedInputMode"/>
                        <label class="radio__label"
                               :for="inputMode">{{ $t('audit.pages.' + inputMode) }}</label>
                    </div>
                </fieldset>
            </div>

            <div v-if="selectedInputMode == 'plainText'">
                <label class="label" for="urls">{{ $t('audit.pages.byUrl.label') }} *</label>
				<div class="textarea-wrapper">
					<div class="textarea-wrapper__grabber"></div>
					<textarea class="textarea-wrapper__textarea"
						rows="5"
						cols="80"
						:class="{'has-error':showError}"
						name="urls"
						id="urls"
						required
						:value="inputPlainText"
						@input="onPlainTextChange($event.target.value)"
                        :aria-describedby="showError ? 'free-url-error' : ''"
					></textarea>

                    <p v-if="showError" class="info-error" id="free-url-error" aria-live="polite">
                        <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                            <icon-alert/>
                        </icon-base-decorative>
                        <span v-if="inputPlainText.length == 0"> {{ $t('audit.form.error.emptyUrlsError') }}</span>
                        <span v-else>The pages should belong to the domain declared in the project.</span>
                    </p>
				</div>

                <p class="form-help">{{ $t('audit.pages.byUrl.labelHelp') }}</p>
            </div>

            <div class="page-by-page" v-else-if="selectedInputMode == 'array'">
                <div
                    role="group"
                    :arialabelledby="`page-${i+1}`"
                    class="custom-fieldset"
                    v-for='(url, i) in value' :key='i'
                >
                    <p :id="`page-${i+1}`" class="custom-fieldset__legend">
                        {{ $t('audit.pages.byPage.page') }} {{ i + 1 }}
                    </p>

                    <div class="custom-fieldset__content">
                        <label
                                class="label"
                                :for='`page-url-${i}`'>
                            {{ $t('audit.pages.byPage.url') }} *
                        </label>
                        <input class="input"
                                :class="{'has-error': describedBy(url, i)}"
                                type='text'
                                :id='`page-url-${i}`'
                                @input="onArrayChange(i, $event.target.value)"
                                :value="url"
                                :required="i === 0"
                                :aria-describedby="describedBy(url, i)"/>

                        <p v-if="hasBeenSent && !url" class="info-error" :id='`empty-url-error-${i}`'>
                            <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                                <icon-alert/>
                            </icon-base-decorative>
                            <span>{{ $t('form.emptyInput') }}</span>
                        </p>
                        <p v-if="hasBeenSent && url && !checkValidUrl(url, projectDomain, isSeedMustBeInDomain)" class="info-error" :id='`valid-url-error-${i}`'>
                            <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                                <icon-alert/>
                            </icon-base-decorative>
                            <span>Has to contain declared domain url</span>
                        </p>

                        <button class="btn btn--icon btn--clipboard btn-delete" v-if="i != 0" type="button" @click="removeField(i)">
                            <icon-base-decorative width="18" height="18">
                                <icon-delete/>
                            </icon-base-decorative>
                            <span>{{ $t('action.delete') }}<span class="screen-reader-text">{{ $t('audit.pages.byPage.page') }} {{ i + 1 }}</span></span>
                        </button>
                    </div>
                </div>

                <button type="button"
                        class="btn btn--default btn--icon"
                        @click="addField">
                    <icon-base-decorative>
                        <icon-plus/>
                    </icon-base-decorative>
                    <span>{{ $t('audit.pages.byPage.button') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>

    import InputValidationDisplay from "../InputValidationDisplay";
    import IconBaseDecorative from "../../../components/icons/IconBaseDecorative";
    import IconAlert from "../../../components/icons/IconAlert";
    import IconPlus from "../../../components/icons/IconPlus";
    import IconDelete from "../../../components/icons/IconDelete";
    import UrlHelper from "../../../helper/urlhelper";

    export default {
        name: 'auditPageUrlsForm',
        props: ['value', 'isValid', 'isSeedMustBeInDomain', 'projectDomain', 'hasBeenSent'],
        components: {
            InputValidationDisplay,
            IconBaseDecorative,
            IconAlert,
            IconPlus,
            IconDelete,
        },
        data() {
            return {
                hasInput: false,
                inputPlainText: this.value.join(';'),
                inputArray: this.value,
                inputModes:['array', 'plainText'],
                selectedInputMode: null,
                errorMsg: ""
            }
        },
        created() {
          this.selectedInputMode =  this.inputModes[0];
        },
        methods: {
            onPlainTextChange(value) {
                this.hasInput = true;
                this.inputPlainText = value.trim();
                this.inputArray = this.inputPlainText.split(';');
                this.$emit('input', this.inputArray);
            },

            addField() {
                this.hasInput = true;
                this.inputArray.push('');
                this.inputPlainText = this.inputArray.join(';');
                this.$emit('input', this.inputArray);
            },
            removeField(index) {
                this.hasInput = true;
                this.inputArray.splice(index, 1);
                this.inputPlainText = this.inputArray.join(';');
                this.$emit('input', this.inputArray);
            },
            onArrayChange(index, value) {
                this.hasInput = true;
                this.$set(this.inputArray, index, value.trim());
                this.inputPlainText = this.inputArray.join(';');
                this.$emit('input', this.inputArray);
            },
            checkValidUrl: UrlHelper.checkValidUrl,

            describedBy(url, i){
                let describedBy = ''
                if(this.hasBeenSent && !this.checkValidUrl){
                    describedBy = "valid-url-error-" + i
                }
                else if(this.hasBeenSent && !url){
                    describedBy = "empty-url-error-" + i
                }
                return describedBy
            }
        },
        computed:{
            showError(){
                return (this.hasBeenSent) && !this.isValid;
            }
        }
    }

</script>

<style lang="scss" scoped>
    @import "src/views/AuditLaunch/AuditLaunch.style";

    .page-by-page {
        @include custom-fieldset(9.375%, 87.5%);
    }
</style>
