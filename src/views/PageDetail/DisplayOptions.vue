<template>
    <div class="options-wrapper" id='display-options' :style="fixedOptionsStyle">
        <div class="options">
            <div class="options__header">
                <p class="options__title">{{$t('resultAudit.displayOptions.title')}}</p>
                <ul class="actions-list">
                    <li class="actions-list__item">
                        <button class='btn btn--icon btn--nude btn--tab' aria-controls='parameter-box' :aria-expanded="showParameters ? 'true' : 'false'" @click="showParameters = ! showParameters" >
                            <icon-base-decorative :class="showParameters ? 'hide' : 'show'"><icon-arrow-blue /></icon-base-decorative>
                            <span v-if="showParameters">{{$t('resultAudit.displayOptions.hide')}}</span>
                            <span v-else>{{$t('resultAudit.displayOptions.show')}}</span>
                        </button>
                    </li>
                    <li class="actions-list__item">
                        <button class='btn btn--icon btn--nude' aria-controls='display-options' @click="fixedOptions = ! fixedOptions">
                            <icon-base-decorative v-show='fixedOptions'><icon-pin /></icon-base-decorative>
                            <span v-if='fixedOptions'>{{$t('resultAudit.displayOptions.unsticky')}}</span>
                            <span v-else>{{$t('resultAudit.displayOptions.sticky')}}</span>
                        </button>
                    </li>
                </ul>
            </div>

            <form @submit.prevent="" class="form" v-show="showParameters" id='parameter-box'>
                <fieldset class="form__fieldset fieldset">
                    <legend class='fieldset__legend'>{{$t('resultAudit.displayOptions.legendReference')}}</legend>
                    <div class="radio">
                        <div :key="reference.id"
                             v-for="(reference, i) in references">
                            <input
                                class="radio__input"
                                :aria-checked="selectedReferenceIndex === i"
                                :checked="selectedReferenceIndex === i"
                                :value="i"
                                :id="'radio-reference-' + i"
                                :name="'radio-reference-' + i"
                                type="radio"
                                @change="$emit('selectReferenceIndex', i)"
                            />
                            <label class="radio__label" :for="'radio-reference-' + i">{{ reference.name }}</label>
                        </div>
                    </div>
                </fieldset>
                <fieldset class="form__fieldset fieldset">
                    <legend class='fieldset__legend'>{{$t('resultAudit.displayOptions.legendSort')}}</legend>
                    <div class="radio">
                        <input class="radio__input" :aria-checked="displayMode === 'anomaly'"
                               id="displaymode-anomaly"
                               name="displayMode"
                               :checked="displayMode=='anomaly'"
                               @change="$emit('selectDisplayMode', 'anomaly')"
                               type="radio"
                               value="anomaly"/>
                        <label class="radio__label" for="displaymode-anomaly">{{$t('resultAudit.displayOptions.sortAnomalies')}}</label>
                        <input class="radio__input" :aria-checked="displayMode === 'references'"
                               id="displaymode-repository"
                               name="displayMode"
                               :checked="displayMode=='references'"
                               type="radio"
                               @change="$emit('selectDisplayMode', 'references')"
                               value="repository"/>
                        <label class="radio__label" for="displaymode-repository">{{$t('resultAudit.displayOptions.sortRepository')}}</label>
                    </div>

                </fieldset>

                <div class="form__fieldset fieldset">
                    <SearchInput
                        :propositions="tags"
                        :selection="selectedTags"
                        @removeKeyword="(tag) => $emit('removeTag', tag)"
                        @selectKeyword="(tag) => $emit('selectTag', tag)"/>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import SearchInput from "../../components/SearchInput";
    import IconBaseDecorative from "../../components/icons/IconBaseDecorative";
    import IconBaseInformative from "../../components/icons/IconBaseInformative";
    import IconArrowBlue from "../../components/icons/IconArrowBlue";
    import IconPin from "../../components/icons/IconPin";
    import IconExport from "../../components/icons/IconExport";
    import IconShare from "../../components/icons/IconShare";
    import IconPrint from "../../components/icons/IconPrint";
    import IconLaunch from "../../components/icons/IconLaunch";
    import IconInforound from "../../components/icons/IconInforound";
    import IconCompliant from "../../components/icons/IconCompliant";
    import IconIgnored from "../../components/icons/IconIgnored";
    import IconImproper from "../../components/icons/IconImproper";
    import IconNotApplicable from "../../components/icons/IconNotApplicable";
    import IconQualify from "../../components/icons/IconQualify";
    import IconUntested from "../../components/icons/IconUntested";
    import IconTop from "../../components/icons/IconTop";

    export default {
        name: 'DisplayOptions',
        props: ['references', 'tags', 'displayMode', 'selectedReferenceIndex', 'selectedTags'],
        components: {
            SearchInput,
            IconBaseDecorative,
            IconBaseInformative,
            IconArrowBlue,
            IconPin,
            IconExport,
            IconShare,
            IconPrint,
            IconLaunch,
            IconInforound,
            IconCompliant,
            IconIgnored,
            IconImproper,
            IconNotApplicable,
            IconQualify,
            IconUntested,
            IconTop,
        },
        data(){
            return {
                fixedOptions: false,
                showParameters: true,
            }
        },
        computed: {
            fixedOptionsStyle() {
                return this.fixedOptions ? 'position: -webkit-sticky; position: sticky; top: 0; background-color: white;' : '';
            },
        }
    }
</script>

<style lang="scss" scoped>
/* Options panel */
.options-wrapper {
	z-index: 100; // to be displayed above the others elements when element is sticky
}

.options {
	padding: 1.6rem;
	background-color: $bg-primary;
	box-shadow: 0 2px 16px 0 $shadow-primary;

	@media #{$media-sm-viewport} {
		padding: 3.2rem 4rem;
	}

	.options__header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.actions-list {
			.btn--tab {
				span {
					@extend %screen-reader-text;

					@media #{$media-md-viewport} {
						position: static;
						width: auto;
						height: auto;
						clip: unset;
						clip-path: none;
					}
				}
			}

			.actions-list__item:nth-child(2) {
				display: none;

				@media #{$media-md-viewport} {
					display: block;
				}
			}
		}
	}

	.options__title {
		margin: 0;
		color: $text-secondary;
		font-family: $font-stack-secondary;
		font-weight: 600;
		font-size: $small-font-size;

		@media #{$media-sm-viewport} {
			font-size: 2.8rem;
		}
	}
}

.form {
	@media #{$media-sm-viewport} {
		display: flex;
		align-items: flex-start;
	}

	.form__fieldset {
		@media #{$media-sm-viewport} {
			flex: 1 1 (100% / 3);
		}
	}
}

.fieldset {
	padding: 0;
	border: 0;

	&:not(:last-child) {
		@media #{$media-sm-viewport} {
			border-right: 1px solid $border-secondary;
		}
	}

	&:not(:first-child) {
		@media #{$media-sm-viewport} {
			padding-left: 3.5rem;
		}
	}

	.fieldset__legend {
		margin-bottom: 1rem;
		padding-top: 1.6rem;
		color: $text-secondary;
		font-family: $font-stack-secondary;
		font-size: $small-font-size;
		font-weight: 600;

		@media #{$media-md-viewport} {
			padding-top: 3rem;
			font-size: 2rem;
		}
	}
}

@media print {
	.options-wrapper {
		display: none;
	}
}
</style>
