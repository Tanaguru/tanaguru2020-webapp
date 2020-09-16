<template>
    <div class="test-hierarchy" :class="{ 'test-hierarchy--first': isFirstLevel, 'test-hierarchy--last': isLastLevel }" >
        <div class="test-hierarchy-header" :class="{ 'test-hierarchy-header--first': isFirstLevel, 'test-hierarchy-header--last': isLastLevel }" >
			<div class="test-hierarchy-header__inner">
				<span class="test-hierarchy-header__code">
					{{testHierarchy.code}}
					<icon-base-informative icon-label="results passed" v-if="testHierarchyResult && testHierarchyResult.status === 'passed'"><icon-compliant /></icon-base-informative>
					<icon-base-informative icon-label="results failed" v-if="testHierarchyResult && testHierarchyResult.status === 'failed'"><icon-improper /></icon-base-informative>
					<icon-base-informative icon-label="results can't tell" v-if="testHierarchyResult && testHierarchyResult.status === 'cantTell'"><icon-qualify /></icon-base-informative>
					<icon-base-informative icon-label="results inapplicable" v-if="testHierarchyResult && testHierarchyResult.status === 'inapplicable'"><icon-not-applicable /></icon-base-informative>
					<icon-base-informative icon-label="results not tested" v-if="!testHierarchyResult || testHierarchyResult.status === 'untested'"><icon-untested /></icon-base-informative>
				</span>
				<div v-if="testHierarchyResult">
					<span class="test-hierarchy-header__title">{{testHierarchy.name}}</span>
					<ul v-if="isFirstLevel" class="list-tests">
						<li class="list-tests__item">
							<icon-base-decorative width="16" height="16"><icon-compliant /></icon-base-decorative><span class="list-tests__nbr list-tests__nbr--success">{{ testHierarchyResult.nbP }}</span><span class="screen-reader-text">{{$t('entity.audit.passed')}}</span>
						</li>
						<li class="list-tests__item">
							<icon-base-decorative width="16" height="16"><icon-improper /></icon-base-decorative><span class="list-tests__nbr list-tests__nbr--failed">{{ testHierarchyResult.nbF }}</span><span class="screen-reader-text">{{$t('entity.audit.failed')}}</span>
						</li>
						<li class="list-tests__item">
							<icon-base-decorative width="16" height="16"><icon-qualify /></icon-base-decorative><span class="list-tests__nbr list-tests__nbr--cantTell">{{ testHierarchyResult.nbCT }}</span><span class="screen-reader-text">{{$t('entity.audit.cantTell')}}</span>
						</li>
						<li class="list-tests__item">
							<icon-base-decorative width="16" height="16"><icon-not-applicable /></icon-base-decorative><span class="list-tests__nbr list-tests__nbr--inapplicable">{{ testHierarchyResult.nbI }}</span><span class="screen-reader-text">{{$t('entity.audit.inapplicable')}}</span>
						</li>
						<li class="list-tests__item">
							<icon-base-decorative width="16" height="16"><icon-untested /></icon-base-decorative><span class="list-tests__nbr list-tests__nbr--untested">{{ testHierarchyResult.nbU }}</span><span class="screen-reader-text">{{$t('entity.audit.untested')}}</span>
						</li>
					</ul>
				</div>
			</div>
			<button
				v-if="isFirstLevel"
				class="btn btn--icon btn--nude btn--tab test-hierarchy-header__btn"
				:aria-expanded="showContent === true ? 'true' : 'false'"
				@click="toggleContent(!showContent)"
			>
				<icon-base-decorative :class="showContent === true ? 'hide' : 'show'"><icon-arrow-blue /></icon-base-decorative>
				<span v-if="!showContent">{{ $t('resultAudit.testResult.detailTabShow') }}</span>
				<span v-else>{{ $t('resultAudit.testResult.detailTabHide') }}</span>
			</button>

			<div v-else-if="isLastLevel" class="test-hierarchy-header__actions">
				<a v-if="testHierarchy.urls[0]" :href="testHierarchy.urls[0]" class="test-link">
					<img :alt="$t('resultAudit.testResult.ruleLink') + ' ' + reference.name + '-' + testHierarchy.code" src="/assets/images/explication.svg" />
				</a>

				<button
                    v-if="testHierarchyResult && testHierarchyResult.status !== 'untested' && testResultsSelection.length > 0"
					class="btn btn--icon btn--nude btn--tab"
					@click="toggleContent(!showContent)"
					:aria-expanded="showContent === true ? 'true' : 'false'"
				>
					<icon-base-decorative :class="showContent === true ? 'hide' : 'show'"><icon-arrow-blue /></icon-base-decorative>
					<span class="screen-reader-text" v-if="showContent">{{ $t('resultAudit.testResult.hide') }}</span>
					<span class="screen-reader-text" v-else>{{ $t('resultAudit.testResult.show') }}</span>
				</button>
			</div>

			<div v-else class="test-hierarchy-header__actions">
				<a v-if="testHierarchy.urls[0]" :href="testHierarchy.urls[0]" class="test-link">
					<img :alt="$t('resultAudit.testResult.ruleLink') + ' ' + reference.name + '-' + testHierarchy.code" src="/assets/images/explication.svg" />
				</a>
				<button
					class="btn btn--nude btn--icon btn--tab"
					@click="toggleContent(!showContent)"
					:aria-expanded="showContent === true ? 'true' : 'false'">
					<icon-base-decorative :class="showContent === true ? 'hide' : 'show'"><icon-arrow-blue /></icon-base-decorative>
					<span class="screen-reader-text" v-if="showContent">{{ $t('resultAudit.testResult.hide') }}</span>
					<span class="screen-reader-text" v-else>{{ $t('resultAudit.testResult.show') }}</span>
				</button>
			</div>
		</div>

        <div class="test-hierarchy-content" v-show="showContent" v-if="testHierarchyResult && pageContent && hasBeenToggled">
            <template v-if="testHierarchy.children">
                <test-hierarchy-detail
                    v-for="child in testHierarchy.children"
                    v-if="childrenResult[child.id]"
                    :key="child.id"
                    :rank="rank + 1"
                    :test-hierarchy="child"
                    :page-content="pageContent"
                    :tag-filters="tagFilters"
                    :reference="reference"
                    :test-hierarchy-result="childrenResult[child.id]"
                    :test-by-id="testById"
                    :parent-result="testHierarchyResult"
                    :sharecode="sharecode"/>
            </template>

            <template v-for="testResult of testResultsSelection">
                <test-detail
					:key="testResult.id"
					:test-result="testResult"
					:test="testById[testResult.tanaguruTest]"
					:page-content="pageContent"
					:reference="reference"
					:sharecode="sharecode"
					:display-mode="'reference'"
				/>
            </template>
        </div>
    </div>
</template>

<script>
    import TestHierarchyDetail from "./TestHierarchyDetail"
    import TestDetail from "./TestDetail"
	import IconBaseInformative from '../../components/icons/IconBaseInformative'
    import IconBaseDecorative from '../../components/icons/IconBaseDecorative'
	import IconArrowBlue from '../../components/icons/IconArrowBlue'
    import IconCompliant from '../../components/icons/IconCompliant'
    import IconImproper from '../../components/icons/IconImproper'
    import IconInforound from '../../components/icons/IconInforound'
    import IconNotApplicable from '../../components/icons/IconNotApplicable'
    import IconQualify from '../../components/icons/IconQualify'
    import IconUntested from '../../components/icons/IconUntested'
    import IconExplanation from '../../components/icons/IconExplanation'
	import TestDetailAnomaly from "./TestDetail";

    export default {
        name: "testHierarchyDetail",
        props: ['testHierarchy', 'testHierarchyResult', 'testById', 'reference', 'tagFilters', 'pageContent', 'rank', 'sharecode', 'parentResult'],
        components: {
			TestDetailAnomaly,
			TestDetail,
			TestHierarchyDetail,
			IconBaseDecorative,
            IconArrowBlue,
            IconBaseInformative,
            IconInforound,
            IconCompliant,
            IconImproper,
            IconQualify,
            IconNotApplicable,
            IconUntested,
            IconExplanation,
		},
        data() {
          return {
			  showContent: false,
			  isFirstLevel: this.rank === 0,
			  isLastLevel: false,
			  testResults: [],
              childrenResult: {},
              hasBeenToggled: false,
              testResultChildrenByHierarchy: {}
		  }
        },
		created(){
            this.testHierarchyResultService.findByParent(
                this.testHierarchyResult.id,
                this.sharecode,
                (children) =>{
                    this.$set(this.testHierarchyResult, 'children', children)
                    for(const child of children){
                        this.$set(this.childrenResult, child.testHierarchy.id, child)
                    }
                },
                (error) => {
                    console.error(error)
                }
            )

            this.testHierarchyService.findByParent(
                this.testHierarchy.id,
                (children) =>{
                    this.$set(this.testHierarchy, 'children', children)
                    this.isLastLevel = children.length === 0;

                    if(this.isLastLevel && this.testHierarchyResult.status != 'untested'){
                        this.testResultService.findAllByTestHierarchyResult(
                            this.testHierarchyResult.id,
                            this.sharecode,
                            (testResults) => {
                                this.testResults = testResults;
                            },
                            (error) =>  {
                                console.error(error);
                            }
                        )
                    }
                },
                (error) => {
                    console.error(error)
                }
            );
		},
        computed: {
            testResultsSelection(){
                let result =  this.testResults.filter(testResult => {
                    return this.tagFilters.length === 0 ||
                        this.testById[testResult.tanaguruTest].tags
                            .some(tag => this.tagFilters.includes(tag))
                })
                return result;
            }
        },
		methods: {
        	toggleContent(value){
        		this.showContent = value;
        		this.hasBeenToggled = true;
			}
		}
    }
</script>

<style lang="scss" scoped>
.test-hierarchy {
	margin-bottom: 3.2rem;

	&.test-hierarchy--first {
		position: relative;
		padding-top: 3.2rem;
	}

	&.test-hierarchy--last {
		position: relative;

		&:first-child {
			&::before {
				@media #{$media-sm-viewport} {
					position: absolute;
					top: -2.5rem;
					left: -2rem;
					width: 3.2rem;
					height: 5rem;
					border-bottom: 2px dashed $border-secondary;
					border-left: 2px dashed $border-secondary;
					content: "";
				}
			}
		}

		.test-hierarchy-content {
			margin-left: 0;
			border-top: 0;

			&::after {
				@media #{$media-sm-viewport} {
					position: absolute;
					top: 0;
					bottom: 0;
					left: 4.8rem;
					display: block;
					width: .1rem;
					height: 100%;
					border-left: 2px dashed $border-secondary;
					content: "";
					z-index: -1;
				}
			}
		}
	}
}

.test-hierarchy-header {
	position: relative;
	display: flex;
	margin-bottom: 3.2rem;
	align-items: center;
	justify-content: space-between;

	&:not(.test-hierarchy-header--first):not(.test-hierarchy-header--last) {
		padding-top: 3.2rem;

		&::after {
			position: absolute;
			top: 0;
			right: 0;
			left: 2.3rem;
			width: calc(100% - 2.3rem);
			height: 1px;
			background-color: $border-secondary;
			content: "";
		}
	}

	.test-hierarchy-header__inner {
		display: flex;
		align-items: center;
	}

	.test-hierarchy-header__actions {
		display: flex;

		.btn--tab {
			margin-left: 1.6rem;
		}
	}

	.test-hierarchy-header__btn {
		position: absolute;
		top: 0;
		right: 0;

		@media #{$media-sm-viewport} {
			position: static;
		}
	}

	&.test-hierarchy-header--first {
		.test-hierarchy-header__title {
			color: $text-secondary;
			font-size: 2rem;
			font-weight: 600;

			@media #{$media-sm-viewport} {
				font-size: 2.4rem;
			}
		}

		.btn--tab {
			span {
				@extend %screen-reader-text;

				@media #{$media-sm-viewport} {
					position: static;
					width: auto;
					height: auto;
					clip: unset;
					clip-path: none;
				}
			}
		}
	}

	&.test-hierarchy-header--last {
		margin-bottom: 0;

		.test-hierarchy-header__title {
			font-weight: 600;
		}
	}

	.test-hierarchy-header__code {
		position: relative;
		display: inline-block;
		flex: 0 0 auto;
		margin-right: .8rem;
		padding: .5rem;
		min-width: 4.2rem;
		min-height: 4.2rem;
		background-color: $bg-primary;
		border: 2px solid $text-secondary;
		border-radius: .6rem;
		color: $text-secondary;
		font-family: $font-stack-secondary;
		font-size: $small-font-size;
		font-weight: bold;
		text-align: center;

		@media #{$media-sm-viewport} {
			margin: 0 2.3rem;
			padding: .5rem .1rem;
			min-width: 5rem;
			min-height: 5rem;
			font-size: $medium-font-size;
		}

		svg {
			position: absolute;
			right: -.6rem;
			bottom: -.6rem;
			width: 1.5rem;
			height: 1.5rem;

			@media #{$media-sm-viewport} {
				width: 2rem;
				height: 2rem;
			}
		}
	}

	.test-hierarchy-header__title {
		flex: 0 1 auto;
		font-family: $font-stack-secondary;
		font-size: 1.6rem;
		line-height: 1;

		@media #{$media-sm-viewport} {
			font-size: 2rem;
		}
	}
}

.test-hierarchy-content {
	@media #{$media-sm-viewport} {
		margin-left: 6.6rem;
	}
}

.list-tests {
	display: flex;
	align-items: center;
	margin: 0;
	padding: 0;
	list-style: none;
	line-height: 1;

	.list-tests__item {
		&:not(:last-child) {
			padding-right: .5rem;

			@media #{$media-sm-viewport} {
				padding-right: .8rem;
			}

			&::after {
				display: inline-block;
				width: .2rem;
				height: 2rem;
				margin-left: .8rem;
				background-color: $border-secondary;
				content: "";
				vertical-align: middle;
			}
		}

		> * {
			vertical-align: middle;
		}

		.list-tests__nbr {
			margin-left: .4rem;

			&.list-tests__nbr--success {
				color: $color-compliant;
			}

			&.list-tests__nbr--failed {
				color: $color-improper;
			}

			&.list-tests__nbr--cantTell {
				color: $color-qualify;
			}

			&.list-tests__nbr--inapplicable {
				color: $color-not-applicable;
			}

			&.list-tests__nbr--untested {
				color: $color-untested;
			}
		}
	}
}

.list-explanations {
	margin: 0 0 3.2rem 0;
	padding-left: 12.6rem;
	max-width: 80rem;
	font-family: $font-stack-secondary;
	font-size: $medium-font-size;
	list-style-type: none;

	.list-explanations__item {
		position: relative;

		&::before {
			position: absolute;
			top: 1.8rem;
			left: -2rem;
			width: .3rem;
			height: .3rem;
			background-color: $text-primary;
			border-radius: 50%;
			content: "";
		}
	}
}

.test-link {
	display: none;

	@media #{$media-sm-viewport} {
		display: block;
	}

	img {
		vertical-align: middle;
	}
}

@media print {
	.btn--tab {
		display: none;
	}

	.test-hierarchy-header {
		display: block;
		margin-bottom: 0;

		.test-hierarchy-header__actions {
			margin-bottom: 1rem;
			margin-left: 9.6rem;
		}
	}

	.test-hierarchy {
		&.test-hierarchy--first {
			&::after {
				content: none;
			}
		}

		&.test-hierarchy--last {
			&:first-child {
				&::before {
					content: none;
				}
			}

			&:not(:last-child) {
				&::after {
					content: none;
				}
			}

			&:not(:first-child) {
				&::before {
					content: none;
				}
			}

			.test-hierarchy-content {
				&::after {
					content: none;
				}
			}
		}
	}
}
</style>
