<template>
    <main id="page" class="page" role="main" v-if="audit && page && references">
        <div class="wrapper">
            <Breadcrumbs :breadcrumbsItems='breadcrumbProps' ></Breadcrumbs>
		</div>

        <display-options
                v-if="references.length > 0"
                class="wrapper"
                :tags="tags"
                :display-mode="displayMode"
                :selected-tags="tagFilters"
                :references="references"
                :selected-reference-index="selectedReferenceIndex"
                @selectReferenceIndex="onSelectReference"
                @selectTag="(tag) => tagFilters.push(tag)"
                @removeTag="(tag) => tagFilters.splice(tagFilters.indexOf(tag), 1)"
                @selectDisplayMode="(dm) => displayMode = dm"/>

		<div class="wrapper">
			<page-result-info
                v-if="audit && page && pageContent && reference"
                :resultSectionOpen="resultSectionOpen"
                :display-mode="displayMode"
                :audit="audit"
                :page="page"
                :page-content="pageContent"
                :totalPages="totalPages"
                :reference="reference"
                :percentage="percentageSuccess"
                :nb-anomaly="nbAnomaly"
                :nb-element-tested="nbElementTested"
                :sharecode="sharecode"
            />
		</div>

        <hr role="presentation" class="separator separator--main" />

		<div class="wrapper">
			<page-result-overview
                :nb-failed="nbFailed"
                :nb-cant-tell="nbCantTell"
                :nb-untested="nbUntested"
                :nb-passed="nbPassed"
                :nb-inapplicable="nbInapplicable"
                :anomaly-per-theme-labels="anomalyPerThemeLabels"
                :anomaly-per-theme-data="anomalyPerThemeData" />
		</div>

		<img class="audit-results-separator" src="/assets/images/circledash.svg" alt="" width="16" height="64"/>

        <section class="audit-results">
            <div class="wrapper">
                <header class="audit-results__header">
                    <h2 class="audit-results__title">{{$t('resultAudit.testResult.title')}}</h2>
                </header>
            </div>

			<div class="audit-results__wrapper">
                <page-result-anomaly-view
                        v-if="pageContent && testResultsByStatusByReference[reference.id] && testsByReference[reference.id]"
                        v-show="displayMode==='anomaly'"
                        :tag-filters="tagFilters"
                        :testById="testById"
                        :page-content="pageContent"
                        :sharecode="sharecode"
                        :reference="reference"
                        :test-result-by-status="testResultsByStatusByReference[reference.id]"
                />

                <page-result-repository-view
                    v-if="pageContent && referenceResult"
                    v-show="displayMode==='references'"
                    :test-hierarchy-result="referenceResult"
                    :tag-filters="tagFilters"
                    :page-content="pageContent"
                    :reference="reference"
                    :testById="testById"
                    :sharecode="sharecode"/>

			</div>

        </section>
		<BackToTop />
    </main>
</template>

<script>
    import Breadcrumbs from '../../components/Breadcrumbs';
    import BackToTop from '../../components/BackToTop';
    import DisplayOptions from './DisplayOptions';
    import IconBaseDecorative from '../../components/icons/IconBaseDecorative'
    import IconBaseInformative from '../../components/icons/IconBaseInformative'
    import IconArrowBlue from '../../components/icons/IconArrowBlue'
    import IconTop from '../../components/icons/IconTop'
    import PageResultInfo from "./PageResultInfo";
    import PageResultOverview from "./PageResultOverview";
    import PageResultAnomalyView from "./PageResultAnomalyView";
    import PageResultRepositoryView from "./PageResultRepositoryView";

    export default {
        name: "pageDetail",
        components: {
            PageResultRepositoryView,
            PageResultAnomalyView,
            PageResultOverview,
            PageResultInfo,
            Breadcrumbs,
            DisplayOptions,
            BackToTop,
            IconBaseDecorative,
            IconBaseInformative,
            IconArrowBlue,
            IconTop
        },
        data() {
            return {
                sharecode: null,

                project: null,
                audit: {},
                page: null,
                pageContent: null,
                pages : [],
                totalPages: null,
                parameters: [],

                references: [],
                selectedReferenceIndex: 0,

                testsByReference: {},
                testById: {},
                testResultById: {},
                statusResultByReference: {},
                referenceResultByReference: {},
                testResultsByReference: {},
                testResultsByStatusByReference: {},

                tagFilters: [],
                displayMode: "anomaly",
                resultSectionOpen: false,
                allShown: true,
                allHidden: true,
    			scrollpx : 0,
            };
        },
        metaInfo() {
			return {
				// if no subcomponents specify a metaInfo.title, this title will be used
				title: 'Tanaguru - ' + this.$i18n.t("page.auditDetail"),
				title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.auditResult"),
				meta: [
					{
						name: 'robots', content: 'noindex'
					}
				]
			}
        },
        methods: {
            getAudit(){
                this.auditService.findById(
                    this.$route.params.auditId,
                    this.sharecode,
                    (audit) => {
                        this.audit = audit;
                        this.projectService.findByAuditId(
                            audit.id,
                            this.sharecode,
                            (project) => {
                                this.project = project;
                            },
                            (error) => {
                                console.error(error);
                            }
                        );

                        this.pageService.findByAuditId(
                            audit.id,
                            audit.shareCode,
                            this.$route.params.pageId,
                            1,
                            (pages) => {
                                this.pages = pages;
                                this.totalPages= pages.totalPages
                            },
                            (error) => {
                                this.errorMsg = "There was an issue retrieving the data. Please try again later or verify if you are allowed to access it (" + error + ")."
                            }
                        )
                    },
                    (error) => {
                        console.error(error);
                    }
                );
            },
            getAuditReferences(){
                this.testHierarchyService.findAllReferenceByAudit(
                    this.$route.params.auditId,
                    this.sharecode,
                    (references) => {
                        this.references = references;
                        this.onSelectReference(0);
                    },
                    (error) => {
                        console.error(error);
                    }
                )
            },

            getAuditParameters(){
                this.auditParametersService.findByAuditId(
                    this.$route.params.auditId,
                    this.sharecode,
                    (parameters) => {
                        this.parameters = parameters;
                    },
                    (error) => {
                        console.error(error);
                    }
                );
            },
            getPage(){
                this.pageContentService.findByPageId(
                    this.$route.params.pageId,
                    this.sharecode,
                    (pageContent) => {
                        this.pageContent = pageContent;
                        const parser = new DOMParser();
                        this.pageContent.dom = parser.parseFromString(pageContent.source,"text/html");
                    },
                    (error) => {
                        console.error(error)
                    }
                )

                this.pageService.findById(
                    this.$route.params.pageId,
                    this.sharecode,
                    (page) => {
                        this.page = page;
                    },
                    (error) => {
                        console.error(error);
                    }
                );
            },
            onSelectReference(index){
                const reference = this.references[index];
                this.selectedReferenceIndex = index;

                if(!reference.children){
                    this.testHierarchyService.findByParent(
                        reference.id,
                        (children) => {
                            this.$set(reference, 'children', children);
                        }
                    )
                }

                if(this.audit && !this.statusResultByReference[reference.id]) {
                    this.statusResultService.findByPageAndTestHierarchy(
                        this.$route.params.pageId,
                        this.audit.shareCode,
                        reference.id,
                        (statusResult) =>{
                            this.$set(this.statusResultByReference, reference.id, statusResult);
                        },
                        (error)=>{
                            console.error("Cannot find status result for current page");
                        }
                    )
                }

                if(!this.referenceResultByReference[reference.id]){
                    this.testHierarchyResultService.findByPageAndTestHierarchy(
                        this.$route.params.pageId,
                        reference.id,
                        this.sharecode,
                        (referenceResult) =>{
                            this.$set(this.referenceResultByReference, reference.id, referenceResult);
                            this.testHierarchyResultService.findByParent(
                                referenceResult.id,
                                this.sharecode,
                                (childrenResults) => {
                                    this.$set(referenceResult, 'children', childrenResults);
                                }
                            );
                        },
                        (error) => {
                            console.error(error);
                        }
                    )
                }

                if(!this.testResultsByReference[reference.id]) {
                    this.testResultService.findAllByReferenceAndPage(
                        reference.id,
                        this.$route.params.pageId,
                        this.sharecode,
                        (testResults) => {
                            this.testResultsByReference[reference.id] = testResults;
                            this.$set(this.testResultsByStatusByReference, reference.id, {});
                            for(const testResult of testResults){
                                if(!this.testResultsByStatusByReference[reference.id][testResult.status]){
                                    this.$set(this.testResultsByStatusByReference[reference.id], testResult.status, []);
                                }
                                this.testResultsByStatusByReference[reference.id][testResult.status].push(testResult);
                                this.$set(this.testResultById, testResult.id, testResult);
                            }
                        },
                        (error) => {
                            console.error(error);
                        }
                    )
                }

                if(!this.testsByReference[reference.id]){
                    this.tanaguruTestService.findAllByReference(
                        reference.id,
                        (tests) => {
                            for(const test of tests){
                                this.testById[test.id] = test;
                            }
                            this.$set(this.testsByReference, reference.id, tests);
                        },
                        (error) => {
                            console.error(error)
                        }
                    )
                }
            },

            handleScroll() {
                this.scrollpx = window.scrollY;
            },

            scrollToTop(index) {
                document.getElementById('page').scrollIntoView();
            },
        },
        created() {
            this.sharecode = this.$route.params.sharecode;
            this.getAudit();
            this.getAuditReferences();
            this.getPage();
            this.getAuditParameters();
            console.log('1:', this.reference)
            console.log('2:', this.statusResultByReference)
            console.log('3:', this.referenceResult)
        },
        computed: {
            reference(){
                return this.references[this.selectedReferenceIndex] ?
                    this.references[this.selectedReferenceIndex] :
                    null
            },

            referenceResult(){
              return this.reference && this.referenceResultByReference[this.reference.id] ?
                  this.referenceResultByReference[this.reference.id] :
                  null
            },

            statusResult(){
                return this.reference && this.statusResultByReference[this.reference.id] ?
                    this.statusResultByReference[this.reference.id] :
                    null
            },

            testResults(){
                return this.reference && this.testResultsByReference[this.reference.id] ?
                    this.testResultsByReference[this.reference.id] :
                    null
            },
            percentageSuccess() {
                let result = 0;
                if(this.displayMode === 'anomaly' && this.statusResult){
                    result = this.statusResult.nbTP / (this.statusResult.nbTP + this.statusResult.nbTF);
                }else if(this.displayMode === 'references' && this.referenceResult){
                    result = this.referenceResult.nbP / (this.referenceResult.nbP + this.referenceResult.nbF);
                }
                return Math.round(result * 100)
            },

            nbAnomaly(){
                let result = 0;
                if(this.displayMode === 'anomaly' && this.statusResult){
                    result = this.statusResult.nbEF;
                }else if(this.displayMode === 'references' && this.referenceResult){
                    result = this.referenceResult.nbEF;
                }
                return result;
            },

            nbElementTested(){
                let result = 0;
                if(this.displayMode === 'anomaly' && this.statusResult){
                    result = this.statusResult.nbET;
                }else if(this.displayMode === 'references' && this.referenceResult){
                    result = this.referenceResult.nbET;
                }
                return result;
            },

            anomalyPerThemeLabels(){
                let result = [];
                if(this.reference && this.reference.children){
                    return this.reference.children.map(child => {
                        return child.name
                    })
                }
                return result;
            },

            anomalyPerThemeData(){
                let result = [];
                if(this.referenceResult && this.referenceResult.children){
                    return this.referenceResult.children.map(child => {
                        return child.nbEF;
                    })
                }
                return result;
            },

            nbFailed(){
                let result = 0;
                if(this.displayMode === 'anomaly' && this.statusResult){
                    result = this.statusResult.nbTF;
                }else if(this.displayMode === 'references' && this.referenceResult){
                    result = this.referenceResult.nbF;
                }
                return result;
            },

            nbPassed(){
                let result = 0;
                if(this.displayMode === 'anomaly' && this.statusResult){
                    result = this.statusResult.nbTP;
                }else if(this.displayMode === 'references' && this.referenceResult){
                    result = this.referenceResult.nbP;
                }
                return result;
            },

            nbCantTell(){
                let result = 0;
                if(this.displayMode === 'anomaly' && this.statusResult){
                    result = this.statusResult.nbTCT;
                }else if(this.displayMode === 'references' && this.referenceResult){
                    result = this.referenceResult.nbCT;
                }
                return result;
            },

            nbUntested(){
                let result = 0;
                if(this.displayMode === 'anomaly' && this.statusResult){
                    result = 0;
                }else if(this.displayMode === 'references' && this.referenceResult){
                    result = this.referenceResult.nbU;
                }
                return result;
            },

            nbInapplicable(){
                let result = 0;
                if(this.displayMode === 'anomaly' && this.statusResult){
                    result = this.statusResult.nbTI;
                }else if(this.displayMode === 'references' && this.referenceResult){
                    result = this.referenceResult.nbI;
                }
                return result;
            },
            tags() {
                let result = [];
                if(this.reference && this.testsByReference[this.reference.id]){
                    let tagMap = {};
                    for(const test of this.testsByReference[this.reference.id]){
                        for(const tag of test.tags){
                            tagMap[tag.trim()] = true;
                        }
                    }
                    result = Object.keys(tagMap)
                }
                return result;
            },
            breadcrumbProps() {
                const breadcrumb = [
                    {
                        name: this.$i18n.t("page.dashboard"),
                        path: "/",
                    },
                ];

                if (this.project) {
                    breadcrumb.push({
                        name: this.project.contract.name,
                        path: "/contracts/" + this.project.contract.id,
                    });

                    breadcrumb.push({
                        name: this.project.name,
                        path: "/projects/" + this.project.id,
                    });
                }

                if (this.audit) {
                    breadcrumb.push({
                        name: this.audit.name,
                        path: '/audits/' + this.audit.id + (this.sharecode ? '/' + this.sharecode : '')
                    });
                }

                breadcrumb.push({
                    name: this.page.name,
                });
                return breadcrumb;
            }
        }
    };
</script>

<style lang="scss" scoped>
.page {
	position: relative;
}

/* Results section */
.audit-results-separator {
	display: block;
	margin: 0 auto 1.6rem;
}

.audit-results {
	position: relative;
	max-width: calc(#{$wrapper-width} + 19.2rem);
	margin: 0 auto;
	padding: 0 $wrapper-spacing;

	&:before {
		position: absolute;
		right: 0;
		left: 0;
		width: 100%;
		height: 28rem;
		z-index: -1;
		box-shadow: 2px 16px 16px 0 $color-white, 2px 2px 16px 0 $color-shadow;
		content: "";
	}

	.audit-results__header {
		display: flex;
		padding: 2.4rem 0;
		align-items: center;
		justify-content: space-between;

		@media #{$media-md-viewport} {
			padding: 4.8rem 0;
		}

		.actions-list {
			.btn--tab {
				svg {
					width: 3.2rem;
					height: 3.2rem;

					@media #{$media-xs-viewport} {
						width: 2.4rem;
						height: 2.4rem;
					}
				}

				span {
					@extend %screen-reader-text;

					@media #{$media-xs-viewport} {
						position: static;
						width: auto;
						height: auto;
						clip: unset;
						clip-path: none;
					}
				}
			}
		}
	}

	.audit-results__title {
		margin: 0;
	}

	.audit-results__wrapper {
		max-width: $wrapper-width;
		margin: 0 auto;
		padding: 0 1.6rem;
	}
}

.separator--main {
	display: none;

	@media #{$media-md-viewport} {
		display: block;
	}
}

@media print {
	.audit-results-separator {
		display: none;
	}

	.audit-results {
		&:before {
			content: none;
		}

		.audit-results__wrapper {
			max-width: none;
		}

		.audit-results__header {
			padding: 1rem 0;
		}
	}
}
</style>
