<template>
    <div id="page" class="tabs-wrapper tabs-synthesis">
        <section class="audit-synthesis">
            <header>
                <h1 class="title-synthesis">
                    <span class="title-synthesis__type" v-if="audit.type === 'SITE'">{{
                            $t('entity.audit.site')
                        }}</span>
                    <span class="title-synthesis__type" v-else-if="audit.type === 'PAGE'">{{
                            $t('entity.audit.page')
                        }}</span>
                    <span class="title-synthesis__type"
                          v-else-if="audit.type === 'SCENARIO'">{{ $t('entity.audit.scenario') }}</span>
                    <span class="title-synthesis__type" v-else>{{ $t('entity.audit.upload') }}</span>
                    {{ audit.name }}
                </h1>
            </header>
            <div class="audit-infos">
                <div class="audit-infos__stats">
                    <div class="audit-stats">
                        <div class="audit-stats__chart">
                            <CircularProgressChart
                                :percentage="percentageSuccess"
                                :shadowOne="'chart-shadow1-' + audit.id"
                                :shadowTwo="'chart-shadow2-' + audit.id"
                                :gradient="'chart-gradient-' + audit.id"/>
                        </div>
                        <p class="audit-stats__recap audit-stats-recap" v-if="auditReferenceResult">
                            <span class="audit-stats-recap__number">{{ auditReferenceResult.nbEF }}</span>
                            <span class="audit-stats-recap__unit"> {{ $t('entity.generic.anomalies') }}</span>
                        </p>
                    </div>
                </div>

                <div class="audit-infos__inner">
                    <div class="audit-caps"
                        v-if="mainPageContent && mainPageContent.screenshot"
                        :style="`background-image:url(data:image/png;base64,` + mainPageContent.screenshot + `)`">
                    </div>

                    <div class="audit-list" v-if="pages.length > 1">
                        <ul class="audit-list-infos">
                            <li>
                                <span>{{ $t('entity.audit.url') }} : </span>
                                <a :href="pages[0].url" class="link-simple audit-list-infos__domain">{{
                                        pages[0].url
                                    }}</a>
                            </li>
                            <li>
                                <span>{{ $t("entity.audit.dateStart") }} : </span>
                                {{ moment(audit.dateStart).format('LL') }}
                            </li>
                            <li v-if="pages.length > 1">
                                <span>{{ $t('auditDetail.synthesis.pages') }} :</span>
                                {{ totalPages }}
                            </li>
                            <li>
                                <span>{{ $t('auditDetail.synthesis.guidelines') }} :</span>
                                <div class="select" v-if="references.length > 0">
                                    <select name="status-select" id="status-select" v-model="selectedReference" required
                                            @change="onSelectReference">
                                        <option v-for="reference in references" :value="reference" :key="reference.id">
                                            {{ reference.name }}
                                            ({{ reference.code }})
                                        </option>
                                    </select>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <hr role="presentation" class="separator separator--main"/>

        <div class="wrapper">
            <page-result-overview
                v-if="auditReferenceResult"
                :nb-failed="numberOfTestsResult.nbF"
                :nb-cant-tell="numberOfTestsResult.nbCT"
                :nb-untested="numberOfTestsResult.nbU"
                :nb-passed="numberOfTestsResult.nbP"
                :nb-inapplicable="numberOfTestsResult.nbI"
                :anomaly-per-theme-labels="anomalyPerThemeLabels"
                :anomaly-per-theme-data="anomalyPerThemeData"
            />
        </div>

        <hr role="presentation" class="separator separator--main"/>

        <h2 id="table-desc" class="table-title">{{
                $t('auditDetail.synthesis.table.title')
            }}<span>{{ $t('auditDetail.synthesis.table.title-info') }}</span></h2>

        <div v-if="selectedReference && totalSynthesisPageByReferenceId[selectedReference.id]">
            <div class="table-pagination">
                <pagination
                    :current-page="currentSynthesisPage"
                    :total-pages="totalSynthesisPageByReferenceId[selectedReference.id]"
                    @changePage="changePage"
                />
            </div>

            <div class="table-container">
                <table aria-describedby="table-desc"
                       class="table-tests table-header-rotated table-striped table-striped-column"
                       v-if="currentSynthesis">
                    <thead>
                        <tr>
                            <td class="no-border"></td>
                            <th scope="col" class="rotate">
                                <div class="rotate__inner">
                                    <span class="page">
                                    {{$t('auditDetail.synthesis.allPages')}}
                                    </span>
                                </div>
                            </th>
                            <th scope="col" class="rotate" v-for="(page, i) in pages" :key="i">
                                <HeaderRow :page="page" :i="i" :currentSynthesisPage="currentSynthesisPage"/>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(criteriaResultByPage, criteriaCode) in currentSynthesis" :key="criteriaCode">
                            <th scope="row" class="row-header">Test {{ criteriaCode }}</th>
                            <td>
                                <button class="btn btn--nude" @click="openGlobalTestModal(audit, criteriaResultByPage[Object.keys(criteriaResultByPage)[0]]['testHierarchy'], globalTestResultForPages[criteriaCode], pageConcerned(criteriaCode), pages)">
                                    <icon-base-decorative>
                                        <icon-improper v-if="globalTestResultForPages[criteriaCode] === 'failed'"/>
                                        <icon-compliant v-else-if="globalTestResultForPages[criteriaCode] === 'passed'"/>
                                        <icon-qualify v-else-if="globalTestResultForPages[criteriaCode] === 'cantTell'"/>
                                        <icon-notApplicable v-else/>
                                    </icon-base-decorative>
                                </button>
                                <span class="td-background"></span>
                            </td>
                            <td v-for="(criteriaResult, pageId, indexPage) in criteriaResultByPage" :key="pageId">
                                <button class="btn btn--nude" @click="openModal(audit, pageById[pageId], criteriaResult, indexPage)">
                                    <icon-base-decorative>
                                        <icon-improper v-if="criteriaResult.status === 'failed'"/>
                                        <icon-compliant v-else-if="criteriaResult.status === 'passed'"/>
                                        <icon-qualify v-else-if="criteriaResult.status === 'cantTell'"/>
                                        <icon-notApplicable v-else/>
                                    </icon-base-decorative>
                                    <span class="screen-reader-text">{{$t('auditDetail.synthesis.table.btnShow', {status: criteriaResult.status})}}</span>
                                </button>
                                <span class="td-background"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div id="fetching-data" v-else>
                    <p aria-live="polite">{{$t('auditDetail.synthesis.loading')}}</p>
                    <img src="/assets/images/desktop-home-middle.svg" alt="" />
                </div>
                <vue-accessible-modal>
                    <template v-slot:backdrop></template>
                </vue-accessible-modal>
            </div>
        </div>
        <div id="fetching-data" v-else>
            <p aria-live="polite">{{$t('auditDetail.synthesis.loading')}}</p>
            <img src="/assets/images/desktop-home-middle.svg" alt="" />
        </div>
    </div>
</template>

<script>
import IconBaseDecorative from '../../components/icons/IconBaseDecorative';
import IconArrowBlue from '../../components/icons/IconArrowBlue';
import IconCompliant from '../../components/icons/IconCompliant';
import IconImproper from '../../components/icons/IconImproper';
import IconInforound from '../../components/icons/IconInforound';
import IconNotApplicable from '../../components/icons/IconNotApplicable';
import IconQualify from '../../components/icons/IconQualify';
import AnomalyModal from './AnomalyModal';
import CircularProgressChart from '../../components/charts/CircularProgressChart';
import PageResultOverview from "../PageDetail/PageResultOverview";
import Pagination from "../../components/Pagination";
import HeaderRow from "./HeaderRow.vue";
import AnomalyGlobalTestModal from './AnomalyGlobalTestModal';

export default {
    name: 'Synthesis',
    components: {
        Pagination,
        IconBaseDecorative,
        IconArrowBlue,
        IconCompliant,
        IconImproper,
        IconNotApplicable,
        IconQualify,
        IconInforound,
        AnomalyModal,
        CircularProgressChart,
        PageResultOverview,
        HeaderRow,
        AnomalyGlobalTestModal
    },
    props: ['audit', 'totalPages'],
    data() {
        return {

            mainPageContent: null,
            principleResultsByReference: {},

            references: [],
            pages: [],
            pageById: {},

            selectedReference: null,
            selectedPage: null,

            synthesisPageByReferenceId: {},
            currentSynthesisPage: 0,
            totalSynthesisPageByReferenceId: {},
            globalTestResultForPages: {}
        }
    },
    created() {

        this.testHierarchyService.findAllReferenceByAudit(
            this.audit.id,
            this.audit.sharecode,
            (references) => {
                this.references = references;
                this.selectedReference = references[0];
                this.onSelectReference();
            },
            (error) => {
                console.error(error);
            }
        );

        this.pageContentService.findFirstByAuditId(
            this.audit.id,
            this.audit.sharecode,
            (pageContent) => {
                this.mainPageContent = pageContent;
            },
            (error) => {
                console.error(error);
            },
        );
    },
    computed: {
        auditReferenceResult() {
            let result = {
                'nbF': 0,
                'nbP': 0,
                'nbI': 0,
                'nbU': 0,
                'nbCT': 0,
                'nbTF': 0,
                'nbTP': 0,
                'nbTI': 0,
                'nbTCT': 0,
                'nbECT': 0,
                'nbEF': 0,
                'nbEP': 0,
            };
            if (this.selectedReference && this.principleResultsByReference[this.selectedReference.id]) {
                let principleResults = this.principleResultsByReference[this.selectedReference.id];
                for (const principleResult of principleResults) {
                    result.nbF += principleResult.nbF;
                    result.nbP += principleResult.nbP;
                    result.nbI += principleResult.nbI;
                    result.nbU += principleResult.nbU;
                    result.nbCT += principleResult.nbCT;
                    result.nbTF += principleResult.nbTF;
                    result.nbTP += principleResult.nbTP;
                    result.nbTI += principleResult.nbTI;
                    result.nbTCT += principleResult.nbTCT;
                    result.nbTU += principleResult.nbTU;
                    result.nbECT += principleResult.nbECT;
                    result.nbEF += principleResult.nbEF;
                    result.nbEP += principleResult.nbEP;
                }
            }
            return result;
        },

        percentageSuccess() {
            if (!this.auditReferenceResult) {
                return 0;
            } else {
                return Math.round(this.auditReferenceResult.nbP / (this.auditReferenceResult.nbP + this.auditReferenceResult.nbF) * 100)
            }
        },

        anomalyPerThemeLabels() {
            let result = [];
            if (this.selectedReference && this.principleResultsByReference[this.selectedReference.id]) {
                let principleResults = this.principleResultsByReference[this.selectedReference.id];
                result = principleResults.map((principleResult) => {
                    return principleResult.testHierarchy.name;
                })
            }
            return result;
        },

        anomalyPerThemeData() {
            let result = [];
            if (this.selectedReference && this.principleResultsByReference[this.selectedReference.id]) {
                let principleResults = this.principleResultsByReference[this.selectedReference.id];
                result = principleResults.map((principleResult) => {
                    return principleResult.nbEF;
                })
            }
            return result;
        },

        currentSynthesis() {
            let result = null;
            if (this.selectedReference &&
                this.synthesisPageByReferenceId[this.selectedReference.id]
            ) {
                result = this.synthesisPageByReferenceId[this.selectedReference.id][this.currentSynthesisPage];
            }
            return result;
        },

        numberOfTestsResult(){
            let result = {
                'nbF': 0,
                'nbP': 0,
                'nbI': 0,
                'nbU': 0,
                'nbCT': 0
            };
            for(var key in this.globalTestResultForPages){
                if (key.match(/[0-9]+\.[0-9]+\.[0-9]+/g)){
                    if(this.globalTestResultForPages[key] == 'failed'){
                        result.nbF += 1
                    } else if(this.globalTestResultForPages[key] == 'cantTell'){
                        result.nbCT += 1
                    } else if(this.globalTestResultForPages[key] == 'untested'){
                        result.nbU += 1
                    } else if(this.globalTestResultForPages[key] == 'passed'){
                        result.nbP += 1
                    } else if(this.globalTestResultForPages[key] == 'inapplicable'){
                        result.nbI +=1
                    }
                }
            }
            return result;
        }
    },
    methods: {
        openModal(audit, page, criteriaResult, i) {
            const el = document.body;
			el.classList.add('noScroll');
			el.classList.remove('scroll');
			
            this.$modal.show(AnomalyModal, {
                props: {
                    audit: audit,
                    auditPage: page,
                    criteriaResult: criteriaResult,
                    index: i
                },
                label: "synthesis-window",
                classes: "modal",
                attributes: {
                    id: "anomaly-modal",
                    role: "dialog",
                    'aria-labelledby': "modalTitle",
                    'aria-describedby': "modalDescription",
                    tabindex: "0"
                }
            });
        },

        openGlobalTestModal(audit, testHierarchy, status, pageConcerned, pages) {
            this.$modal.show(AnomalyGlobalTestModal, {
                props: {
                    audit: audit,
                    testHierarchy: testHierarchy,
                    status: status,
                    pageConcerned : pageConcerned,
                    pages : pages
                },
                label: "synthesis-window",
                classes: "modal",
                attributes: {
                    id: "anomaly-modal",
                    role: "dialog",
                    'aria-labelledby': "modalTitle",
                    'aria-describedby': "modalDescription",
                    tabindex: "0"
                }
            });
        },

        onSelectReference() {
            this.currentSynthesisPage = 0;
            if (!this.synthesisPageByReferenceId[this.selectedReference.id]) {
                this.$set(this.synthesisPageByReferenceId, this.selectedReference.id, []);
            }

            if (!this.synthesisPageByReferenceId[this.selectedReference.id][this.currentSynthesisPage]) {
                this.changePage(this.currentSynthesisPage)
            }

            if (!this.principleResultsByReference[this.selectedReference]) {
                this.testHierarchyResultService.findReducedChildrenTestHierarchyResultByAudit(
                    this.selectedReference.id,
                    this.audit.id,
                    this.sharecode,
                    (reducedResults) => {
                        this.$set(this.principleResultsByReference, this.selectedReference.id, reducedResults);
                    },
                    (error) => {
                        console.error(error);
                    },
                )
            }

            this.testHierarchyResultService.getGlobalTestResultForPages(
                this.audit.id,
                this.selectedReference.id,
                this.audit.sharecode,
                (testResultForPages) => {
                    this.globalTestResultForPages = testResultForPages;
                },
                (error) => {
                    console.error(error);
                },
            );
        },

        changePage(page) {
            if (!this.synthesisPageByReferenceId[this.selectedReference.id][page]) {
                this.loadSynthesisPage(page);
            }
            this.loadPagePage(page);
            this.currentSynthesisPage = page;
        },

        loadPagePage(page) {
            this.pageService.findByAuditId(
                this.audit.id,
                this.sharecode,
                page,
                10,
                (pagePage) => {
                    this.pages = pagePage.content;
                    this.pageById = {};
                    for(const page of this.pages){
                        this.$set(this.pageById, page.id, page);
                    }
                },
                (error) => {
                    console.error(error)
                })
        },

        loadSynthesisPage(page) {
            this.testHierarchyResultService.getSynthesisByAuditAndTestHierarchy(
                this.audit.id,
                this.selectedReference.id,
                this.sharecode,
                page,
                10,
                (synthesisPage) => {
                    this.$set(this.synthesisPageByReferenceId[this.selectedReference.id], page, synthesisPage.content);
                    this.$set(this.totalSynthesisPageByReferenceId, this.selectedReference.id, synthesisPage.totalPages)
                },
                (error) => {
                    console.error(error)
                }
            );
        },

        moment: function (date) {
            return this.$moment(date);
        },

        pageConcerned(code){
            let result = []
            let i = 0;
            for(page in this.currentSynthesis[code]){
                if(this.currentSynthesis[code][page].status== this.globalTestResultForPages[code]){
                    result.push(this.pages[i])
                }
                i++;
            }
            return result;
        }
    }
}
</script>

<style lang="scss" scoped>
.title-synthesis {
    .title-synthesis__type {
        display: block;
        font-size: $small-font-size;
        font-weight: normal;
    }
}

.audit-synthesis {
    position: relative;
    padding-bottom: 3rem;

    @media #{$media-md-viewport} {
        padding-bottom: 10rem;
    }
}

// Audit infos : caps, list and stats
.audit-infos {
    margin: 3.2rem 0;
    @media #{$media-lg-viewport} {
        margin: 5.4rem 32rem 0 0;
    }

    .audit-infos__stats {
        @media #{$media-lg-viewport} {
            position: absolute;
            top: 0;
            right: 0;
            width: 28.8rem;
        }
    }

    .audit-infos__inner {
        margin: 2.6rem 0;
        @media #{$media-lg-viewport} {
            margin: 0;
            display: flex;
            justify-content: space-between;
        }
    }
}

// Caps audit
.audit-caps {
    margin-bottom: 3.2rem;
    min-height: 23rem;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    box-shadow: 0 2px 6px 0 rgba(5, 90, 127, .1);
    @media #{$media-lg-viewport} {
        flex: 0 0 47%;
        margin-bottom: 0;
    }
}

// List infos audit
.audit-list {
    @media #{$media-lg-viewport} {
        flex: 0 0 47%;
    }
}

.audit-list-infos {
    margin: 0;
    padding: 0;
    font-size: $small-font-size;
    list-style-type: none;
    @media #{$media-md-viewport} {
        font-size: $medium-font-size;
    }

    span {
        color: $text-secondary;
        font-family: $font-stack-secondary;
        font-weight: bold;
    }

    &.audit-list-infos--sublist {
        margin-left: 1.6rem;
    }
}

// Stats audit
.audit-stats {
    position: relative;
    margin-top: calc(13.2rem / 2); // 13.2rem is CircularProgressChart height
    box-shadow: 0 2px 16px 0 rgba(5, 90, 127, .1);
    @media #{$media-md-viewport} {
        margin-top: calc(21.7rem / 2); // 21.7rem is CircularProgressChart height
    }

    .audit-stats__chart {
        position: absolute;
        top: 1.2rem;
        left: 50%;
        width: 13.2rem;
        height: 13.2rem;
        transform: translate(-50%, -50%);
        @media #{$media-md-viewport} {
            top: 0;
            width: 21.7rem;
            height: 21.7rem;
        }
    }

    .audit-stats__recap {
        margin: 0;
    }
}

.audit-stats-recap {
    padding: calc(13.2rem / 2 + 3.2rem) 0 1.2rem; // 13.2rem is CircularProgressChart height
    font-family: $font-stack-secondary;
    text-align: center;
    @media #{$media-md-viewport} {
        padding: calc(21.7rem / 2 + 3.2rem) 0 2rem; // 21.7rem is CircularProgressChart height
    }

    .audit-stats-recap__number,
    .audit-stats-recap__unit,
    .audit-stats-recap__total {
        display: block;
    }

    .audit-stats-recap__number {
        font-size: 3rem;
        font-weight: 600;
        line-height: 1;
        @media #{$media-md-viewport} {
            font-size: 4rem;
        }
    }

    .audit-stats-recap__unit {
        font-size: 1.8rem;
        @media #{$media-md-viewport} {
            font-size: 2.4rem;
        }
    }
}

// Loading screen
#fetching-data {
    text-align: center;
    color: $text-secondary;
    font-family: $font-stack-secondary;
    font-weight: bold;

    img {
        max-height: 100rem;
    }
}

// Table
.table-title {
    span {
        display: block;
        margin-top: .8rem;
        font-size: $base-font-size;
        font-weight: normal;
    }
}

.table-pagination {
    margin-bottom: 2.4rem;

    .pagination {
        justify-content: center;
    }
}
</style>

<style lang="scss">
.tabs-synthesis {
    // Common styles with HeaderRow.vue (same location is required because of the same variables used in both files)

    @import '~sass-trigonometry';

    // From https://www.jimmybonney.com/articles/column_header_rotation_css/
    // From https://codepen.io/peterfarrell/pen/yNPrXB

    // Variables
    $angle: 45;
    $height: 160;
    $width: 74;

    .table-tests {
        width: auto;
        border-collapse: collapse;
        border-spacing: 0;

        .no-border {
            border: 0;
        }

        th.row-header {
            padding: 0 .5rem;
            white-space: nowrap;
        }

        th.rotate {
            height: $height * .1rem;
            width: $width * .1rem;
            min-width: $width * .1rem;
            max-width: $width * .1rem;
            position: relative;
            vertical-align: bottom;
            padding: 0;

            .rotate__inner {
                $tan: tan($angle);

                position: relative;
                top: 0;
                left: calc(#{$height *.1rem} * #{$tan} / 2);
                height: 100%;
                transform: skew($angle * -1deg, 0deg);
                border-left: 1px solid $border-primary;
                border-right: 1px solid $border-primary;
                border-top: 1px solid $border-primary;
                z-index: 1;
                cursor: pointer;
            }
        }

        tbody td {
            position: relative;
            width: $width * .1rem;
            padding: .8rem 0;
            border-top: 1px solid $border-primary;
            border-left: 1px solid $border-primary;
            border-right: 1px solid $border-primary;
            background-clip: padding-box;
            text-align: center;
            z-index: 0;

            .btn {
                vertical-align: middle;

                &:hover,
                &:focus {
                    & + .td-background {
                        background-color: $color-bluegrey-dark;
                    }
                }
            }

            .td-background {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                display: block;
                z-index: -1;
            }
        }

        tbody tr:last-child {
            td {
                border-bottom: 1px solid $border-primary;
            }
        }

        & > thead > tr th:nth-of-type(even) div,
        & > tbody > tr td:nth-of-type(even) {
            background-color: $border-secondary;
        }
    }

    .page {
        $cos: cos($angle);

        display: inline-block;
        position: absolute;
        bottom: calc(#{$width * .1rem} * #{$cos} + 2px);
        left: -50px; // Because it looked good, but there is probably a mathematical link here as well
        width: calc(#{$height * .1rem} / #{$cos} - #{$width * .1rem} * #{$cos});
        transform: skew($angle * 1deg, 0deg) rotate(315deg);    
        text-align: left;
        white-space: nowrap;

        .page__name {
            width: 11rem;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: middle;
            font-weight: normal;
        }

        .page__number {
            display: inline-block;
        }
    }

    .tooltip-name {
        display: block;
        position: absolute;
        top: 100%;
        left: 0;
        min-width: 20rem;
        width: 100%;
        margin: 0;
        padding: .8rem;
        transform: skew($angle * 1deg, 0deg);
        background-color: $color-white;
        box-shadow: 0 2px 8px 0 $color-shadow;
        text-align: left;
        z-index: 10;
    }
}
</style>
