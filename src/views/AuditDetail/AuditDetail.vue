<template>
	<main id="page" class="wrapper" v-if="audit">
		<Breadcrumbs :breadcrumbsItems="breadcrumbProps"></Breadcrumbs>

		<Tabs>
			<Tab :name="$t('auditDetail.tabs.logs')" selected="true">
				<div class="tabs-wrapper">
					<header>
						<h1 class="title-logs">
							{{ audit.name }}
							<span aria-live="polite" :class="'title-logs__status title-logs__status--' + audit.status.toLowerCase()" v-if="audit">{{ $t('auditDetail.status.' +  audit.status.toLowerCase()) }}</span>
						</h1>
					</header>

					<section class="main-info title-logs">
						<h2>{{ $t('auditDetail.information.parameters') }}</h2>
						<ul>
							<li>
								{{ $t('auditDetail.information.type') }}
								<span v-if="audit.type === 'SITE'">{{ $t('entity.audit.site') }}</span>
								<span v-else-if="audit.type === 'PAGE'">{{ $t('entity.audit.page') }}</span>
								<span v-else-if="audit.type === 'SCENARIO'">{{ $t('entity.audit.scenario') }}</span>
								<span v-else>{{ $t('entity.audit.upload') }}</span>
							</li>
							<li v-if="parameters.browser == 'firefox'" >{{ $t('auditDetail.information.browser') }}Mozilla Firefox</li>
							<li v-else-if="parameters.browser == 'chrome'" >{{ $t('auditDetail.information.browser') }}Google Chrome</li>
							<li v-show="parameters.waitTime">{{$t('auditDetail.information.waitTime')}} : {{parameters.waitTime}}</li>
							<li v-show="parameters.basicAuthLogin">{{$t('auditDetail.information.basicLogin')}} : {{parameters.basicAuthLogin}}</li>
							<li v-show="parameters.basicAuthUrl">{{$t('auditDetail.information.basicUrl')}} : {{parameters.basicAuthUrl}}</li>
							<li v-show="parameters.enableScreenshot">{{$t('auditDetail.information.screenshots')}} : {{parameters.enableScreenshot == 'false' ? 'No' : 'Yes'}}</li>
							<li v-show="parameters.maxDepth">{{$t('auditDetail.information.maxDepth')}} : {{parameters.maxDepth}}</li>
							<li v-show="parameters.maxDoc">{{$t('auditDetail.information.maxDoc')}} : {{parameters.maxDoc}}</li>
							<li v-show="parameters.maxDuration">{{$t('auditDetail.information.maxDuration')}} : {{parameters.maxDuration}}</li>
							<li v-show="parameters.resolutions!=''">{{$t('auditDetail.information.resolution')}} : {{parameters.resolutions}}</li>
							<li v-show="parameters.mainReference">{{$t('auditDetail.information.reference')}} : {{parameters.mainReference}}</li>
							<li v-show="parameters.references">{{$t('auditDetail.information.references')}} : {{parameters.references.join(', ')}}</li>
						</ul>
					</section>

					<section class="section-logs">
						<h2>{{ $t('auditDetail.pages') }} ({{pageTotal}})</h2>

						<div class="form-block form-block--half">
							<label class="label" for="search-page">{{$t('action.search')}} : </label>
							<input
								class="input"
								type="search"
								name="search-page"
								id="search-page"
								v-model="search"
								aria-describedby="search-explanation"
								autocomplete="off"
								@input="fireAriaLive"
							>
						</div>

						<p class='screen-reader-text' id="search-explanation">{{$t('auditDetail.infoSearch')}} : {{ pageTotal }}</p>

						<div aria-live="polite" class='screen-reader-text'>
							<p>{{ liveMsg }} {{$t('auditDetail.results')}}</p>
						</div>

						<page-list
                        :audit="audit"
                        :pages="pages"
                        :current-page="pageCurrentPage"
                        :total-pages="pageTotalPage"
                        :element-by-page="auditPagePageSize"
                        :total-elements="pageTotal"/>

						<pagination
							:current-page="pageCurrentPage"
							:total-pages="pageTotalPage"
							@changePage="(page) => {loadPages(page, auditPagePageSize, search)}"
						/>
					</section>

					<hr role="presentation" class="separator" />

					<section class="section-logs">

						<h2>{{ $t('auditDetail.logs') }} ({{auditLogTotal}})</h2>

						<div class="form-row">
							<div class="form-column">
								<div class="form-block">
									<div class="select">
										<select id="level-select" name="level-select" @change="levelChange($event)" aria-labelledby="selectLogsLevel" required>
											<option id="selectLogsLevel" value="" disabled>{{$t('auditDetail.selectLogLevel')}}</option>
											<option v-for="level of levels" :key="level" :value="level">{{level}}</option>
										</select>
									</div>
								</div>
							</div>

							<div class="form-column">
								<div class="form-block">
									<button
										type="button"
										:class="firstToLast ? 'btn btn--default-inverse btn--icon' : 'btn btn--default btn--icon'"
										@click="reverseLogsOrder()"
										aria-pressed="true">
										{{ $t('action.sortAuditsOrLogs') }}
										<icon-base-decorative v-if="firstToLast">
											<icon-close/>
										</icon-base-decorative>

										<icon-base-decorative v-else>
											<icon-checked/>
										</icon-base-decorative>
									</button>
								</div>
							</div>
						</div>

						<logs-list
                        :audit="audit"
                        :auditLogs="auditLogs"
                        :current-page="auditLogCurrentPage"
                        :total-pages="auditLogTotalPage"
                        :element-by-page="auditLogPageSize"
                        :total-elements="auditLogTotal"
                    	/>

						<pagination
							:current-page="auditLogCurrentPage"
							:total-pages="auditLogTotalPage"
							@changePage="(page) => {loadAuditLogs(page, auditLogPageSize, firstToLast, this.levelsToDisplay)}"
						/>
					</section>
                </div>
			</Tab>
			<Tab :name="$t('auditDetail.tabs.synthesis')" v-if="audit.status=='DONE' && pages.length > 1">
				<Synthesis :audit="audit" :totalPages="pageTotal" />
			</Tab>
		</Tabs>
	</main>
</template>

<script>
import Breadcrumbs from "../../components/Breadcrumbs";
import Tab from '../../components/Tab';
import Tabs from '../../components/Tabs';
import Logs from './LogsList';
import Synthesis from './Synthesis';
import LogsList from "./LogsList";
import PageList from "./PageList";
import Pagination from "../../components/Pagination";
import IconBaseDecorative from '../../components/icons/IconBaseDecorative';
import IconChecked from '../../components/icons/IconChecked'
import IconClose from '../../components/icons/IconClose'
	export default {
		name: "auditDetail",
		components: {
            Pagination,
            PageList,
            LogsList,
			Breadcrumbs,
			Tab,
			Tabs,
			Logs,
			Synthesis,
			IconBaseDecorative,
			IconChecked,
			IconClose
		},
		metaInfo() {
			return {
				// if no subcomponents specify a metaInfo.title, this title will be used
				title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.auditDetail"),
				meta: [
					{
						name: 'robots', content: 'noindex'
					}
				]
			}
		},
		data() {
			return {
				search : "",
				liveMsg : "",
				timer: null,
				audit: null,
				sharecode: null,
          		project: null,
				tempPages: [],
				pages: [],
				auditLogs: [],
				firstToLast: false,
				levels: [],
				levelsToDisplay: ['INFO','WARNING','ERROR'],
				parameters: {
					mainReference: null,
					browser: null,
					waitTime: null,
					basicAuthUrl: null,
					basicAuthLogin: null,
					basicAuthPassword: null,
					enableScreenshot: null,
					maxDepth: null,
					maxDuration: null,
					maxDoc: null,
					exclusionRegex: null,
					inclusionRegex: null,
					resolutions: '',
					references: []
				},
                auditLogPageSize: 10,
                auditLogTotalPage : 0,
                auditLogCurrentPage: 0,
                auditLogTotal: 0,

                auditPagePageSize: 10,
                pageTotalPage: 0,
                pageCurrentPage: 0,
                pageTotal: 0
			};
		},
		created() {
			this.sharecode = typeof this.$route.params.sharecode !== 'undefined' ? this.$route.params.sharecode : null;

			this.auditService.findById(
				this.$route.params.id,
				this.sharecode,
				(audit) => {
					this.audit = audit;

					if(audit.private) this.getProject();
					else this.loadAudit(true, false);
				},
				(error) => {
					console.error(error);
					this.$router.replace('/notfound');
				}
			)
		},
		beforeDestroy () {
			clearInterval(this.timer)
		},
		methods: {
			getParameters(){
				this.auditParametersService.findByAuditId(
					this.$route.params.id,
					this.sharecode,
					(parameters) => {
						parameters.forEach(parameter => {
							if(parameter.auditParameter.code == "WEBDRIVER_BROWSER") {
								this.parameters.browser = parameter.value
							}
							else if(parameter.auditParameter.code == "WAIT_TIME") {
								this.parameters.waitTime = parameter.value
							}
							else if(parameter.auditParameter.code == "BASICAUTH_URL") {
								this.parameters.basicAuthUrl = parameter.value
							}
							else if(parameter.auditParameter.code == "BASICAUTH_LOGIN") {
								this.parameters.basicAuthLogin = parameter.value
							}
							else if(parameter.auditParameter.code == "BASICAUTH_PASSWORD") {
								this.parameters.basicAuthPassword = parameter.value
							}
							else if(parameter.auditParameter.code == "ENABLE_SCREENSHOT") {
								this.parameters.enableScreenshot = parameter.value
							}
							else if(parameter.auditParameter.code == "CRAWLER_MAX_DEPTH") {
								this.parameters.maxDepth = parameter.value
							}
							else if(parameter.auditParameter.code == "CRAWLER_MAX_DURATION") {
								this.parameters.maxDuration = parameter.value
							}
							else if(parameter.auditParameter.code == "CRAWLER_MAX_DOCUMENT") {
								this.parameters.maxDoc = parameter.value
							}
							else if(parameter.auditParameter.code == "CRAWLER_EXCLUSION_REGEX") {
								this.parameters.exclusionRegex = parameter.value
							}
							else if(parameter.auditParameter.code == "CRAWLER_INCLUSION_REGEX") {
								this.parameters.inclusionRegex = parameter.value
							}
							else if(parameter.auditParameter.code == "WEBDRIVER_RESOLUTIONS") {
								if(parameter.value.includes(";")) {
									this.parameters.resolutions = parameter.value.split(';').join(', ')
								} else {
									this.parameters.resolutions = parameter.value
								}
							}
						});
					},
					(error) => {
						console.error(error)
					}
				)
			},

			getAudit() {
				this.auditService.findById(
					this.$route.params.id,
					this.sharecode,
					(audit) => {
						this.audit = audit;
						this.loadAudit(false, false);
					},
					(error) => {
						console.error(error);
					}
				)
			},

			getProject() {
				this.projectService.findByAuditId(
					this.$route.params.id,
					this.sharecode,
					(project) => {
						this.project = project;

						this.projectService.getCurrentUserAuthorities(
							this.project.id,
							(authorities) => {
								if(authorities.includes("SHOW_AUDIT")) {
									this.loadAudit(true, true);
								} else {
									this.$router.replace('/forbidden');
								}
							},
							(error) => {
								console.log(error);
							}
						)
					},
					(error) => {
						console.error(error);
						this.$router.replace('/notfound');
					}
				);
			},

			loadAudit(firstLoad, refresh) {
				if(firstLoad) {
					this.getLogLevels();
					this.getReferences();
					this.getParameters();
					this.timer = setInterval(this.refreshPages, 3000);
				}

				if(refresh) this.refreshPages();

				this.loadPages(this.pageCurrentPage, this.auditPagePageSize, this.search);
				this.loadAuditLogs(this.auditLogCurrentPage, this.auditLogPageSize, this.firstToLast, this.levelsToDisplay);
			},

            async loadPages(page, size, name){
                await this.pageService.findByAuditIdAndName(
					this.$route.params.id,
					name,
                    this.sharecode,
                    page,
                    size,
                    (auditPagePage) =>{
                        this.tempPages = auditPagePage.content;
                        this.pageCurrentPage = page;
                        this.pageTotalPage = auditPagePage.totalPages;
                        this.pageTotal = auditPagePage.totalElements;
                    }
                );

				for(let i = 0; i < this.tempPages.length; i++) {
					let status = await this.loadPagesStatusResult(this.tempPages[i]);
					this.tempPages[i].percentage = status.percentage;
					this.tempPages[i].nbAnomaly = status.nbAnomaly;
				}

				this.pages = this.tempPages;
            },

			async loadPagesStatusResult(page) {
				var status = {};

				await this.testHierarchyResultService.findByPageAndTestHierarchy(
					page.id,
					this.parameters.mainReferenceId,
					this.sharecode,
					(results) => {
						Object.assign(status, {
							percentage: Math.round((results.nbP / (results.nbP + results.nbF)) * 100),
							nbAnomaly: results.nbEF
						});
					},
					(error) => {
						console.error(error);
					}
				);

				return status;
			},

            loadAuditLogs(page, size, asc, levelsToDisplay){
                this.auditLogService.findByAuditIdFiltered(
                    this.$route.params.id,
                    this.sharecode,
                    page,
					size,
					asc,
					levelsToDisplay,
                    (auditLogsPage) => {
                        this.auditLogCurrentPage = page;
                        this.auditLogs = auditLogsPage.content;
                        this.auditLogTotalPage = auditLogsPage.totalPages;
                        this.auditLogTotal = auditLogsPage.totalElements;
                    },
                    (error) => {
                        console.error(error);
                    }
                )
            },

			refreshPages(){
				if(this.audit && (this.audit.status === 'DONE' || this.audit.status === 'ERROR')) {
					clearInterval(this.timer)
				} else {
					this.getAudit();
				}
			},

			fireAriaLive(){
				clearTimeout(this.timer)
				this.timer = setTimeout(this.populateAriaLive, 1000)
			},

			populateAriaLive(){
				this.loadPages(0, this.auditPagePageSize, this.search)
				this.liveMsg = this.pages.length + ' ' + this.$i18n.t('auditDetail.pagesNb')
      		},

			reverseLogsOrder(){
				if(this.firstToLast == true) {
					this.firstToLast = false
				} else { this.firstToLast = true }
				this.loadAuditLogs(this.auditLogCurrentPage, this.auditLogPageSize, this.firstToLast, this.levelsToDisplay);
			},

			getLogLevels(){
				this.auditLogService.getLogLevels(
					levels => {
						this.levels = levels
					},
					err => console.error(err)
				)
			},

			levelChange(event) {
				if(event.target.value === 'INFO'){
					this.levelsToDisplay = ['INFO', 'WARNING', 'ERROR']
				}else if(event.target.value === 'WARNING'){
					this.levelsToDisplay = ['WARNING', 'ERROR']
				}else if(event.target.value === 'ERROR'){
					this.levelsToDisplay = ['ERROR']
				}
				this.loadAuditLogs(this.auditLogCurrentPage, this.auditLogPageSize, this.firstToLast, this.levelsToDisplay);
			},

			getReferences(){
				this.testHierarchyService.findAllReferenceByAudit(
					this.$route.params.id,
					this.sharecode,
					(references) => {
						for(var reference in references){
							this.parameters.references.push(references[reference].name + '(' +references[reference].code + ')')
						}
					},
					(error) => {
						console.error(error);
					}
				);

				this.testHierarchyService.findMainReferenceByAudit(
					this.$route.params.id,
					this.sharecode,
					(reference) => {
						this.parameters.mainReference = reference.name + '(' +reference.code + ')';
						this.parameters.mainReferenceId = reference.id;
					},
					(error) => {
						console.error(error);
					}
				);
			}

		},
		computed: {
			breadcrumbProps(){
				let result = [
					{
						name: this.$i18n.t("page.dashboard"),
						path: "/",
					}
				];

				if(this.project){
					if(this.project.contract.allowCreateProject){
						result.push({
							name: this.project.contract.name,
							path:
									"/contracts/" + this.project.contract.id,
						});

						result.push({
							name: this.project.name,
							path: "/projects/" + this.project.id,
						});
					}
				}

				if(this.audit){
					result.push({
						name: this.audit.name,
					});
				}
				return result
			}
		},
	};
</script>

<style lang="scss" scoped>
.title-logs {
	.title-logs__type {
		display: block;
		font-size: $small-font-size;
		font-weight: normal;
	}

	.title-logs__status {
		padding: .5rem .8rem;
		border-radius: .2rem;
		color: $color-white;
		font-size: $medium-font-size;
		vertical-align: middle;

		&.title-logs__status--done {
			background-color: $color-good;
		}

		&.title-logs__status--error {
			background-color: $color-alert;
		}

		&.title-logs__status--running {
			background-color: $color-info;
		}

		&.title-logs__status--pending &.title-logs__status--stopped{
			background-color: $color-disabled;
		}
	}
}

.section-logs {
	margin-bottom: 4.5rem;
}

.status {
	margin: 3.2rem 0 1.6rem;
	font-size: 2.2rem;

	.status__exergue {
		font-weight: bold;
	}
}
</style>
