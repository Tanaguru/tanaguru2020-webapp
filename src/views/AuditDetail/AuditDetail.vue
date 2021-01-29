<template>
	<main id="page" class="wrapper" v-if="audit">
		<Breadcrumbs :breadcrumbsItems="breadcrumbProps"></Breadcrumbs>

		<Tabs>
			<Tab :name="$t('auditDetail.tabs.logs')" selected="true">
                <div class="tabs-wrapper">
                    <header>
                        <h1 class="title-logs">
							{{ audit.name }}
                        </h1>
                    </header>

					<section class="main-info title-logs">		
						<h2>Information</h2>	
						<p>
							{{ $t('auditDetail.information.status') }}
							<span aria-live="polite" :class="'title-logs__status title-logs__status--' + audit.status.toLowerCase()" v-if="audit">{{ $t('auditDetail.status.' +  audit.status.toLowerCase()) }}</span>
						</p>
						<p>
							{{ $t('auditDetail.information.type') }} 
							<span v-if="audit.type === 'SITE'">{{ $t('entity.audit.site') }}</span>
                            <span v-else-if="audit.type === 'PAGE'">{{ $t('entity.audit.page') }}</span>
                            <span v-else-if="audit.type === 'SCENARIO'">{{ $t('entity.audit.scenario') }}</span>
                            <span v-else>{{ $t('entity.audit.upload') }}</span>
						</p>
						<p v-if="browser == 'firefox'" >{{ $t('auditDetail.information.browser') }}Mozilla Firefox</p>
						<p v-else-if="browser == 'chrome'" >{{ $t('auditDetail.information.browser') }}Google Chrome</p>
						<p>{{ $t('auditDetail.information.reference') }}{{ mainReference }}</p>
					</section>

					<section class="section-logs">
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
							@changePage="(page) => {loadPages(page, auditPagePageSize)}"
						/>
					</section>

					<hr role="presentation" class="separator" />

					<section class="section-logs">
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
							@changePage="(page) => {loadAuditLogs(page, auditLogPageSize)}"
						/>
					</section>
                </div>
			</Tab>
			<Tab :name="$t('auditDetail.tabs.synthesis')" v-if="audit.status=='DONE' && pages.length > 1">
				<Synthesis :audit="audit"/>
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
			IconBaseDecorative
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
				timer: null,
				audit: null,
				sharecode: null,
          		project: null,
				parameters: [],
				pages: [],
				auditLogs: [],
				mainReference: null,
				browser: null,

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
			this.sharecode = this.$route.params.sharecode;
			this.getProject();
			this.refreshPages();
			this.timer = setInterval(this.refreshPages, 3000);

            this.loadPages(this.pageCurrentPage, this.auditPagePageSize);
			this.loadAuditLogs(this.auditLogCurrentPage, this.auditLogPageSize);	
		},
		beforeDestroy () {
			clearInterval(this.timer)
		},
		methods: {
			getProject(){
				this.projectService.findByAuditId(
						this.$route.params.id,
						this.sharecode,
						(project) => {
							this.project = project;
						},
						(error) => {
							console.error(error);
						}
				);
			},

			getAudit(){
				this.auditService.findById(
						this.$route.params.id,
						this.sharecode,
						(audit) => {
							this.audit = audit;

							this.auditParametersService.findByAuditId(
								audit.id,
								this.sharecode,
								(parameters) => {
									let browser = null;
									parameters.forEach(parameter => {
										if(parameter.auditParameter.code == "WEBDRIVER_BROWSER") {
											browser = parameter.value
										}
									});
									this.browser = browser
									this.mainReference = 'to do'
								},
								(error) => {
									console.log(error)
								}
							)
						},
						(error) => {
							console.error(error);
						}
				);

                this.loadPages(this.pageCurrentPage, this.auditPagePageSize);
                this.loadAuditLogs(this.auditLogCurrentPage, this.auditLogPageSize);
			},

            loadPages(page, size){
                this.pageService.findByAuditId(
                    this.$route.params.id,
                    this.sharecode,
                    page,
                    size,
                    (auditPagePage) =>{
                        this.pages = auditPagePage.content;
                        this.pageCurrentPage = page;
                        this.pageTotalPage = auditPagePage.totalPages;
                        this.pageTotal = auditPagePage.totalElements;
                    }
                )
            },

            loadAuditLogs(page, size){
                this.auditLogService.findByAuditId(
                    this.$route.params.id,
                    this.sharecode,
                    page,
                    size,
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
				if(this.audit && (this.audit.status === 'DONE' || this.audit.status === 'ERROR')){
					clearInterval(this.timer)
				}else{
					this.getAudit();
				}
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

		&.title-logs__status--pending {
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
