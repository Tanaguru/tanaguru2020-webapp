<template>
	<main id="page" class="wrapper" role="main">
		<header class="dashboard-header headline headline--top">
			<div class="dashboard-header__inner">
				<div class="dashboard-header__title">
					<h1>{{ $t('page.dashboard') }}</h1>
					<ul class="actions-list">
						<li class="actions-list__item">
							<a class="link link-independent link-independent--icon" href="#my-projects">
								<span>{{ $t('dashboard.title.myProjects') }}</span>
							</a>
						</li>
						<li class="actions-list__item">
							<a class="link link-independent link-independent--icon" href="#my-shared-projects">
								<span>{{ $t('dashboard.title.mySharedProjects') }}</span>
							</a>
						</li>
						<li class="actions-list__item">
							<a class="link link-independent link-independent--icon" href="#shared-with-me">
								<span>{{ $t('dashboard.title.sharedProjects') }}</span>
							</a>
						</li>
					</ul>
				</div>
				<div class="dashboard-header__actions">
					<ul class="actions-list">
						<li class="actions-list__item" v-if="contracts.length > 0 && contracts[0]">
							<router-link :to="'/contracts/'+contracts[0].id" v-on:click.native="activeTab()"
										 class='btn btn--icon btn--nude'>
								<icon-base-decorative width="16" height="16">
									<icon-plus/>
								</icon-base-decorative>
								<span>{{ $t('dashboard.actions.new') }}</span>
							</router-link>
						</li>

						<!--<li class="actions-list__item">
							<button class='btn btn--icon btn--nude' @click="switchView">
								<icon-base-decorative width="16" height="16" viewBox="0 0 16 16"><icon-organize /></icon-base-decorative>
								<span v-if="projectsOrder == 'chronological'">{{$t('dashboard.actions.alphabetical')}}</span>
								<span v-else>{{$t('dashboard.actions.chronological')}}</span>
							</button>
						</li>-->
					</ul>
					<!--<p class="dashboard-header-credits">{{$t('dashboard.actions.credits')}}</p>
					-->
				</div>
			</div>
		</header>

		<!-- PRIVATE PROJECTS -->
		<article class="dashboard-section">
			<div class="form-block form-block--half">
				<label class="label" for="search-project">{{ $t('action.search') }} : </label>
				<input
					class="input"
					type="search"
					name="search-project"
					id="search-project"
					v-model="projectSearch"
					aria-describedby="search-explanation"
					autocomplete="off"
					@input="fireAriaLive"
				>
			</div>
			<p class='screen-reader-text' id="search-explanation">{{ $t('projects.infoSearch') }}</p>

			<h2 class="dashboard-section__title" id="my-projects">{{ $t('dashboard.title.myProjects') }}</h2>
			<div v-if="userProjects_page && userProjects_page.content.length > 0">
				<DashProjectView v-for="project in userProjects_page.content" :project="project" :key="project.id"/>
				<pagination :total-pages="userProjects_page.totalPages" :current-page="userProjects_page.number"
							@changePage="(page)=> getMyProjects(page)"/>
			</div>

			<div v-else>
				<p>{{ $t('dashboard.project.noProject') }}</p>
			</div>
		</article>

		<!-- PROJECTS SHARED BY USER -->
		<article class="dashboard-section">
			<h2 class="dashboard-section__title" id="my-shared-projects">
				{{ $t('dashboard.title.mySharedProjects') }}</h2>
			<div v-if="sharedByCurrentUser_page && sharedByCurrentUser_page.content.length > 0">
				<DashProjectView v-for="project in sharedByCurrentUser_page.content" :project="project"
								 :key="project.id"/>
				<pagination :total-pages="sharedByCurrentUser_page.totalPages"
							:current-page="sharedByCurrentUser_page.number"
							@changePage="(page)=> getMySharedProjects(page)"/>
			</div>

			<div v-else>
				<p>{{ $t('dashboard.project.noProject') }}</p>
			</div>
		</article>

		<!-- PROJECTS SHARED WITH USER -->
		<article class="dashboard-section">
			<h2 id="shared-with-me">{{ $t('dashboard.title.sharedProjects') }}</h2>
			<div v-if="sharedProjects_page && sharedProjects_page.content.length > 0">
				<DashProjectView v-for="project in sharedProjects_page.content" :project="project"
								 :key="project.id"/>
				<pagination :total-pages="sharedProjects_page.totalPages" :current-page="sharedProjects_page.number"
							@changePage="(page)=> getProjectsSharedWithMe(page)"/>
			</div>
			<div v-else>
				<p>{{ $t('dashboard.project.noSharedProject') }}</p>
			</div>
		</article>

		<BackToTop/>

	</main>
</template>

<script>
import DashProjectView from './DashProjectView'
import BackToTop from '../../components/BackToTop'
import IconBaseDecorative from '../../components/icons/IconBaseDecorative'
import IconOrganize from '../../components/icons/IconOrganize'
import IconPlus from '../../components/icons/IconPlus'
import IconLaunch from '../../components/icons/IconLaunch'
import IconArrowBlue from '../../components/icons/IconArrowBlue'
import IconParameters from '../../components/icons/IconParameters'
import IconVersion from '../../components/icons/IconVersion'
import IconCompliant from '../../components/icons/IconCompliant'
import IconIgnored from '../../components/icons/IconIgnored'
import IconImproper from '../../components/icons/IconImproper'
import IconNotApplicable from '../../components/icons/IconNotApplicable'
import IconQualify from '../../components/icons/IconQualify'
import IconUntested from '../../components/icons/IconUntested'
import IconAuditPage from '../../components/icons/IconAuditPage'
import IconAuditSite from '../../components/icons/IconAuditSite'
import IconAuditScenario from '../../components/icons/IconAuditScenario'
import IconAuditAssisted from '../../components/icons/IconAuditAssisted'
import IconAuditFile from '../../components/icons/IconAuditFile'
import CircularProgressChart from "../../components/charts/CircularProgressChart.vue"
import PolarChart from "../../components/charts/PolarChart.vue"
import Pagination from "@/components/Pagination";

export default {
	name: 'dashboard',
	components: {
		Pagination,
		DashProjectView,
		BackToTop,
		IconBaseDecorative,
		IconOrganize,
		IconPlus,
		IconLaunch,
		IconArrowBlue,
		IconParameters,
		IconVersion,
		IconCompliant,
		IconIgnored,
		IconImproper,
		IconNotApplicable,
		IconQualify,
		IconUntested,
		IconAuditAssisted,
		IconAuditPage,
		IconAuditScenario,
		IconAuditSite,
		IconAuditFile,
		PolarChart,
		CircularProgressChart
	},
	metaInfo() {
		return {
			// if no subcomponents specify a metaInfo.title, this title will be used
			title: this.$i18n.t("global.siteName") + ' - ' + this.$i18n.t("title.dashboard"),
			meta: [
				{
					name: 'robots', content: 'noindex'
				}
			]
		}
	},
	data() {
		return {
			contracts: [],

			projectSearch: "",
			sharedByCurrentUser_page: null,
			sharedProjects_page: null,
			userProjects_page: null,

			circularChartProps: {
				percentage: 56,
			},
		}
	},
	created() {
		this.contractService.findOwned(
			(contracts) => {
				this.contracts = contracts;
			},
			(error) => {
				console.error(error)
			}
		)
		this.getMyProjects(0);
		this.getMySharedProjects(0);
		this.getProjectsSharedWithMe(0);
	},
	methods: {
		fireAriaLive() {
			clearTimeout(this.timer)
			this.timer = setTimeout(this.populateAriaLive, 1000)
		},

		populateAriaLive() {
			this.liveMsg = this.contracts.length + ' ' + this.$i18n.t("contract.contracts");
			this.searchProjects();
		},

		searchProjects() {
			this.getMyProjects(this.userProjects_page ? this.userProjects_page.number : 0);
			this.getMySharedProjects(this.sharedByCurrentUser_page ? this.sharedByCurrentUser_page.number : 0);
			this.getProjectsSharedWithMe(this.sharedProjects_page ? this.sharedProjects_page.number : 0);
		},
		getMyProjects(page) {
			this.projectService.findMyProjects(page, 5, this.projectSearch,
				(projects_page) => {
					this.userProjects_page = projects_page;
				},
				(error) => {
					console.error(error)
				})
		},
		getMySharedProjects(page) {
			this.projectService.findMySharedProjects(page, 5, this.projectSearch,
				(projects_page) => {
					this.sharedByCurrentUser_page = projects_page;
				},
				(error) => {
					console.error(error)
				})
		},
		getProjectsSharedWithMe(page) {
			this.projectService.findMemberOfNotOwner(page, 5, this.projectSearch,
				(projects_page) => {
					this.sharedProjects_page = projects_page;
				},
				(error) => {
					console.error(error)
				})
		},
		switchView() {
			if (this.projectsOrder == 'chronological') {
				this.projectsOrder = 'alphabetical'
			} else {
				this.projectsOrder = 'chronological'
			}
		},

		activeTab() {
			this.$store.state.activeTab.name = 'projects'
		}
	}
}
</script>

<style lang="scss" scoped>
/* General layout */
.dashboard-section {
	margin: 3.2rem 0;

	@media #{$media-md-viewport} {
		margin: 5.4rem 0;
	}
}

/* Header dashboard */
.dashboard-header {
	color: $text-secondary;

	.dashboard-header__inner {
		@media #{$media-md-viewport} {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}

	.dashboard-header__title {
		h1 {
			margin: 0;
		}
	}

	.dashboard-header__actions {
		margin: 1.6rem 0 0;
		text-align: right;

		@media #{$media-md-viewport} {
			display: block;
		}
	}
}

.dashboard-header-credits {
	margin: 0;
}
</style>
