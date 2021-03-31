<template>
	<article class="project-item">
		<header class="project-item-header">
			<div>
				<h3 class="project-title">
					<router-link :to="'/projects/' + project.id" class="link-independent" :aria-label="project.name">{{ project.name }}</router-link>
				</h3>
				<ul class="actions-list desktop-flex-element">
					<li class="actions-list__item">
						<router-link :to="'/contracts/' + project.contract.id" v-on:click.native="activeTab()" class="link-independent">{{$t('entity.contract.contract')}} {{ project.contract.name }}</router-link>
					</li>
					<li class="actions-list__item">
						<router-link :to="'/projects/' + project.id + '/archives'" class="link-independent link-independent--icon" :aria-label="project.name+ ': ' +$t('action.archives')">
							<icon-base-decorative width="16" height="16"><icon-version /></icon-base-decorative>
							<span>{{$t('dashboard.actions.archives')}}</span>
						</router-link>
					</li>
				</ul>
			</div>

			<button class='btn btn--icon btn--nude btn--tab mobile-element' :aria-controls="'project'+project.id" :aria-expanded="projectOpen ? 'true' : 'false'" @click="toggleProject" >
				<icon-base-decorative :class="projectOpen ? 'hide' : 'show'"><icon-arrow-blue /></icon-base-decorative>
				<span class="screen-reader-text" v-if="projectOpen">{{$t('action.hide')}}</span>
				<span class="screen-reader-text" v-else>{{$t('action.show')}}</span>
			</button>

			<div class="project-header-infos desktop-flex-element">
				<div class="project-stats" v-if="lastAudit && lastAudit.statusResult">
					<p class="project-stats__error"><span class="project-stats__exergue">{{lastAudit.statusResult.nbEF}}</span>{{$t('dashboard.project.anomaly')}}</p>
					<div class="project-stats__chart">
						<CircularProgressChart
							:percentage="Math.round(lastAudit.statusResult.nbTP / (lastAudit.statusResult.nbTF + lastAudit.statusResult.nbTP) * 100)"
							:shadowOne="'desktopChart-shadow1-' + project.id"
							:shadowTwo="'desktopChart-shadow2-' + project.id"
							:gradient="'desktopChart-gradient-' + project.id" />
					</div>
				</div>

				<ul class="actions-list">
					<li class="actions-list__item" v-show="auditLaunchCondition && validContract">
						<router-link :to="'/projects/'+project.id+'/audit'" class='btn btn--icon btn--nude'>
							<icon-base-decorative><icon-launch /></icon-base-decorative>
							<span>{{$t('action.auditLaunch')}}</span>
						</router-link>
					</li>
					<li class="actions-list__item">
						<button class='btn btn--icon btn--nude btn--tab' :aria-controls="'project'+project.id" :aria-expanded="projectOpen ? 'true' : 'false'" @click="toggleProject" >
							<icon-base-decorative :class="projectOpen ? 'hide' : 'show'"><icon-arrow-blue /></icon-base-decorative>
							<span class="screen-reader-text" v-if="projectOpen">{{$t('action.hide')}}</span>
							<span class="screen-reader-text" v-else>{{$t('action.show')}}</span>
						</button>
					</li>
				</ul>
			</div>
		</header>

		<div class="project-item-content" v-show="projectOpen" :id="'project'+project.id">
			<div class="project-item-content__general">
				<div
					v-if="lastAuditFirstPageContent && lastAuditFirstPageContent.screenshot"
					class="project-item-caps desktop-element"
					:style="`background-image:url(data:image/png;base64,` + lastAuditFirstPageContent.screenshot + `)`">
				</div>

				<ul class="project-item-list infos-list">
					<li><span class="infos-list__exergue">{{$t('dashboard.project.url')}}</span> {{ project.domain }}</li>
					<li>
						<span class="infos-list__exergue">{{$t('dashboard.project.repository')}} </span>
						<span v-for="(name, i) in repositoriesNames" :key="i">{{ name }}<span v-if="i+1 != repositoriesNames.length">, </span></span>
					</li>
					<li><span class="infos-list__exergue">{{$t('dashboard.project.date')}}</span> {{ moment(project.contract.dateEnd).format('LL') }}</li>
				</ul>

				<div class="project-item-team desktop-element">
					<p class="team-title">{{$t('dashboard.project.team')}}</p>
					<ul class="team-list list-unstyled">
						<li class="team-list__item" v-for="(user, i) in users" :key="user.contractAppUser.id">
							<router-link v-if="i < 3" :to="'/users/' + user.contractAppUser.user.id">

								<span v-if="user.contractAppUser.user.appRole.name == 'USER'" class="team-list__picture" style="background-image:url('https://i.ibb.co/f2HHwzx/collection-caracteres-bebe-dragon-dessines-main-23-2147831551-2.jpg')"></span>

								<span v-else-if="user.contractAppUser.user.appRole.name == 'ADMIN'" class="team-list__picture" style="background-image:url('https://i.ibb.co/ZW7dgkw/baby-dragon-character-collection-with-flat-design-23-2147823681-2.jpg')"></span>

								<span v-else class="team-list__picture" style="background-image:url('https://i.ibb.co/kGq4gxY/tanaguru-logo-dragon-10x.png')"></span>

								<span class="team-list__name">{{ user.contractAppUser.user.username }}<br />{{ user.projectRole.name.charAt(0) + user.projectRole.name.slice(1).toLowerCase().replace(/_/g,' ') }}</span>
							</router-link>
						</li>
					</ul>
					<button type="button" v-if="users.length >= 3" class="btn btn--nude btn--icon" @click="openModal">
						<icon-base-decorative><icon-arrow-blue /></icon-base-decorative>
						<span>{{ $t('dashboard.project.btnTeam') }}</span>
					</button>

					<vue-accessible-modal>
						<template v-slot:backdrop></template>
					</vue-accessible-modal>
				</div>

				<div class="project-stats mobile-element" v-if="lastAudit && lastAudit.statusResult">
					<p class="project-stats__error"><span class="project-stats__exergue">962</span>{{$t('dashboard.project.anomaly')}}</p>
					<div class="project-stats__chart">
						<CircularProgressChart
								v-if="lastAudit && lastAudit.statusResult"
							:percentage="Math.round(lastAudit.statusResult.nbTP/ (lastAudit.statusResult.nbTF + lastAudit.statusResult.nbTP) * 100)"
							:shadowOne="'mobileChart-shadow1-' + project.id"
							:shadowTwo="'mobileChart-shadow2-' + project.id"
							:gradient="'mobileChart-gradient-' + project.id" />
					</div>
				</div>
			</div>

			<div class="project-item-content__audits">
				<div class="no-audit" v-if="!lastAudit && validContract">
					<p>{{$t('dashboard.project.noAudit')}}</p>

					<router-link :to="'/projects/'+project.id+'/audit'" class='btn btn--icon btn--default'>
						<icon-base-decorative><icon-launch /></icon-base-decorative>
						<span>{{$t('action.auditLaunch')}}</span>
					</router-link>
				</div>

				<div class="audits-list" v-else>
					<!-- Page audit -->
					<div class="audits-list__item audit-list__item--mobile mobile-element" v-if="lastPageAudit">
						<router-link :to="'/projects/'+project.id+'/audit'" class="link-independent link-independent--icon">
							<icon-base-decorative width="40" height="40" viewBox="0 0 72 72"><icon-audit-page /></icon-base-decorative>
							<span>{{$t('dashboard.project.lastPageAudit')}}</span>
						</router-link>
					</div>

					<div class="audits-list__item audit-list__item--desktop audit-preview desktop-element" v-if="lastPageAudit">
						<div class="audit-preview__header">
							<icon-base-decorative class="audit-preview__icon" width="40" height="40" viewBox="0 0 72 72"><icon-audit-page /></icon-base-decorative>
							<h4 class="audit-preview__title">{{$t('entity.audit.page')}}</h4>
						</div>

						<PolarChart class="audit-preview__chart" v-if="lastPageAudit.statusResult"
						:nb-passed="lastPageAudit.statusResult.nbTP"
						:nb-failed="lastPageAudit.statusResult.nbTF"
						:nb-untested="0"
						:nb-inapplicable="lastPageAudit.statusResult.nbTI"
						:nb-cant-tell="lastPageAudit.statusResult.nbTCT"
						:chart-id="'pagePolar-id' + project.id"/>

						<router-link :to="'/audits/' + lastPageAudit.id" class="link-independent link-independent--icon">
							<icon-base-decorative width="16" height="16"><icon-arrow-blue /></icon-base-decorative>
							<span>{{$t('dashboard.project.lastPageAudit')}}</span>
						</router-link>
						<!-- TODO
						<p class="audit-preview__info">{{$t('dashboard.project.update')}} 27/02/2020<br />{{$t('dashboard.project.author')}} Askja Dominikstodir</p>
						-->
					</div>
					<!-- Page audit -->

					<!-- Site audit -->
					<div class="audits-list__item audit-list__item--mobile mobile-element" v-if="lastSiteAudit">
						<router-link :to="'/projects/'+project.id+'/audit'" class="link-independent link-independent--icon">
							<icon-base-decorative width="40" height="40" viewBox="0 0 72 72"><icon-audit-site /></icon-base-decorative>
							<span>{{$t('dashboard.project.lastSiteAudit')}}</span>
						</router-link>
					</div>

					<div class="audits-list__item audit-list__item--desktop audit-preview desktop-element" v-if="lastSiteAudit">
						<div class="audit-preview__header">
							<icon-base-decorative class="audit-preview__icon" width="40" height="40" viewBox="0 0 72 72"><icon-audit-site /></icon-base-decorative>
							<h4 class="audit-preview__title">{{$t('entity.audit.site')}}</h4>
						</div>

						<PolarChart class="audit-preview__chart" v-if="lastSiteAudit.statusResult"
						:nb-passed="lastSiteAudit.statusResult.nbTP"
						:nb-failed="lastSiteAudit.statusResult.nbTF"
						:nb-untested="0"
						:nb-inapplicable="lastSiteAudit.statusResult.nbTI"
						:nb-cant-tell="lastSiteAudit.statusResult.nbTCT"
						:chart-id="'sitePolar-id' + project.id" />

						<router-link :to="'/audits/' + lastSiteAudit.id" class="link-independent link-independent--icon">
							<icon-base-decorative width="16" height="16"><icon-arrow-blue /></icon-base-decorative>
							<span>{{$t('dashboard.project.lastSiteAudit')}}</span>
						</router-link>
						<!-- TODO
						<p class="audit-preview__info">{{$t('dashboard.project.update')}} 27/02/2020<br />{{$t('dashboard.project.author')}} Askja Dominikstodir</p>
						-->
					</div>
					<!-- Site audit -->

					<!-- Scenario audit -->
					<div class="audits-list__item audit-list__item--mobile mobile-element" v-if="lastScenarioAudit">
						<router-link :to="'/audits/' + lastScenarioAudit.id" class="link-independent link-independent--icon">
							<icon-base-decorative width="40" height="40" viewBox="0 0 72 72"><icon-audit-scenario /></icon-base-decorative>
							<span>{{$t('dashboard.project.lastScenarioAudit')}}</span>
						</router-link>
					</div>

					<div class="audits-list__item audit-list__item--desktop audit-preview desktop-element"  v-if="lastScenarioAudit">
						<div class="audit-preview__header">
							<icon-base-decorative class="audit-preview__icon" width="40" height="40" viewBox="0 0 72 72"><icon-audit-scenario /></icon-base-decorative>
							<h4 class="audit-preview__title">{{$t('entity.audit.scenario')}}</h4>
						</div>

						<PolarChart class="audit-preview__chart" v-if="lastScenarioAudit.statusResult"
						:nb-passed="lastScenarioAudit.statusResult.nbTP"
						:nb-failed="lastScenarioAudit.statusResult.nbTF"
						:nb-untested="0"
						:nb-inapplicable="lastScenarioAudit.statusResult.nbTI"
						:nb-cant-tell="lastScenarioAudit.statusResult.nbTCT"
						:chart-id="'scenarioPolar-id' + project.id"/>

						<router-link :to="'/audits/' + lastScenarioAudit.id" class="link-independent link-independent--icon">
							<icon-base-decorative width="16" height="16"><icon-arrow-blue /></icon-base-decorative>
							<span>{{$t('dashboard.project.lastScenarioAudit')}}</span>
						</router-link>
						<!-- TODO
						<p class="audit-preview__info">{{$t('dashboard.project.update')}} 27/02/2020<br />{{$t('dashboard.project.author')}} Askja Dominikstodir</p>
						-->
					</div>
					<!-- Scenario audit -->

					<!-- File audit -->
					<div class="audits-list__item audit-list__item--mobile mobile-element" v-if="lastUploadAudit">
						<router-link :to="'/audits/' + lastUploadAudit.id" class="link-independent link-independent--icon">
							<icon-base-decorative width="40" height="40" viewBox="0 0 72 72"><icon-audit-file /></icon-base-decorative>
							<span>{{$t('dashboard.project.lastUploadAudit')}}</span>
						</router-link>
					</div>

					<div class="audits-list__item audit-list__item--desktop audit-preview desktop-element" v-if="lastUploadAudit">
						<div class="audit-preview__header">
							<icon-base-decorative class="audit-preview__icon" width="40" height="40" viewBox="0 0 72 72"><icon-audit-file /></icon-base-decorative>
							<h4 class="audit-preview__title">{{$t('entity.audit.upload')}}</h4>
						</div>

						<PolarChart class="audit-preview__chart" v-if="lastUploadAudit.statusResult"
						:nb-passed="lastUploadAudit.statusResult.nbTP"
						:nb-failed="lastUploadAudit.statusResult.nbTF"
						:nb-untested="0"
						:nb-inapplicable="lastUploadAudit.statusResult.nbTI"
						:nb-cant-tell="lastUploadAudit.statusResult.nbTCT"
						:chart-id="'filePolar-id' + project.id"/>

						<router-link :to="'/audits/' + lastUploadAudit.id" class="link-independent link-independent--icon">
							<icon-base-decorative width="16" height="16"><icon-arrow-blue /></icon-base-decorative>
							<span>{{$t('dashboard.project.lastUploadAudit')}}</span>
						</router-link>
						<!-- TODO
						<p class="audit-preview__info">{{$t('dashboard.project.update')}} 27/02/2020<br />{{$t('dashboard.project.author')}} Askja Dominikstodir</p>
						-->
					</div>
					<!-- File audit -->

					<!-- Legend (always be displayed) -->
					<div class="audits-list__item audit-list__item--desktop audit-preview desktop-element">
						<div class="audit-preview__header">
							<h4 class="audit-preview__title">{{$t('dashboard.project.legend')}}</h4>
						</div>

						<ul class="tests-list list-unstyled">
							<li class="tests-list__item">
								<span class="tests-list__label">
									<icon-base-decorative><icon-improper /></icon-base-decorative>
									<span>{{ $t("entity.audit.result.failed") }}</span>
								</span>
							</li>
							<li class="tests-list__item">
								<span class="tests-list__label">
									<icon-base-decorative><icon-qualify /></icon-base-decorative>
									<span>{{ $t("entity.audit.result.cantTell") }}</span>
								</span>
							</li>
							<li class="tests-list__item">
								<span class="tests-list__label">
									<icon-base-decorative><icon-untested /></icon-base-decorative>
									<span>{{ $t("entity.audit.result.untested") }}</span>
								</span>
							</li>
							<li class="tests-list__item">
								<span class="tests-list__label">
									<icon-base-decorative><icon-compliant /></icon-base-decorative>
									<span>{{ $t("entity.audit.result.passed") }}</span>
								</span>
							</li>
							<li class="tests-list__item">
								<span class="tests-list__label">
									<icon-base-decorative><icon-not-applicable /></icon-base-decorative>
									<span>{{ $t("entity.audit.result.inapplicable") }}</span>
								</span>
							</li>
						</ul>

						<router-link :to="'/projects/' + project.id + '/archives'" class="link-independent link-independent--icon link-archives">
							<icon-base-decorative><icon-version /></icon-base-decorative>
							<span>{{$t('action.archives')}}</span>
						</router-link>
					</div>
					<!-- Legend (always be displayed) -->
				</div>

				<div class="audit-links mobile-element">
					<ul class="actions-list">
						<li class="actions-list__item" v-if="auditLaunchCondition && validContract">
							<router-link :to="'/projects/'+project.id+'/audit'" class='link-independent link-independent--icon'>
								<icon-base-decorative><icon-launch /></icon-base-decorative>
								<span>{{$t('action.auditLaunch')}}</span>
							</router-link>
						</li>

						<li class="actions-list__item">
							<router-link :to="'/projects/' + project.id + '/archives'" class="link-independent link-independent--icon" :aria-label="project.name+ ': ' +$t('action.archives')">
								<icon-base-decorative width="16" height="16"><icon-version /></icon-base-decorative>
								<span>{{$t('dashboard.actions.archives')}}</span>
							</router-link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</article>

</template>

<script>
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
import IconInforound from '../../components/icons/IconInforound'
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

import TeamModal from './TeamModal'

export default {
	name: 'DashProjectView',
	components: {
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
		CircularProgressChart,
		TeamModal
	},
	props : [ 'project' ],
	data(){
		return {
			lastAuditFirstPageContent: null,

			lastAudit: null,
			lastPageAudit: null,
			lastSiteAudit: null,
			lastScenarioAudit: null,
			lastUploadAudit: null,
			users: [],
			currentUserRole: null,
			projectOpen: false,
			repositories: [],
		}
	},
	created() {
		this.auditService.findLastByProject(
			this.project.id,
			(audit) => {
				this.lastAudit = audit;
				if(audit){

					this.pageContentService.findFirstByAuditId(
						audit.id,
						audit.shareCode,
						(pageContent) => {
							this.lastAuditFirstPageContent = pageContent;
						},
						(error) => {
							console.error(error);
						},
					);

					this.testHierarchyService.findAllReferenceByAudit(
						audit.id,
						audit.shareCode,
						(references) => {
							this.repositories = references;
						}
					)
					this.getAuditResult(audit);
				}
			},
			(error) => {
				console.error(error)
			}
		);
	},
	computed: {
		auditLaunchCondition(){
			let condition = false;

			if(this.$store.state.auth.user.appRole.overrideProjectRole.name === 'PROJECT_MANAGER' || this.$store.state.auth.user.appRole.overrideProjectRole.name === 'PROJECT_USER'){
				condition = true
			}
			else if(this.currentUserRole === "PROJECT_MANAGER" || this.currentUserRole === "PROJECT_USER" ){
				condition = true
			}
			return condition
		},

		validContract(){
			let condition = true
			if(this.$moment(this.project.contract.dateEnd).isBefore(new Date())){
				condition = false
			} else { condition = true }
			return condition;
		},

		repositoriesNames(){
			let repositoriesNames = [];
			this.repositories.forEach(repository => {
				repositoriesNames.push(repository.name)
			});
			return repositoriesNames;
		}
	},
	methods: {
		moment: function (date) {
            this.$moment.locale(this.$i18n.locale)
            return this.$moment(date);
		},

		openModal() {
			this.$modal.show(TeamModal, {
				props: {
					users: this.users
				},
				label: "team-member-window",
				classes: "modal",
				attributes: {
					id: "team-modal",
					role: "dialog",
					'aria-labelledby': "modalTitle",
					'aria-describedby': "modalDescription",
					tabindex: "0"
				}
			});
		},

		getAuditResult(audit){
			this.statusResultService.findMainStatusResultByAudit(
					audit.id,
					undefined,
					(statusResults) => {
						audit.statusResults = statusResults;
						this.$set(audit, 'statusResult', statusResults.reduce(
							(result1, result2) => {
								if(result1 == null){
									return result2;
								}else{
									return {
										nbTF : result1.nbTF + result2.nbTF,
										nbTCT : result1.nbTCT + result2.nbTCT,
										nbTP : result1.nbTP + result2.nbTP,
										nbTI : result1.nbTI + result2.nbTI,
										nbF : result1.nbF + result2.nbF,
										nbCT : result1.nbCT + result2.nbCT,
										nbP : result1.nbP + result2.nbP,
										nbI : result1.nbI + result2.nbI,
										nbU : result1.nbU + result2.nbU,
										nbET : result1.nbET + result2.nbET,
										nbEF : result1.nbEF + result2.nbEF
									}
								}
							}, null
						))
					},
					(error) => {
						console.error(error)
					}
			)
		},
		toggleProject() {
			this.projectOpen = !this.projectOpen;
			if(this.projectOpen && this.lastAudit && !this.lastAuditFirstPageContent){
				this.auditService.findLastByProjectAndType(
					this.project.id,
					'PAGE',
					(audit) => {
						this.lastPageAudit = audit;
						if(audit){
							this.getAuditResult(audit);
						}
					},
					(error) => {
						console.error(error)
					}
				);

				this.auditService.findLastByProjectAndType(
					this.project.id,
					'SITE',
					(audit) => {
						this.lastSiteAudit = audit;
						if(audit){
							this.getAuditResult(audit);
						}
					},
					(error) => {
						console.error(error)
					}
				);

				this.auditService.findLastByProjectAndType(
					this.project.id,
					'UPLOAD',
					(audit) => {
						this.lastUploadAudit = audit;
						if(audit){
							this.getAuditResult(audit);
						}
					},
					(error) => {
						console.error(error)
					}
				);

				this.auditService.findLastByProjectAndType(
					this.project.id,
					'SCENARIO',
					(audit) => {
						this.lastScenarioAudit = audit;
						if(audit){
							this.getAuditResult(audit);
						}
					},
					(error) => {
						console.error(error)
					}
				);

				this.userService.findAllByProject(
					this.project.id,
					(users) => {
						this.users = users
						let currentUser = this.users.find(user =>
							user.contractAppUser.user.id === this.$store.state.auth.user.id
						)
						if(currentUser){
							this.currentUserRole = currentUser[0].projectRole.name
						}
					},
					(error) => console.error(error)
				)
			}
		},

		activeTab(){
			this.$store.state.activeTab.name = 'information'
		}
	}
}
</script>

<style lang="scss" scoped>
/* Modal style */
@import 'vue-accessible-modal/src/styles/core.scss';

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.48s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
	opacity: 0;
}

/* Project item  */
.project-item {
	margin-bottom: 4.8rem;
	padding: 1.6rem;
	border-radius: .8rem;
	background-color: $bg-primary;
	box-shadow: 0 2px 16px 0 rgba(5, 90, 127, .1);

	@media #{$media-md-viewport} {
		padding: 3.2rem;
	}
}

/* Project item - Header  */
.project-item-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.project-header-infos {
	margin: 2.4rem 0;

	@media #{$media-md-viewport} {
		align-items: center;
		margin: 0;
	}
}

// Common to header and content project item
.project-stats {
	display: flex;
	align-items: center;

	@media #{$media-md-viewport} {
		margin-right: 1rem;
		justify-content: center;
	}

	.project-stats__error {
		margin: 0 1.5rem 0 0;
		font-family: $font-stack-secondary;
		font-size: $small-font-size;
		line-height: 1;
		text-align: right;
	}

	.project-stats__exergue {
		display: block;
		font-size: $medium-font-size;
		font-weight: 600;
	}

	.project-stats__chart {
		width: 8.1rem;
		height: 8.1rem;
	}

	&.mobile-element {
		.project-stats__chart {
			width: 6.4rem;
			height: 6.4rem;
		}
	}
}

.project-title {
	margin: 0;
	line-height: 1.2;
	word-break: break-all;
}

/* Project item - Content  */
.project-item-content {
	margin-top: 1.6rem;

	@media #{$media-md-viewport} {
		margin-top: 3.2rem;
	}

	.project-item-content__general {
		margin-bottom: 2.4rem;

		@media #{$media-md-viewport} {
			display: flex;
			margin-bottom: 7rem;
			justify-content: space-between;
		}

		.project-item-caps {
			@media #{$media-md-viewport} {
				flex: 0 0 31%;
				min-height: 20rem;
				background-repeat: no-repeat;
				background-position: top right;
				background-size: cover;
				box-shadow: 0 2px 6px 0 rgba(5, 90, 127, .1);
			}
		}

		.project-item-list {
			margin-bottom: .8rem;

			@media #{$media-md-viewport} {
				flex: 0 1 43.5%;
				border-right: 1px solid $border-secondary;
			}
		}

		.project-item-team {
			@media #{$media-md-viewport} {
				flex: 0 1 21.7%;
			}
		}
	}

	.project-item-content__audits {
		@media #{$media-md-viewport} {
			border-top: 2px dashed $border-secondary;
		}
	}
}

/* Project item - Content (Team)  */
.team-title {
	margin: 0 0 1.1rem;
	color: $text-secondary;
	font-size: $medium-font-size;
	font-weight: 600;
}

.team-list {
	font-size: $small-font-size;
	list-style-type: none;

	.team-list__item {
		display: inline-block;

		@media #{$media-md-viewport} {
			display: block;
		}

		&:not(:last-child) {
			margin-right: 1.6rem;
			margin-bottom: 1.6rem;

			@media #{$media-md-viewport} {
				margin-right: 0;
			}
		}
	}

	.team-list__picture {
		display: inline-block;
		width: 3.2rem;
		height: 3.2rem;
		margin-right: .8rem;
		border-radius: 50%;
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		vertical-align: middle;
	}

	.team-list__name {
		display: inline-block;
		font-family: $font-stack-secondary;
		line-height: 1.2;
		vertical-align: middle;
	}
}

.team-link {
	display: inline-block;
	margin-top: 1.6rem;
	font-size: $small-font-size;
}

/* Project item - Content (Audits)  */
.no-audit {
	margin: 0 auto;
	padding: 6.4rem 0;
	border-top: 2px dashed $border-secondary;
	text-align: center;
}

.audits-list {
	border-bottom: 2px dashed $border-secondary;

	@media #{$media-md-viewport} {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		border-bottom: 0;
	}

	.audits-list__item {
		&.audit-list__item--mobile {
			margin-bottom: 1.6rem;
		}

		&.audit-list__item--desktop {
			padding: 4.8rem 0;
			text-align: center;

			@media #{$media-md-viewport} {
				flex: 0 0 30%;
			}
		}
	}
}

.audit-preview {
	.audit-preview__header {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 3.2rem;
	}

	.audit-preview__title {
		margin: 0;
		color: $text-secondary;
		font-family: $font-stack-base;
		font-weight: 600;
	}

	.audit-preview__icon {
		margin-right: .8rem;
	}

	.audit-preview__info {
		margin: 0;
		font-size: $small-font-size;
	}

	.audit-preview__chart {
		position: relative;
		height: 21.3rem;
		margin: 0 auto 2rem;
	}
}

.tests-list {
	max-width: 22.4rem;
	margin: 0 auto;
	list-style-type: none;

	.tests-list__item {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tests-list__label {
		font-weight: bold;

		svg,
		span {
			vertical-align: middle;
		}

		svg {
			margin-right: 1.6rem;
			vertical-align: middle;
		}
	}
}

.link-archives {
	display: block;
	max-width: 22.4rem;
	margin: 5rem auto 0;
	padding: 1.5rem 0;
	border-top: 1px solid $border-secondary;
	border-bottom: 1px solid $border-secondary;
}

.audit-links {
	margin-top: 1.6rem;
	text-align: center;
}

// Responsive class for mobile and desktop views
.mobile-element {
	@media #{$media-md-viewport} {
		display: none;
	}
}

.desktop-element {
	display: none;

	@media #{$media-md-viewport} {
		display: block;
	}
}

.desktop-flex-element {
	display: none;

	@media #{$media-md-viewport} {
		display: flex;
	}
}

</style>
