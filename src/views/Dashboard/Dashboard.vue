<template>
  <main id="page" class="wrapper" role="main">
  	<header class="dashboard-header headline headline--top">
		<div class="dashboard-header__inner">
			<div class="dashboard-header__title">
				<h1>{{$t('page.dashboard')}}</h1>
				<ul class="actions-list">
                <li class="actions-list__item">
                    <a class="link link-independent link-independent--icon" href="#my-projects">
                        <span>{{$t('dashboard.title.myProjects')}}</span>
                    </a>
                </li>
                <li class="actions-list__item">
                    <a class="link link-independent link-independent--icon" href="#my-shared-projects">
                        <span>{{$t('dashboard.title.mySharedProjects')}}</span>
                    </a>
                </li>
                <li class="actions-list__item">
                    <a class="link link-independent link-independent--icon" href="#shared-with-me">
                        <span>{{$t('dashboard.title.sharedProjects')}}</span>
                    </a>
                </li>
            </ul>
			</div>
			<div class="dashboard-header__actions">
				<ul class="actions-list">
					<li class="actions-list__item" v-show="createProjectCondition">
						<router-link :to="'/contracts/'+currentContractId" v-on:click.native="activeTab()" class='btn btn--icon btn--nude'>
							<icon-base-decorative width="16" height="16"><icon-plus /></icon-base-decorative>
							<span>{{$t('dashboard.actions.new')}}</span>
						</router-link>
					</li>

					<li class="actions-list__item" v-show="userProjects.length > 1">
						<button class='btn btn--icon btn--nude' @click="switchView">
							<icon-base-decorative width="16" height="16" viewBox="0 0 16 16"><icon-organize /></icon-base-decorative>
							<span v-if="projectsOrder == 'chronological'">{{$t('dashboard.actions.alphabetical')}}</span>
							<span v-else>{{$t('dashboard.actions.chronological')}}</span>
						</button>
					</li>
				</ul>
				<!--
				<p class="dashboard-header-credits">{{$t('dashboard.actions.credits')}}</p>
				-->
			</div>
		</div>
	</header>

	<!-- PRIVATE PROJECTS -->
	<article class="dashboard-section">
		<h2 class="dashboard-section__title" id="my-projects">{{$t('dashboard.title.myProjects')}}</h2>
		<div v-if="projectsOrder == 'alphabetical' && privateProjects.length > 0">
			<DashProjectView v-for="project in alphabeticalPrivateProjects" :project="project" :key="project.id" />
		</div>
		<div v-else-if="projectsOrder == 'chronological' && privateProjects.length > 0">
			<DashProjectView v-for="project in chronologicalPrivateProjects" :project="project" :key="project.id" />
		</div>
		<div v-else>
			<p>{{$t('dashboard.project.noProject')}}</p>
		</div>
	</article>

	<!-- PROJECTS SHARED BY USER -->
	<article class="dashboard-section">
		<h2 class="dashboard-section__title" id="my-shared-projects">{{$t('dashboard.title.mySharedProjects')}}</h2>
		<div v-if="projectsOrder == 'alphabetical' && sharedByCurrentUser.length > 0">
			<DashProjectView v-for="project in alphabeticalSharedProjects" :project="project" :key="project.id" />
		</div>
		<div v-else-if="projectsOrder == 'chronological' && sharedByCurrentUser.length > 0">
			<DashProjectView v-for="project in chronologicalSharedProjects" :project="project" :key="project.id" />
		</div>
		<div v-else>
			<p>{{$t('dashboard.project.noProject')}}</p>
		</div>
	</article>

	<!-- PROJECTS SHARED WITH USER -->
	<article class="dashboard-section">
		<h2 id="shared-with-me">{{$t('dashboard.title.sharedProjects')}}</h2>
		<div v-if="sharedProjects.length > 0">
			<DashProjectView v-for="project in sharedProjects" :project="project" :key="project.id" />
		</div>
		<div v-else>
			<p>{{$t('dashboard.project.noSharedProject')}}</p>
		</div>
	</article>

	<BackToTop />

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

	export default {
		name: 'dashboard',
		components: {
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
		metaInfo(){
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
				currentUserRole : '',
				contractsOwned : [],
				currentContractId : null,
				sharedContracts : [],
				privateProjects: [],
				sharedByCurrentUser: [],
				sharedProjects : [],
				projects: {},
				userProjects: [],
				audits: [],
				circularChartProps: {
					percentage : 56,
				},
				projectsOrder: 'chronological'
			}
		},
		created() {
			this.contractService.findOwned(
				(contracts) => {
					/* KEEP FOR FUTURE CHANGES
					var contracts = contracts;
					for (let i = 0; i < contracts.length; i++) {
						this.projectService.findMemberOfByContractId(
							contracts[i].id,
							(projects) => {
								this.userProjects = projects
							},
							(error) => { 'error' }
						)
					}*/
					this.currentContractId = contracts[0].id
					this.projectService.findMemberOfByContractId(
						contracts[0].id,
						(projects) => {
							projects.forEach(project => {
								this.userService.findAllByProject(
									project.id,
									(users) => {
										if(users.length > 1){
											this.sharedByCurrentUser.push(project)
										} else {
											this.privateProjects.push(project)
										}
									},
									(error) => { 'error' }
								)
							});
						},
					)

					this.userService.findAllByContract(
						this.currentContractId,
						(users) => {
							let currentUser = users.filter(user =>
								user.id == this.$store.state.auth.user.id
							)
							this.currentUserRole = currentUser[0].contractRole.name
						},
						(error) => { 'error' }
					)
				},
				(error) => { 'error' }
			)

			this.projectService.findMemberOfNotOwner(
				(projects) => {
					this.sharedProjects = projects
				},
				(error) => { console.error(error) }
			)
		},
		computed: {
			alphabeticalPrivateProjects(){
				return this.privateProjects.sort(function(a, b){
                    return a.name.localeCompare(b.name)
				})
			},

			chronologicalPrivateProjects(){
				return this.privateProjects.sort((a, b) => b.id - a.id);
			},

			alphabeticalSharedProjects(){
				return this.sharedByCurrentUser.sort(function(a, b){
                    return a.name.localeCompare(b.name)
				})
			},

			chronologicalSharedProjects(){
				return this.sharedByCurrentUser.sort((a, b) => b.id - a.id);
			},


			createProjectCondition(){
				return this.currentContractId;
			}
		},
		methods: {
			switchView(){
				if(this.projectsOrder == 'chronological'){
					this.projectsOrder = 'alphabetical'
				}
				else {
					this.projectsOrder = 'chronological'
				}
			},

			activeTab(){
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
		display: none;
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
