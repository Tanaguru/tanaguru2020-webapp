<template>
    <div class="layout-content">
        <div class="layout-content__aside">
            <input-validation-display :value="isValid"/>
        </div>

        <div class="layout-content__main">
            <div class="input-waittime">
                <label class="label" for="waitTime">{{$t('audit.waitTime.label')}} *
                    <span v-if="isValid " class="screen-reader-text">{{$t('audit.form.indications.help.checked')}}</span>
                    <span v-else class="screen-reader-text">{{$t('audit.form.indications.help.empty')}}</span>
                </label>
                <input class="input" v-bind:class="{'has-error':wtError && !isValid}" type="number"
                       name="waitTime"
                       id="waitTime"
                       v-model.number="waitTime"
                       @input="$emit('input', waitTime)"
                       @focus="hideError"
                       @blur="showError"
                       :aria-describedby="wtError && !isValid ? 'waittime-error waittime-precision' : 'waittime-precision'"
                       required/>
                <p class="info-text" id='waittime-precision'>{{$t('audit.waitTime.formHelp')}}</p>
            </div>
            <p v-if="wtError && !isValid" role="alert" id="waittime-error" class="info-error">
                <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                    <icon-alert/>
                </icon-base-decorative>
                <span>{{$t("audit.form.error.waitTimeError")}}</span>
            </p>
        </div>
    </div>
</template>

<script>
    import IconBaseDecorative from "../../../components/icons/IconBaseDecorative";
    import IconAlert from "../../../components/icons/IconAlert";
    import InputValidationDisplay from "../InputValidationDisplay";
    export default {
        components: {
            InputValidationDisplay,
            IconBaseDecorative,
            IconAlert
        },
        props: ['value', 'isValid', 'hasBeenSent'],
        data(){
            return{
                waitTime: this.value,
                wtError: false
            }
        },
        methods: {
            hideError() {
                this.wtError = false
            },
            showError() {
                this.wtError = true
            },
        }
    }
</script>