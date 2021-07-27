<template>
    <div class="result-content-item">
        <div class="result-content-header">
            <div class="result-content-header__marker">
                <span :class="`result-marker result-marker--${anomaly.status}`"></span>
            </div>

            <p :class="`result-content-header__name result-content-header__name--${anomaly.status}`">{{anomaly.status}} #{{anomaly.id}}</p>
        </div>

        <div class="result-details">
            <!--<div class="result-details__caps">
                <img src="https://cdn.dribbble.com/users/991511/screenshots/5312765/dribbble-post.png" alt="" />

                <div class="checkbox">
                    <input class="checkbox__input" type="checkbox" id="no-anomaly" value="no-anomaly" name="no-anomaly" />
                    <label class="checkbox__label" for="no-anomaly">{{$t('resultAudit.testResult.checkboxAnomaly')}}</label>
                </div>
            </div>-->

            <div class="result-details__extracts">
                <div class="details-extract" v-if="anomaly">
                    <p class="extract-code__line details-extract__title">{{$t('resultAudit.testResult.outer')}} :</p>
                    <prism language="html" class="extract-code__frame">{{outer}}</prism>
                </div>

                <div class="details-extract">
                    <p class="details-extract__title">{{$t('resultAudit.testResult.details')}}</p>
                    <ul class="details-list">
                        <li class="details-list__item" v-if="hasAccessibleNameTag && anomaly.accessibleName">{{$t('resultAudit.testResult.accessibleName')}} : <span>{{anomaly.accessibleName}}</span></li>
                        <li class="details-list__item" v-if="anomaly.canBeReachedUsingKeyboardWith && anomaly.canBeReachedUsingKeyboardWith.length > 0">{{$t('resultAudit.testResult.canBeReachedUsingKeyboardWith')}} : <span>{{anomaly.canBeReachedUsingKeyboardWith}}</span></li>
                        <li class="details-list__item" v-if="anomaly.isNotExposedDueTo && anomaly.isNotExposedDueTo.length > 0">{{$t('resultAudit.testResult.isNotExposedDueTo')}} : <span>{{anomaly.isNotExposedDueTo}}</span></li>
                        <li class="details-list__item" v-if="anomaly.isNotVisibleDueTo && anomaly.isNotVisibleDueTo.length > 0">{{$t('resultAudit.testResult.isNotVisibleDueTo')}} : <span>{{anomaly.isNotVisibleDueTo}}</span></li>
						
						<!-- CONTRASTS --> 
						<!-- v-if="hasContrastTag"  -->
						<li class="details-list__item">
							<p class="detail">
								<span class="detail__label">{{ $t('resultAudit.testResult.fontSize') }}</span>
								<span class="detail__value">{{ contrast.fontSize }}</span>
							</p>
							<p class="detail">
								<span class="detail__label">{{ $t('resultAudit.testResult.fontWeight') }}</span>
								<span class="detail__value">{{ contrast.fontWeight }}</span>
							</p>
							<p class="detail">
							<!--
								Return rgb value
							-->
								<span class="detail__preview">
									<span class="detail__label">{{ $t('resultAudit.testResult.textColor') }}</span>
									<span class="detail__color" :style="`background-color: `+ contrast.textColor"></span>
									<code class="detail__value">{{ contrast.textColor }}</code>
								</span>
							</p>
							<p class="detail">
							<!--
								Return rgb value or `null` or `image`
							-->
								<!-- if color : -->
								<span v-if="contrast.bgColor && !contrast.bgImage" class="detail__preview">
									<span class="detail__label">{{ $t('resultAudit.testResult.background') }}</span>
									<span class="detail__color" :style="`background-color: ` + contrast.bgColor"></span>
									<code class="detail__value">{{ contrast.bgColor }}</code>
								</span>

								<!-- if `image` : -->
								<span v-else-if="contrast.bgImage && !contrast.bgColor" class="detail__preview">
									<span class="detail__label">{{ $t('resultAudit.testResult.background') }}</span>
									<span class="detail__image">
										<icon-base-decorative width="20" height="20" viewBox="0 0 352 352"><icon-picture /></icon-base-decorative>
									</span>
									<span class="detail__value">{{ $t('resultAudit.testResult.image') }}</span>
								</span>

								<!-- if `null` : -->
								<span v-else>
									<span class="detail__label">{{ $t('resultAudit.testResult.background') }}</span>
									<span class="detail__value">{{ $t('resultAudit.testResult.undefined') }}</span>
								</span>
							</p>

							<p class="detail">
								<span class="detail__label">{{ $t('resultAudit.testResult.ratio') }}</span>
								<span class="detail__value">{{ contrast.ratio }}</span>
							</p>
						</li>
                    </ul>
                </div>

                <div class="details-tab">
                    <div class="details-tab__header">
						<!-- Show Xpath button -->
                        <button
                            class="details-tab-btn btn btn--nude btn--icon btn--tab"
                            aria-label="show-hide-xpath"
                            :aria-controls="index + '-xpath-t' + anomaly.status"
                            :aria-expanded="xpathOpen"
                            @click="toggleXpath"
                        >
                            <span class="extract-name">{{$t('resultAudit.testResult.xpath')}}</span>
                            <icon-base-decorative :class="xpathOpen === true ? 'hide' : 'show'"><icon-arrow-blue /></icon-base-decorative>
                        </button>

						<div class="tooltip">
							<!-- Display Xpath copying tooltip -->
							<button class="btn btn--clipboard" @click="showXpathTooltip = !showXpathTooltip">{{$t('resultAudit.testResult.xpathCopy')}}</button>

							<!-- Copy Xpath tooltip -->
							<div class="tooltip__info" role="tooltip" v-show="showXpathTooltip">
								<div class="tooltip-clipboard">
									<input class="input" :id="'test-xpath-'+index" :value="anomaly.xpath">
									<button
										@click.stop.prevent="copyXpath"
										class="btn btn--clipboard">
										{{ copyXpathButtonText }}
									</button>
								</div>
								<div aria-live="polite" class="screen-reader-text">{{ screenReaderInfoXpath }}</div>
							</div>
						</div>
                    </div>

                    <p :id="index + '-xpath-t-' + anomaly.status" class="details-tab__content" :hidden="!xpathOpen">{{$t('resultAudit.testResult.xpath')}} : {{anomaly.xpath}}</p>
                </div>

                <hr role="presentation" class="details-extract-separator" />

                <div class="details-tab">
                    <div class="details-tab__header">
						<!-- Show CSS button -->
                        <button
                            class="details-tab-btn btn btn--nude btn--icon btn--tab"
                            aria-label="show-hide-css-selector"
                            :aria-expanded="cssSelectorOpen === true ? 'true' : 'false'"
                            :aria-controls="index + '-css-selector'"
                            @click="toggleCssSelector"
                        >
                            <span class="extract-name">{{$t('resultAudit.testResult.css')}}</span>
                            <icon-base-decorative :class="cssSelectorOpen === true ? 'hide' : 'show'"><icon-arrow-blue /></icon-base-decorative>
                        </button>

						<div class="tooltip">
							<!-- Display CSS copying tooltip -->
							<button class="btn btn--clipboard" @click="showCssTooltip = !showCssTooltip">{{$t('resultAudit.testResult.cssCopy')}}</button>

							<!-- Copy CSS tooltip -->
							<div class="tooltip__info" role="tooltip" v-show="showCssTooltip">
								<div class="tooltip-clipboard">
									<input class="input" :id="'test-css-'+index" :value="anomaly.cssSelector">
									<button
										@click.stop.prevent="copyCss"
										class="btn btn--clipboard">
										{{ copyCssButtonText }}
									</button>
								</div>
								<div aria-live="polite" class="screen-reader-text">{{ screenReaderInfoCss }}</div>
							</div>
						</div>
                    </div>

                    <p :id="index + '-css-selector'" class="details-tab__content" :hidden="!cssSelectorOpen">{{anomaly.cssSelector}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import IconBaseDecorative from '../../components/icons/IconBaseDecorative'
    import IconArrowBlue from '../../components/icons/IconArrowBlue'
    import IconCompliant from '../../components/icons/IconCompliant'
    import IconImproper from '../../components/icons/IconImproper'
    import IconInforound from '../../components/icons/IconInforound'
    import IconNotApplicable from '../../components/icons/IconNotApplicable'
    import IconQualify from '../../components/icons/IconQualify'
	import IconPicture from '../../components/icons/IconPicture'

    export default {
        name: 'AnomalyDetail',
        components: {
            IconBaseDecorative,
            IconArrowBlue,
            IconInforound,
            IconCompliant,
            IconImproper,
            IconNotApplicable,
            IconQualify,
			IconPicture,
        },
        props: ['anomaly', 'index', 'pageContent', 'hasAccessibleNameTag', 'hasContrastTag'],
        data(){
            return{
                xpathOpen: false,
                cssSelectorOpen: false,
				resolvedContent: '',
				
				// Copy CSS 
				showCssTooltip: false,
                copyCssButtonText: this.$i18n.t("resultAudit.copyCss.copy"),
				screenReaderInfoCss: '',
				// Copy XPATH
				showXpathTooltip: false,
                copyXpathButtonText: this.$i18n.t("resultAudit.copyXpath.copy"),
				screenReaderInfoXpath: '',

				// Contrasts
				contrast : {
					fontSize: '12px',
					fontWeight: '500',
					textColor: 'rgb(250, 0, 0);',
					bgColor: '',
					bgImage: true,
					ratio: '1.45:1'
				}
            }
        },
		computed: {
            outer(){
                let result = "";
                if(this.anomaly && this.pageContent && this.pageContent.dom){
                    const element = this.pageContent.dom.querySelector(this.anomaly.cssSelector);
                    if(element){
                        let fakeElement = element.cloneNode(true);
                        const e = document.createElement(fakeElement.tagName.toLowerCase());
                        if (e.outerHTML.indexOf("/") !== -1) {
                            if (fakeElement.innerHTML && fakeElement.innerHTML.length > 512) {
                                fakeElement.innerHTML = '[...]';
                            }
                        }
                        result = fakeElement.outerHTML;
                    }else{
                        result = this.$t('entity.element.cannotLoad')
                    }
                }

                return result;
            }
        },
        methods: {
            toggleXpath(){
                this.xpathOpen = !this.xpathOpen
            },
            toggleCssSelector(){
                this.cssSelectorOpen = !this.cssSelectorOpen
			},
			
			// Copy CSS selector function
			copyCss() {
				// get element to copy value
				let testCss = document.querySelector('#test-css-'+this.index)
				testCss.setAttribute('type', 'text')
				testCss.select()
				// If success
				try {
					var successful = document.execCommand('copy');
					var msg = successful ? 'successful' : 'unsuccessful';
					this.copyCssButtonText = this.$i18n.t("resultAudit.copyCss.success")
					this.screenReaderInfoCss = this.$i18n.t("resultAudit.copyCss.sucessHelp")
					setTimeout(() => (
						this.showCssTooltip = false
					), 400)
				// If failure
				} catch (err) {
					this.copyCssButtonText = this.$i18n.t("resultAudit.copyCss.fail")
					this.screenReaderInfoCss = this.$i18n.t("resultAudit.copyCss.failHelp")
				}
				/* unselect the range */
				testCss.setAttribute('type', 'hidden')
				window.getSelection().removeAllRanges()
			},

			// Copy XPATH selector function
			copyXpath() {
				// get element to copy value
				let testXpath = document.querySelector('#test-xpath-'+this.index)
				testXpath.setAttribute('type', 'text')
				testXpath.select()
				// If success
				try {
					var successful = document.execCommand('copy');
					var msg = successful ? 'successful' : 'unsuccessful';
					this.copyXpathButtonText = this.$i18n.t("resultAudit.copyXpath.success")
					this.screenReaderInfoXpath = this.$i18n.t("resultAudit.copyXpath.sucessHelp")
					setTimeout(() => (
						this.showXpathTooltip = false
					), 400)
				// If failure
				} catch (err) {
					this.copyXpathButtonText = this.$i18n.t("resultAudit.copyXpath.fail")
					this.screenReaderInfoXpath = this.$i18n.t("resultAudit.copyXpath.failHelp")
				}
				/* unselect the range */
				testXpath.setAttribute('type', 'hidden')
				window.getSelection().removeAllRanges()
			},
        }
  }
</script>

<style lang="scss" scoped>
.result-content-item {
	&:not(:last-child) {
		.result-details {
			padding-bottom: 2.4rem;
			border-bottom: 2px dashed $border-secondary;

            @media #{$media-md-viewport} {
                padding-bottom: 6.4rem;
            }
		}
	}

	&:not(:first-child) {
		padding-top: 2.4rem;

        @media #{$media-md-viewport} {
			padding-top: 6.4rem;
		}
	}
}

.result-content-header {
	display: flex;
	align-items: center;

	.result-content-header__marker {
		flex: 0 0 $left-column-mobile;
		text-align: center;

		@media #{$media-md-viewport} {
			flex: 0 0 $left-column-desktop;
		}
	}

	.result-content-header__name {
		margin: 0 0 .8rem;
		color: $text-secondary;
		font-family: $font-stack-secondary;
		font-size: $medium-font-size;
		font-weight: 600;
		text-transform: capitalize;

		&.result-content-header__name--failed {
			color: $color-improper;
		}

		&.result-content-header__name--passed {
			color: $color-compliant;
		}

		&.result-content-header__name--inapplicable {
			color: $color-not-applicable;
		}

		&.result-content-header__name--cantTell {
			color: $color-qualify;
		}

		&.result-content-header__name--untested {
			color: $color-untested;
		}
	}
}

.result-marker {
	display: inline-block;
	width: 1.8rem;
	height: 1.8rem;
	border-width: 2px;
	border-style: solid;
	border-radius: 50%;
	background-color: $bg-primary;

	&.result-marker--failed {
		border-color: $color-improper;
	}

	&.result-marker--passed {
		border-color: $color-compliant;
	}

	&.result-marker--inapplicable {
		border-color: $color-not-applicable;
	}

	&.result-marker--cantTell {
		border-color: $color-qualify;
	}

	&.result-marker--untested {
		border-color: $color-untested;
	}
}

.result-details {
	margin-left: $left-column-mobile;

	@media #{$media-md-viewport} {
		margin-left: $left-column-desktop;
		display: flex;
		justify-content: space-between;
	}

	.result-details__caps {
		flex: 0 0 25%;

		img {
			box-shadow: 0 2px 6px 0 rgba(5, 90, 127, .1);
		}
	}

	.result-details__extracts {
		flex: 0 0 71.875%;
		min-width: 1%;
	}
}

.details-extract {
	margin-bottom: 3rem;

	.details-extract__title {
		margin: 0 0 1.5rem 0;
		color: $text-secondary;
		font-weight: 600;
		line-height: 1;
	}
}

.extract-code {
	.extract-code__frame {
		border: 1px solid $border-secondary;
		border-radius: .2rem;
	}
}

.details-extract-separator {
	width: 6.4rem;
	margin: 1.6rem 0;
	border-top: 1px solid $border-secondary;
	border-bottom:  0;
}

.details-list {
	margin: 0;
	padding: 0;
	list-style-type: none;

	.details-list__item {
		span {
			font-weight: 600;
		}

		.detail__value {
			font-weight: 400;
		}
	}
}

.details-tab {
	.details-tab__header {
		display: flex;
		justify-content: space-between;
		margin-bottom: .5rem;
	}

	.details-tab__content {
		margin: 0;
		word-break: break-all;
	}
}

.details-tab-btn {
	font-weight: 600;
}

@media print {
	.details-tab,
	.details-extract-separator {
		display: none;
	}

	.details-extract {
		margin-top: 0;
		margin-bottom: 0;

		> * {
			margin-top: 0;
			margin-bottom: 0;
		}
	}

	.result-content-item {
		&:not(:last-child) {
			.result-details {
				padding-bottom: 1.6rem;
			}
		}

		&:not(:first-child) {
			padding-top: 1.6rem;
		}
	}
}

.detail__preview {
	display: flex;
	align-items: center;

	> * {
		margin-right: 0.5rem;
	}

	svg {
		display: block;
	}
}


.detail__label {
	font-weight: 600;
}


.detail__image {
	display: inline-block;
	width: 2rem;
	height: 2rem;
}

.detail__color {
	display: inline-block;
	width: 2rem;
	height: 2rem;
	font-weight: 400;
}
</style>
