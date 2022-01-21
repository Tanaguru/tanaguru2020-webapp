<template>
    <div class="layout-content">
        <input-validation-display
            class="layout-content__aside"
            :value="isValid"/>

        <div class="layout-content__main">
            <fieldset class="radio-custom" :aria-describedby="!isValid && hasBeenSent ? 'type-error' : ''">
                <legend class="radio-custom__legend">{{ $t('audit.definition.radioLegend') }} *
                    <span v-if="type"
                          class="screen-reader-text">{{ $t('audit.form.indications.help.checked') }}</span>
                    <span v-else class="screen-reader-text">{{ $t('audit.form.indications.help.empty') }}</span>
                </legend>

                <div class="radio-custom__wrapper">
                    <input class="radio-custom-input"
                           id="typePage"
                           type="radio"
                           name="audit-type"
                           value="page"
                           v-model='type'
                           @change="$emit('input', type)"/>
                    <label class="radio-custom-label" for="typePage">
                        <icon-base-decorative class="radio-custom-label__icon" viewBox="0 0 72 72">
                            <icon-audit-page/>
                        </icon-base-decorative>
                        <span
                            class="radio-custom-label__text">{{ $t('audit.definition.radioType.newAuditPage') }}</span>
                    </label>

                    <input 
                        :class="notSandbox ? 'radio-custom-input' : 'radio-custom-input disabled'"
                        id="site"
                        type="radio"
                        name="audit-type"
                        :value="notSandbox ? 'site' : ''"
                        v-model='type'
                        :aria-disabled="!notSandbox"
                        @change="notSandbox ? $emit('input', type) : ''"/>
                    <label :class="notSandbox ? 'radio-custom-label' : 'radio-custom-label disabled'" for="site">
                        <icon-base-decorative class="radio-custom-label__icon" viewBox="0 0 72 72">
                            <icon-audit-site/>
                        </icon-base-decorative>
                        <span
                            class="radio-custom-label__text">{{ $t('audit.definition.radioType.newAuditSite') }}</span>
                    </label>

                    <input class="radio-custom-input"
                           id="upload"
                           type="radio"
                           name="audit-type"
                           value="upload"
                           v-model='type'
                           @change="$emit('input', type)"/>
                    <label class="radio-custom-label" for="upload">
                        <icon-base-decorative class="radio-custom-label__icon" viewBox="0 0 72 72">
                            <icon-audit-file/>
                        </icon-base-decorative>
                        <span
                            class="radio-custom-label__text">{{ $t('audit.definition.radioType.newAuditUpload') }}</span>
                    </label>

                    <input class="radio-custom-input"
                           id="scenario"
                           type="radio"
                           name="audit-type"
                           value="scenario"
                           v-model='type'
                           @change="$emit('input', type)"/>
                    <label class="radio-custom-label" for="scenario">
                        <icon-base-decorative class="radio-custom-label__icon" viewBox="0 0 72 72">
                            <icon-audit-scenario/>
                        </icon-base-decorative>
                        <span
                            class="radio-custom-label__text">{{ $t('audit.definition.radioType.newAuditScenario') }}</span>
                    </label>
                </div>
            </fieldset>
            <p v-if="!isValid && hasBeenSent" class="info-error" id="type-error">
                <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                    <icon-alert/>
                </icon-base-decorative>
                <span>{{ $t("audit.form.error.auditType") }}</span>
            </p>
        </div>
    </div>
</template>

<script>
import IconBaseDecorative from '../../../components/icons/IconBaseDecorative';
import IconChecked from '../../../components/icons/IconChecked';
import IconUnchecked from '../../../components/icons/IconUnchecked';
import IconAuditPage from '../../../components/icons/IconAuditPage';
import IconAuditSite from '../../../components/icons/IconAuditSite';
import IconAlert from '../../../components/icons/IconAlert';
import IconAuditFile from '../../../components/icons/IconAuditFile';
import IconAuditScenario from '../../../components/icons/IconAuditScenario';
import InputValidationDisplay from "../InputValidationDisplay";

export default {
    name: 'auditTypeForm',
    components: {
        InputValidationDisplay,
        IconBaseDecorative,
        IconChecked,
        IconUnchecked,
        IconAuditPage,
        IconAuditScenario,
        IconAuditSite,
        IconAuditFile,
        IconAlert
    },
    props: ['value', 'isValid', 'hasBeenSent', 'notSandbox', "alreadyHasOneSiteAudit"],
    data() {
        return {
            type: this.value
        }
    },
    computed: {
         isTrialAndHasOneSiteAudit(){
             let condition = false;
             if(this.alreadyHasOneSiteAudit && this.$store.state.auth.user.appAccountType.name === 'FREE'){
                condition = true
             }
             return condition;
         }
    }
}

</script>

<style lang="scss" scoped>
@import "../AuditLaunch.style";

// Custom radio buttons
.radio-custom {
    padding: 0;
    border: 0;

    .radio-custom__legend {
        margin-bottom: 1.6rem;
        color: $text-secondary;
        font-weight: 600;
    }

    .radio-custom__wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
}

.radio-custom-input {
    position: absolute;
    opacity: 0;

    &:hover + .radio-custom-label {
        background-color: rgba($border-secondary, .5);

        &.disabled {
            background-color: white;
        }
    }

    &:focus + .radio-custom-label {
        background-color: $border-secondary;
    }

    & + .radio-custom-label {
        &::after {
            content: none;
        }

        &.disabled {
            text-decoration: none;
            cursor: default;
            opacity: .7;
		
            &:hover {
                text-decoration: none;
                cursor: default;
            }
        }
    }

    &:checked + .radio-custom-label {
        &::after {
            content: url("#{$img-path}checked.svg");
        }

        &.disabled {
            &::after {
                content: none;
            }
        }
    }
}

.radio-custom-label {
    position: relative;
    display: block;
    flex: 0 1 48%;
    margin-bottom: 3rem;
    padding: 1.6rem 0;
    background-color: $bg-primary;
    color: $text-secondary;
    text-align: center;
    box-shadow: 0 2px 16px 0 rgba(5, 90, 127, .1);

    @media #{$media-md-viewport} {
        flex: 0 1 21.875%;
        margin-bottom: 0;
        padding: 4rem 2rem 3.2rem;
    }

    &::after {
        position: absolute;
        bottom: -2rem;
        left: -2rem;
        transform: scale(.5);

        @media #{$media-md-viewport} {
            transform: scale(1);
        }
    }

    .radio-custom-label__icon {
        display: block;
        margin: 0 auto 1rem;
        width: 4.8rem;
        height: 4.8rem;
    }

    .radio-custom-label__text {
        font-size: $small-font-size;
        font-weight: 600;

        @media #{$media-md-viewport} {
            font-size: $medium-font-size;
        }
    }
}

</style>
