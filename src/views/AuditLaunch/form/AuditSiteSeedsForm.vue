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
                       v-bind:class="{'has-error': (seedsError && seeds && !isValid) || seedsError && !seeds}"
                       type="text"
                       name="seeds"
                       id="seeds"
                       v-model="seeds"
                       @input="$emit('input', seeds.split(';'))"
                       @focus="hideError()"
                       @blur="showError()"
                       :aria-describedby="seedsError && !isValid ? 'free-seed-error seeds-help' : 'seeds-help'"
                       required/>
                <p id="seeds-help" class="info-text">{{ $t('audit.site.parameters.labelSiteSeedsHelp') }}</p>
                <p v-if="seedsError && seeds && !isValid" role="alert" id="free-seed-error" class="info-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    <span>{{ $t("audit.form.error.seedsError") }}</span>
                </p>
                <p v-if="seedsError && !seeds" role="alert" id="free-seed-error" class="info-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    <span>{{ $t("audit.form.error.emptySeeds") }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import IconBaseDecorative from "../../../components/icons/IconBaseDecorative";
import IconAlert from "../../../components/icons/IconAlert";
import InputValidationDisplay from "../InputValidationDisplay";
import UrlHelper from "../../../helper/urlhelper";

export default {
    name: 'auditSiteSeedsForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconAlert
    },
    props: ['value', 'isValid', 'isSeedMustBeInDomain', 'projectDomain'],
    data() {
        return {
            seeds: this.value.join(';'),
            seedsError: false
        }
    },
    methods:{
        hideError(){
            this.seedsError = false
        },
        showError(){
            if(!this.isValid){
                this.seedsError = true
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.input-seeds {
    max-width: 64rem;
}
</style>