<template>
    <main v-if="project" class="page" id="page" role="main">
        <div class="wrapper">
            <Breadcrumbs :breadcrumbsItems='breadcrumbProps'></Breadcrumbs>
        </div>

        <div class="wrapper launch-header-wrapper">
            <header class="launch-header headline">
                <div class="launch-header__inner">
                    <div>
                        <h1 class="launch-header__title">
                            <span class="launch-header__tag">{{ project.name }}</span>
                            <span>{{ $t('page.auditLaunch') }}</span>
                        </h1>
                    </div>

                    <div class="launch-header__cta">
                        <button class="btn btn--default-inverse btn--icon" type="button" @click="startAudit">
                            <icon-base-decorative>
                                <icon-launch/>
                            </icon-base-decorative>
                            <span>{{ $t('action.auditStart') }}</span>
                        </button>
                        <p class="launch-info" v-if="launchCondition">
                            <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                                <icon-valid/>
                            </icon-base-decorative>
                            <span>{{ $t('audit.form.help.ready') }}</span>
                        </p>
                        <p v-else v-show="hasTryToLaunch" class="info-error">
                            <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                                <icon-alert/>
                            </icon-base-decorative>
                            <span>{{ $t('form.missingFields') }}</span>
                        </p>
                    </div>
                </div>
            </header>
        </div>

        <form novalidate>
            <div class="wrapper">
                <p class="info-form">{{ $t('form.help') }}</p>
                <section class="layout">
                    <audit-form-section-header
                        :title="$t('audit.definition.title')"
                        :number="1"/>

                    <!-- Audit type -->
                    <audit-type-form
                        v-model="auditConfigurationForm.common.type"
                        :is-valid="isAuditTypeValid"
                        :has-been-sent="hasTryToLaunch"/>

                    <!-- Audit name -->
                    <audit-name-form
                        v-model="auditConfigurationForm.common.name"
                        :is-valid="isAuditNameValid"
                        :has-been-sent="hasTryToLaunch"/>

                    <audit-enable-screenshot-form
                        v-model="auditConfigurationForm.common.enableScreenshot"/>
                </section>
            </div>

            <hr role="presentation" class="separator separator--main"/>

            <div class="wrapper"
                v-if="isAuditTypeValid && auditConfigurationForm.common.type === 'page'">
                <section class="layout">
                    <audit-form-section-header
                        :title="$t('audit.pages.title')"
                        :number="2"/>

                    <!-- Audit pages -->
                    <audit-page-urls-form
                        :is-valid="isPageUrlsValid"
                        v-model="auditConfigurationForm.page.urls"
                        :project-domain="project.domain"
                        :has-been-sent="hasTryToLaunch"/>
                </section>
            </div>

            <div class="wrapper"
                v-if="isAuditTypeValid && auditConfigurationForm.common.type === 'site'">
                <section class="layout">
                    <audit-form-section-header
                        :title="$t('audit.site.title')"
                        :number="2"/>

                    <audit-site-seeds-form
                        v-if="project.domain"
                        :is-valid="isSiteSeedsValid"
                        v-model="auditConfigurationForm.site.seeds"
                        :has-been-sent="hasTryToLaunch"/>

                    <audit-site-crawler-duration-form
                        :is-valid="isCrawlerMaxDurationValid"
                        v-model="auditConfigurationForm.site.crawlerMaxDuration"
                        :has-been-sent="hasTryToLaunch"/>

                    <audit-site-crawler-max-depth-form
                        :is-valid="isCrawlerMaxDepthValid"
                        v-model="auditConfigurationForm.site.crawlerMaxDepth"
                        :has-been-sent="hasTryToLaunch"/>

                    <audit-site-crawler-max-document-form
                        :is-valid="isCrawlerMaxDocumentValid"
                        v-model="auditConfigurationForm.site.crawlerMaxDocument"
                        :has-been-sent="hasTryToLaunch"/>

                    <audit-site-crawler-inclusion-regex-form
                        :is-valid="true"
                        v-model="auditConfigurationForm.site.inclusionRegex"
                        :has-been-sent="hasTryToLaunch"/>

                    <audit-site-crawler-exclusion-regex-form
                        :is-valid="true"
                        v-model="auditConfigurationForm.site.exclusionRegex"
                        :has-been-sent="hasTryToLaunch"/>
                </section>
            </div>

            <div class="wrapper"
                v-if="isAuditTypeValid && auditConfigurationForm.common.type === 'scenario'">
                <section class="layout">
                    <audit-form-section-header
                        :title="$t('audit.scenario.title')"
                        :number="2"/>

                    <audit-scenario-form
                            :is-valid="isSelectedScenarioValid"
                            v-model="auditConfigurationForm.scenario.id"
                            :project-id="project.id"
                            :has-been-sent="hasTryToLaunch"/>
                </section>
            </div>

            <div class="wrapper"
                v-if="isAuditTypeValid && auditConfigurationForm.common.type === 'upload'">
                <section class="layout">
                    <audit-form-section-header
                        :title="$t('audit.resource.title')"
                        :number="2"/>

                    <audit-upload-form
                        :is-valid="isSelectedUploadResourceValid"
                        v-model="auditConfigurationForm.resource.id"
                        :project-id="project.id"
                        :has-been-sent="hasTryToLaunch"/>
                </section>
            </div>

            <hr role="presentation" class="separator separator--main" v-if="auditConfigurationForm.common.type != null"/>

            <div class="wrapper" v-if="auditConfigurationForm.common.type != null">
                <section class="layout">
                    <audit-form-section-header
                        :title="$t('audit.guidelines.title')"
                        :number="3"/>
                    <!-- Audit references -->
                    <audit-references-form
                        :references="references"
                        :is-valid="isSelectedReferencesValid"
                        v-model="auditConfigurationForm.common.selectedReferences"
                        :has-been-sent="hasTryToLaunch"/>

                    <!-- Audit main reference -->
                    <audit-main-reference-form
                        v-if="isSelectedReferencesValid"
                        :selected-references="auditConfigurationForm.common.selectedReferences"
                        :is-valid="isMainReferenceValid"
                        v-model="auditConfigurationForm.common.mainReference"
                        :has-been-sent="hasTryToLaunch"/>
                </section>
            </div>

            <hr role="presentation" class="separator separator--main" v-if="auditConfigurationForm.common.type != null"/>

            <div class="wrapper" v-if="auditConfigurationForm.common.type != null">
                <section class="layout">
                    <audit-form-section-header
                        :title="$t('audit.resolution.title')"
                        :number="4"/>
                    <audit-breakpoints-form
                        :is-valid="isBreakpointsValid"
                        v-model="auditConfigurationForm.common.breakpoints"
                        :has-been-sent="hasTryToLaunch"/>
                </section>
            </div>

            <hr role="presentation" class="separator separator--main" v-if="auditConfigurationForm.common.type != null"/>

            <div class="wrapper" v-if="auditConfigurationForm.common.type != null">
                <section class="layout">
                    <audit-form-section-header
                        :title="$t('audit.waitTime.title')"
                        :number="5"/>

                    <audit-wait-time-form
                        :is-valid="isWaitTimeValid"
                        v-model="auditConfigurationForm.common.waitTime"
                        :has-been-sent="hasTryToLaunch"/>
                </section>
            </div>

            <hr role="presentation" class="separator separator--main" v-if="auditConfigurationForm.common.type != null"/>

            <div class="wrapper" v-if="auditConfigurationForm.common.type != null">
                <section class="layout">
                    <audit-form-section-header
                        :title="$t('audit.definition.browser.title')"
                        :number="6"/>

                    <audit-browser-form
                        :is-valid="isBrowserValid"
						:browsers="activeBrowsers"
                        v-model="auditConfigurationForm.common.browser"
                        :has-been-sent="hasTryToLaunch"/>
                </section>
            </div>

            <div class="wrapper" v-if="auditConfigurationForm.common.type != null">
                <button class="btn btn--default-inverse btn--icon" type="button" @click="startAudit"
                        :enabled="launchCondition">
                    <icon-base-decorative>
                        <icon-launch/>
                    </icon-base-decorative>
                    <span>{{$t('action.auditStart')}}</span>
                </button>
                <p class="launch-info" v-if="launchCondition">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-valid/>
                    </icon-base-decorative>
                    <span>{{$t('audit.form.help.ready')}}</span>
                </p>
                <p v-else v-show="hasTryToLaunch" class="info-error">
                    <icon-base-decorative width="16" height="16" viewBox="0 0 16 16">
                        <icon-alert/>
                    </icon-base-decorative>
                    <span>{{$t('form.missingFields')}}</span>
                </p>
            </div>
        </form>
        <BackToTop/>
    </main>
</template>

<script>
import Breadcrumbs from '../../components/Breadcrumbs';
import BackToTop from '../../components/BackToTop';
import IconBaseDecorative from '../../components/icons/IconBaseDecorative';
import IconBaseInformative from '../../components/icons/IconBaseInformative';
import IconLaunch from '../../components/icons/IconLaunch';
import IconValid from '../../components/icons/IconValid';
import IconCompliant from '../../components/icons/IconCompliant';
import IconPlus from '../../components/icons/IconPlus';
import IconAlert from '../../components/icons/IconAlert';
import IconChecked from '../../components/icons/IconChecked';
import IconUnchecked from '../../components/icons/IconUnchecked';
import IconTop from '../../components/icons/IconTop';
import IconDelete from '../../components/icons/IconDelete';
import IconArrowBlue from '../../components/icons/IconArrowBlue';
import AuditTypeForm from "./form/AuditTypeForm";
import AuditNameForm from "./form/AuditNameForm";
import AuditReferencesForm from "./form/AuditReferencesForm";
import AuditBrowserForm from "./form/AuditBrowserForm";
import AuditMainReferenceForm from "./form/AuditMainReferenceForm";
import AuditFormSectionHeader from "./AuditFormSectionHeader";
import AuditSiteSeedsForm from "./form/AuditSiteSeedsForm";
import AuditSiteCrawlerDurationForm from "./form/AuditSiteCrawlerDurationForm";
import AuditPageUrlsForm from "./form/AuditPageUrlsForm";
import AuditSiteCrawlerMaxDepthForm from "./form/AuditSiteCrawlerDepthForm";
import AuditSiteCrawlerMaxDocumentForm from "./form/AuditSiteCrawlerDocumentForm";
import AuditSiteCrawlerInclusionRegexForm from "./form/AuditSiteInclusionRegexForm";
import AuditSiteCrawlerExclusionRegexForm from "./form/AuditSiteExclusionRegexForm";
import AuditUploadForm from "./form/AuditUploadForm";
import AuditScenarioForm from "./form/AuditScenarioForm";
import AuditBreakpointsForm from "./form/AuditBreakpointsForm";
import UrlHelper from "../../helper/urlhelper"
import BreakpointHelper from "../../helper/breakpointHelper"
import AuditWaitTimeForm from "./form/AuditWaitTimeForm";
import AuditEnableScreenshotForm from "./form/AuditEnableScreenshotForm";

export default {
    name: 'auditLaunch',
    components: {
		AuditBrowserForm,
        AuditEnableScreenshotForm,
        AuditWaitTimeForm,
        AuditBreakpointsForm,
        AuditScenarioForm,
        AuditUploadForm,
        AuditSiteCrawlerExclusionRegexForm,
        AuditSiteCrawlerInclusionRegexForm,
        AuditSiteCrawlerMaxDocumentForm,
        AuditSiteCrawlerMaxDepthForm,
        AuditPageUrlsForm,
        AuditSiteCrawlerDurationForm,
        AuditSiteSeedsForm,
        AuditFormSectionHeader,
        AuditMainReferenceForm,
        AuditReferencesForm,
        AuditNameForm,
        AuditTypeForm,
        Breadcrumbs,
        BackToTop,
        IconBaseDecorative,
        IconBaseInformative,
        IconLaunch,
        IconValid,
        IconCompliant,
        IconPlus,
        IconChecked,
        IconUnchecked,
        IconTop,
        IconDelete,
        IconAlert,
        IconArrowBlue
    },
    data() {
        return {
            breadcrumbProps: [
                {
                    name: this.$i18n.t('page.dashboard'),
                    path: '/'
                },
            ],

            project: null,
            references: [],
            activeBrowsers: [],

            seedMustBeInDomain: true,
            hasTryToLaunch: false,
            auditConfigurationForm: {
                common: {
                    name: '',
                    selectedReferences: [],
                    mainReference: null,
                    waitTime: 500,
                    breakpoints: [1920],
                    type: null,
                    enableScreenshot: false,
                    browser: null
                },
                site: {
                    seeds: [],
                    crawlerMaxDuration: 3600,
                    crawlerMaxDocument: 100,
                    crawlerMaxDepth: 10,
                    inclusionRegex: '',
                    exclusionRegex: ''
                },
                page: {
                    urls: []
                },
                scenario: {
                    id: null
                },
                resource: {
                    id: null
                }
            },
        }
    },
    metaInfo() {
        return {
            // if no subcomponents specify a metaInfo.title, this title will be used
            title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.auditConfiguration"),
            meta: [
                {
                    name: 'robots', content: 'noindex'
                }
            ]
        }
    },
    created() {
        this.testHierarchyService.findAllReferencesNotDeleted(
            (references) => {
                this.references = references;
                if(references.length > 0){
                    this.auditConfigurationForm.common.selectedReferences.push(references[0]);
                }

            },
            (error) => {
                console.error(error);
            }
        );

        this.projectService.findById(
            this.$route.params.id,
            (project) => {
                this.auditConfigurationForm.common.name = project.name + ' ' + this.moment().format("DD-MM-YYYY HH:mm");
                this.auditConfigurationForm.page.urls.push(project.domain);
                this.auditConfigurationForm.site.seeds.push(project.domain);

                this.project = project;
                this.breadcrumbProps.push({
                    name: project.contract.name,
                    path: '/contracts/' + project.contract.id
                });
                this.breadcrumbProps.push({
                    name: project.name,
                });
            },
            (error) => {
                console.error(error)
            }
        );

        this.configService.getActiveBrowsers(
            (activeBrowsers) => {
                this.activeBrowsers = activeBrowsers
                if(this.activeBrowsers.length > 0){
                    this.auditConfigurationForm.common.browser = this.activeBrowsers[0];
                }
            },
            (error) => {
                console.error(error)
            }
        )
    },

    methods: {
        moment: function (date) {
            this.$moment.locale(this.$i18n.locale)
            return this.$moment(date);
        },

        startAudit: function () {
            this.hasTryToLaunch = true;
            if (!this.launchCondition) {
                return;
            }

            const parameters = {
                'WAIT_TIME': this.auditConfigurationForm.common.waitTime,
                'WEBDRIVER_RESOLUTIONS': this.auditConfigurationForm.common.breakpoints.join(';'),
                'ENABLE_SCREENSHOT': this.auditConfigurationForm.common.enableScreenshot,
                'WEBDRIVER_BROWSER': this.auditConfigurationForm.common.browser
            };
            switch (this.auditConfigurationForm.common.type) {
                case 'site':
                    parameters['SITE_SEEDS'] = this.auditConfigurationForm.site.seeds.join(';');
                    parameters['CRAWLER_MAX_DEPTH'] = this.auditConfigurationForm.site.crawlerMaxDepth;
                    parameters['CRAWLER_MAX_DURATION'] = this.auditConfigurationForm.site.crawlerMaxDuration;
                    parameters['CRAWLER_MAX_DOCUMENT'] = this.auditConfigurationForm.site.crawlerMaxDocument;
                    parameters['CRAWLER_EXCLUSION_REGEX'] = this.auditConfigurationForm.site.exclusionRegex;
                    parameters['CRAWLER_INCLUSION_REGEX'] = this.auditConfigurationForm.site.inclusionRegex;
                    break;

                case 'page':
                    parameters['PAGE_URLS'] = this.auditConfigurationForm.page.urls.join(';');
                    break;

                case 'upload':
                    parameters['DOM_ID'] = this.auditConfigurationForm.resource.id;
                    break;

                case 'scenario':
                    parameters['SCENARIO_ID'] = this.auditConfigurationForm.scenario.id;
                    break;
            }

            this.auditService.start(
                this.auditConfigurationForm.common.name,
                this.auditConfigurationForm.common.selectedReferences.map((reference) => reference.id),
                this.auditConfigurationForm.common.mainReference.id,
                this.project.id,
                this.auditConfigurationForm.common.type.toUpperCase(),
                parameters,
                (audit) => this.$router.push('/audits/' + audit.id),
                (error) => {
                    this.auditConfigurationForm.error = error;
                }
            )
        },
    },
    computed: {
         //Commons
        isAuditTypeValid() {
            return ['site', 'scenario', 'upload', 'page'].includes(this.auditConfigurationForm.common.type);
        },

        isAuditNameValid() {
            return this.auditConfigurationForm.common.name !== '';
        },

        isSelectedReferencesValid() {
            return this.auditConfigurationForm.common.selectedReferences.length > 0;
        },

        isMainReferenceValid() {
            return !!this.auditConfigurationForm.common.mainReference;
        },

        isWaitTimeValid() {
            return Number.isInteger(this.auditConfigurationForm.common.waitTime) && this.auditConfigurationForm.common.waitTime > 0  && this.auditConfigurationForm.common.waitTime <= 10000 ;
        },

        isBrowserValid(){
            return this.activeBrowsers.includes(this.auditConfigurationForm.common.browser);
        },

        isBreakpointsValid() {
            return this.auditConfigurationForm.common.breakpoints.filter(breakpoint => {
                return !BreakpointHelper.isBreakpointValid(breakpoint) || BreakpointHelper.isBreakpointEmpty(breakpoint);
            }).length === 0;
        },

        //Pages
        isPageUrlsValid() {
            return this.auditConfigurationForm.page.urls.filter((url) => {
                return ! UrlHelper.checkValidUrl(url, this.project.domain, true)
            }).length === 0;
        },

        //Sites
        isSiteSeedsValid() {
            return this.auditConfigurationForm.site.seeds.filter(seed => {
                return ! UrlHelper.checkValidUrl(seed, this.project.domain, true)
            }).length === 0;
        },
        isCrawlerMaxDepthValid() {
            return Number.isInteger(this.auditConfigurationForm.site.crawlerMaxDepth) &&
                this.auditConfigurationForm.site.crawlerMaxDepth > 0 &&
                this.auditConfigurationForm.site.crawlerMaxDepth <= 10
        },

        isCrawlerMaxDocumentValid() {
            return Number.isInteger(this.auditConfigurationForm.site.crawlerMaxDocument) &&
                this.auditConfigurationForm.site.crawlerMaxDocument > 0 &&
                this.auditConfigurationForm.site.crawlerMaxDocument <= 1000
        },

        isCrawlerMaxDurationValid() {
            return Number.isInteger(this.auditConfigurationForm.site.crawlerMaxDuration) &&
                this.auditConfigurationForm.site.crawlerMaxDuration > 0 &&
                this.auditConfigurationForm.site.crawlerMaxDuration <= 86400
        },

        //Scenario
        isSelectedScenarioValid() {
            return this.auditConfigurationForm.scenario.id != null;
        },

        //Upload
        isSelectedUploadResourceValid() {
            return this.auditConfigurationForm.resource.id != null
        },

        launchCondition() {
            let result =
                this.isAuditTypeValid &&
                this.isAuditNameValid &&
                this.isSelectedReferencesValid &&
                this.isMainReferenceValid &&
                this.isBreakpointsValid &&
                this.isWaitTimeValid &&
                this.isBrowserValid;

            switch (this.auditConfigurationForm.common.type) {
                case 'scenario':
                    result &= this.isSelectedScenarioValid;
                    break;

                case 'upload':
                    result &= this.isSelectedUploadResourceValid;
                    break;

                case 'site':
                    result &= this.isSiteSeedsValid &&
                        this.isCrawlerMaxDepthValid &&
                        this.isCrawlerMaxDocumentValid &&
                        this.isCrawlerMaxDurationValid;
                    break;

                case 'page':
                    result &= this.isPageUrlsValid;
                    break;

                default:
                    result = false;
            }
            return result;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "src/views/AuditLaunch/AuditLaunch.style";
</style>
