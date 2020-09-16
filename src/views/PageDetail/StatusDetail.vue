<template>
	<div>
		<header class="list-result-header">
			<div class="list-result-header__icon">
				<icon-base-decorative v-if="status == 'failed'"><icon-improper /></icon-base-decorative>
				<icon-base-decorative v-if="status == 'cantTell'"><icon-qualify /></icon-base-decorative>
				<icon-base-decorative v-if="status == 'passed'"><icon-compliant /></icon-base-decorative>
				<icon-base-decorative v-if="status == 'inapplicable'"><icon-not-applicable /></icon-base-decorative>
				<icon-base-decorative v-if="status == 'untested'"><icon-untested /></icon-base-decorative>
			</div>

			<div class="list-result-header__heading"  v-if="testResults">
				<h3 :class="'list-result-header__title list-result-header__title--' + status">{{$t(`entity.audit.result.${status}`)}}</h3>

				<button class="btn btn--icon btn--nude btn--tab" type="button"
					:aria-expanded="statusOpen === true ? 'true' : 'false'"
					:aria-controls="'result-section-'+status"
					@click="toggleStatus"
				>
					<span v-if="statusOpen">{{$t('resultAudit.testResult.detailTabHide')}}</span>
					<span v-else>{{$t('resultAudit.testResult.detailTabShow')}}</span>
					<icon-base-decorative :class="statusOpen === true ? 'hide' : 'show'">
						<icon-arrow-blue />
					</icon-base-decorative>
				</button>

			</div>
		</header>

		<div
			:class="'list-result-section list-result-section--'+status"
			:id="'result-section-'+status"
			:hidden="!statusOpen"
			role="list">
			<div
					class="list-result-article"
					v-for="(testResult, index) in testResults"
					:key='index'>
				<test-detail-anomaly
						v-if="testById[testResult.tanaguruTest]"
						v-show="tagFilters.length === 0 || testById[testResult.tanaguruTest].tags.some(tag => tagFilters.includes(tag))"
						:page-content="pageContent"
						:test-result="testResult"
						:test="testById[testResult.tanaguruTest]"
						:reference="reference"
						:sharecode="sharecode"
						:display-mode="'anomaly'"
						:index="index" />
			</div>
		</div>
	</div>
</template>

<script>
	import TestDetailAnomaly from './TestDetail'
	import IconBaseDecorative from '../../components/icons/IconBaseDecorative'
	import IconArrowBlue from '../../components/icons/IconArrowBlue'
	import IconCompliant from '../../components/icons/IconCompliant'
	import IconIgnored from '../../components/icons/IconIgnored'
	import IconImproper from '../../components/icons/IconImproper'
	import IconInforound from '../../components/icons/IconInforound'
	import IconNotApplicable from '../../components/icons/IconNotApplicable'
	import IconQualify from '../../components/icons/IconQualify'
	import IconUntested from '../../components/icons/IconUntested'

	export default {
		name: 'statusDetail',
		components: {
			TestDetailAnomaly,
			IconBaseDecorative,
			IconArrowBlue,
			IconInforound,
			IconCompliant,
			IconIgnored,
			IconImproper,
			IconNotApplicable,
			IconQualify,
			IconUntested,
		},
		props: ['status', 'testResults', 'tagFilters', 'reference', 'pageContent', 'testById', 'sharecode'],
		data(){
			return{
				statusOpen: false,
			}
		},
		methods: {
			toggleStatus(){
				this.statusOpen = !this.statusOpen
			},
		}
	}
</script>

<!-- Cross-components styles -->
<style lang="scss">
.list-result-article {
	position: relative;
}

@media print {
	#result-sectioncantTell,
	#result-sectioninapplicable,
	#result-sectionpassed {
		.result-content {
			display: none;
		}
	}
}
</style>
<!-- Cross-components styles -->

<style lang="scss" scoped>
.list-result-article {
	&:last-child {
		&::before {
			display: block;
			position: absolute;
			bottom: -.8rem;
			left: $left-column-mobile / 2;
			width: 1.4rem;
			height: 1.4rem;
			transform: translateX(-50%);
			border-width: 2px;
			border-style: solid;
			border-radius: 50%;
			background-color: $bg-primary;
			content: "";

			@media #{$media-md-viewport} {
				left: $left-column-desktop / 2;
			}
		}
		&::after {
			display: block;
			position: absolute;
			bottom: 0;
			left: $left-column-mobile;
			width: calc(100% - #{$left-column-mobile});
			height: 1px;
			background-color: $border-secondary;
			content: "";

			@media #{$media-md-viewport} {
				left: $left-column-desktop;
				width: calc(100% - #{$left-column-desktop});
			}
		}
	}
}

.list-result-section {
	&.list-result-section--failed {
		.list-result-article:last-child {
			&::before {
				border-color: $color-improper;
			}
		}
	}

	&.list-result-section--passed {
		.list-result-article:last-child {
			&::before {
				border-color: $color-compliant;
			}
		}
	}

	&.list-result-section--inapplicable {
		.list-result-article:last-child {
			&::before {
				border-color: $color-not-applicable;
			}
		}
	}

	&.list-result-section--cantTell {
		.list-result-article:last-child {
			&::before {
				border-color: $color-qualify;
			}
		}
	}

	&.list-result-section--untested {
		.list-result-article:last-child {
			&::before {
				border-color: $color-untested;
			}
		}
	}
}

.list-result-header {
	display: flex;
	align-items: center;
	margin-bottom: 1.6rem;

	@media #{$media-md-viewport} {
		margin-bottom: 3.6rem;
	}

	.list-result-header__icon {
		display: flex;
		flex: 0 0 $left-column-mobile;
		flex-direction: column;
		align-items: center;
		text-align: center;

		@media #{$media-md-viewport} {
			flex: 0 0 $left-column-desktop;
		}

		svg {
			width: 3.2rem;
			height: 3.2rem;

			@media #{$media-md-viewport} {
				width: 4.8rem;
				height: 4.8rem;
			}
		}
	}

	.list-result-header__heading {
		display: flex;
		flex: 1 1 auto;
		align-items: center;
		justify-content: space-between;

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
	}

	.list-result-header__title {
		margin: 0;

		&.list-result-header__title--failed {
			color: $color-improper;
		}

		&.list-result-header__title--passed {
			color: $color-compliant;
		}

		&.list-result-header__title--inapplicable {
			color: $color-not-applicable;
		}

		&.list-result-header__title--cantTell {
			color: $color-qualify;
		}

		&.list-result-header__title--untested {
			color: $color-untested;
		}
	}
}

@media print {
	.btn--tab {
		display: none;
	}

	.list-result-article {
		&:last-child {
			&::before {
				content: none;
			}
		}
	}
}
</style>
