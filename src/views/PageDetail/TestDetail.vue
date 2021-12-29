<template>
	<div>
		<header class="result-header">
			<div class="result-header__errors">
                <span :class="'error-nbr error-nbr--' + testResult.status">
                    {{ nbElementForStatus }}
                    <icon-base-informative icon-label="results failed" v-if="testResult.status === 'failed'"><icon-improper/></icon-base-informative>
                    <icon-base-informative icon-label="results can't tell" v-if="testResult.status === 'cantTell'"><icon-qualify/></icon-base-informative>
                    <icon-base-informative icon-label="results passed" v-if="testResult.status === 'passed'"><icon-compliant/></icon-base-informative>
                    <icon-base-informative icon-label="results inapplicable"
										   v-if="testResult.status === 'inapplicable'"><icon-not-applicable/></icon-base-informative>
					
                </span>
			</div>

			<div class="result-header__tab">
				<div class="result-header-content">
					<h3 class="result-header-content__name">{{ test.name }}</h3>
					<span v-show="false" class="results-type-details__errors">{{
							$t('resultAudit.testResult.errors', {
								nbAnomaly: testResult.nbElementFailed,
								nbElementTested: testResult.nbElementTested
							})
						}}</span>
					<p class="result-header-content__explanation" v-if="test.description">
						{{ $t('resultAudit.testResult.explanation') }} : {{ test.description }}</p>
					<p v-if="displayMode==='anomaly' && test.rules"
					   class="result-header-content__details results-type-details"
					   v-for="testHierarchy of test.rules" :key="testHierarchy.id">
						<a class="link-simple" v-if="testHierarchy.urls[0]" :href="testHierarchy.urls[0]"
						   :aria-label="$t('resultAudit.testResult.ruleLink') + ' ' + reference.name + '-' + testHierarchy.code">{{ reference.name }}
							- {{ testHierarchy.code }}</a>
						<a class="link-simple" v-if="testHierarchy.urls[1]" :href="testHierarchy.urls[1]"
						   :aria-label="$t('resultAudit.testResult.ruleInfo') + ' ' + reference.name + '-' + testHierarchy.code">{{ $t('resultAudit.testResult.ruleInfo') }}</a>
					</p>
					<!-- ETIQUETTES -->
					<ul class="list-tags list-unstyled">
						<li class="list-tags__item" v-for='tag in test.tags' :key='tag'>
							{{ tag }}
						</li>
					</ul>
				</div>

				<div class="result-header-arrow">
					<button class="btn btn--nude btn--icon btn--tab"
							v-if="testResult && testResult.nbElementFailed + testResult.nbElementPassed + testResult.nbElementCantTell > 0"
							:aria-expanded="ruleOpen === true ? 'true' : 'false'"
							:aria-controls="'rule-content-' + testResult.type + '-' + index"
							@click="toggleContent(!ruleOpen)">
						<icon-base-decorative :class="ruleOpen ? 'hide' : 'show'">
							<icon-arrow-blue/>
						</icon-base-decorative>
						<span class="screen-reader-text" v-if="ruleOpen">{{ $t('action.hide') }}</span>
						<span class="screen-reader-text" v-else>{{ $t('action.show') }}</span>
					</button>
				</div>
			</div>
		</header>


		<div
			v-if="this.testResult.resolvedElementResults"
			v-show="ruleOpen"
			class="result-content" :id="'rule-content-' + testResult.type + '-' + index">
			<anomaly-detail
				v-for="(anomaly, i) of testResult.resolvedElementResults"
				:key='i'
				:page-content="pageContent"
				:anomaly="anomaly"
				:has-accessible-name-tag="hasAccessibleNameTag"
				:has-contrast-tag="hasContrastTag"
				:index="i"/>

			<div v-if="!lastPageLoaded && !isLoading">
				<button class="btn btn--default btn-load" type="button" @click="loadMoreElementResults">
					{{ $t('action.loadMore') }}
				</button>
			</div>
		</div>
	</div>
</template>
<script>
import AnomalyDetail from './AnomalyDetail'
import IconBaseInformative from '../../components/icons/IconBaseInformative'
import IconBaseDecorative from '../../components/icons/IconBaseDecorative'
import IconArrowBlue from '../../components/icons/IconArrowBlue'
import IconCompliant from '../../components/icons/IconCompliant'
import IconImproper from '../../components/icons/IconImproper'
import IconInforound from '../../components/icons/IconInforound'
import IconNotApplicable from '../../components/icons/IconNotApplicable'
import IconQualify from '../../components/icons/IconQualify'

export default {
	name: 'testDetail',
	components: {
		AnomalyDetail,
		IconBaseDecorative,
		IconBaseInformative,
		IconArrowBlue,
		IconInforound,
		IconCompliant,
		IconImproper,
		IconNotApplicable,
		IconQualify,
	},
	props: ['test', 'testResult', 'sharecode', 'index', 'reference', 'pageContent', 'displayMode'],
	data() {
		return {
			ruleOpen: false,
			isLoading: false,
			lastPageLoaded: false,
		}
	},
	methods: {
		loadMoreElementResults() {
			this.isLoading = true;
			this.elementResultService.findPageableByTestResultId(
				this.testResult.id,
				this.sharecode,
				this.testResult.resolvedElementResults ?
					Math.floor(this.testResult.resolvedElementResults.length / 10) :
					0,
				(elementResultsPage) => {
					this.isLoading = false;
					this.testResult.resolvedElementResults.push(...elementResultsPage.content);
					this.lastPageLoaded = elementResultsPage.last;
				},
				(error) => {
					console.error(error);
				}
			)

		},

		toggleContent(showContent) {
			this.ruleOpen = showContent;
			if (this.ruleOpen) {

				if (!this.test.rules) {
					this.testHierarchyService.findAllByTestAndReference(
						this.test.id,
						this.reference.id,
						(testHierarchies) => {
							this.$set(this.test, "rules", testHierarchies);
						},
						(error) => {
							console.error(error)
						}
					)
				}

				if (!this.testResult.resolvedElementResults) {
					this.testResult.resolvedElementResults = [];
					this.loadMoreElementResults();
				}
			}
		}
	},
	computed: {
		hasAccessibleNameTag() {
			return this.test.tags.includes('accessiblename')
		},
		hasContrastTag() {
			return this.test.tags.includes('contrast')
		},
		nbElementForStatus() {
			let result = 0;
			switch (this.testResult.status) {
				case 'passed':
					result = this.testResult.nbElementPassed;
					break;

				case 'failed':
					result = this.testResult.nbElementFailed;
					break;

				case 'cantTell':
					result = this.testResult.nbElementCantTell;
					break;
			}
			return result;
		}
	}
}
</script>

<style lang="scss" scoped>
.result-header {
	display: flex;
	align-items: flex-start;

	.result-header__errors {
		flex: 0 0 $left-column-mobile;
		padding: 3.5rem 0;
		text-align: center;

		@media #{$media-md-viewport} {
			flex: 0 0 $left-column-desktop;
		}
	}

	.result-header__tab {
		display: flex;
		flex: 1 1 auto;
		justify-content: space-between;
		padding: 1.6rem 0;
		border-top: 1px solid $border-secondary;

		@media #{$media-md-viewport} {
			padding: 3.5rem 0;
		}
	}
}

.result-header-content {
	flex: 1 1 auto;

	.result-header-content__name {
		margin: 0 0 .5rem;
		line-height: 1.5;
	}

	.result-header-content__explanation {
		margin: 0;
	}

	.result-header-content__details {
		margin: 0;
	}
}

.result-header-arrow {
	flex: 0 0 auto;
}

.error-nbr {
	display: inline-block;
	position: relative;
	width: 3.2rem;
	height: 3.2rem;
	border-width: 2px;
	border-style: solid;
	border-radius: 50%;
	background-color: $bg-primary;
	font-family: $font-stack-secondary;
	font-size: $small-font-size;
	font-weight: 600;
	line-height: 3.2rem; // disable sass-lint
	text-align: center;

	@media #{$media-md-viewport} {
		width: 5rem;
		height: 5rem;
		font-size: $medium-font-size;
		line-height: 5rem; // disable sass-lint
	}

	svg {
		position: absolute;
		right: -.5rem;
		bottom: -.6rem;
		width: 1.5rem;
		height: 1.5rem;

		@media #{$media-md-viewport} {
			right: -.3rem;
			width: 2rem;
			height: 2rem;
		}
	}

	&.error-nbr--failed {
		border-color: $color-improper;
		color: $color-improper;
	}

	&.error-nbr--passed {
		border-color: $color-compliant;
		color: $color-compliant;
	}

	&.error-nbr--inapplicable {
		border-color: $color-not-applicable;
		color: $color-not-applicable;
	}

	&.error-nbr--cantTell {
		border-color: $color-qualify;
		color: $color-qualify;
	}

	&.error-nbr--untested {
		border-color: $color-untested;
		color: $color-untested;
	}
}

.results-type-details {
	color: $text-secondary;

	> .link-simple:not(:first-child) {
		padding-left: .8rem;
	}

	> .link-simple:not(:last-child) {
		padding-right: .8rem;
		border-right: 2px solid $border-secondary;
	}

	&__errors {
		color: $text-primary;
	}
}

.result-content {
	padding-bottom: 2.4rem;

	@media #{$media-md-viewport} {
		padding-bottom: 6.4rem;
	}

	& + .result-content {
		&::before {
			display: block;
			width: auto;
			height: .2rem;
			margin-bottom: 6.4rem;
			margin-left: $left-column-desktop;
			border-top: 2px dashed $border-secondary;
			content: "";
		}
	}
}

.list-tags {
	display: flex;
	margin-top: 1.2rem;
	list-style-type: none;

	.list-tags__item {
		margin-bottom: .8rem;
		padding: 0 1rem;
		border-radius: 1.6rem;
		background-color: $bg-secondary;
		color: $text-secondary;

		&:not(:last-child) {
			margin-right: .5rem;
		}
	}
}

.btn-load {
	display: block;
	margin: 3.2rem auto 0;
}

@media print {
	.result-header {
		.result-header__tab {
			padding: 1rem 0;
		}
	}
	.list-tags {
		display: none;
	}

	.results-type-details {
		> .link-simple {
			display: block;
		}

		> .link-simple:not(:first-child) {
			padding-left: 0;
		}

		> .link-simple:not(:last-child) {
			padding-right: 0;
		}
	}
}
</style>
