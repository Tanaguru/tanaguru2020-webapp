<template>
	<main v-if="project" id="page" class="wrapper project" role="main">
		<Breadcrumbs :breadcrumbsItems='breadcrumbProps'></Breadcrumbs>

		<header class="headline headline--top project-header">
			<h1>{{ project.name }}</h1>
		</header>
		<Tabs @activeTab='activeTab'>
			<Tab :name="$t('project.infos')" class="tabs-wrapper">
				<div v-if="!modifyProjectForm.active">
					<h2 class="project__title-2">{{ $t('project.infos') }}</h2>
					<ul class="infos-list">
						<li>
							<span class="infos-list__exergue">{{ $t('entity.project.contract') }}</span>
							:
							{{ contract.name }}
							<span class="title-logs__status--error"
								  v-show="$moment(contract.dateEnd).isBefore(new Date())">{{
									$t('contract.expired')
								}}</span>
						</li>
						<li><span class="infos-list__exergue">{{ $t('entity.project.domain') }}</span> : <a
							:href="project.domain"> {{ project.domain }} </a></li>
					</ul>

					<ul class="project-actions-list">
						<li class="project-actions-list__item" v-if="contract.allowModifyProject">
							<button
								v-if="$store.state.auth.authorities['MODIFY_PROJECT'] ||
									(currentUserRole &&
									currentUserRole.authorities.some((elem) => elem.name === 'MODIFY_PROJECT'))"
								class="btn btn--default"
								@click="toggleModifyProjectForm()">
								{{ $t('action.modify') }}
							</button>
						</li>
						<li class="project-actions-list__item" v-if="!validContract && canStartAudit">
							<router-link class="btn btn--default btn--icon" :to="'/projects/' + project.id + '/audit'">
								<icon-base-decorative width="16" height="16" viewBox="0 0 20 20">
									<icon-launch/>
								</icon-base-decorative>
								<span>{{ $t('action.auditNewStart') }}</span>
							</router-link>
						</li>

						<li class="project-actions-list__item">
							<router-link class="link-independent link-independent--icon"
										 :to="'/projects/' + project.id + '/archives'">
								<icon-base-decorative width="16" height="16" viewBox="0 0 24 24">
									<icon-version/>
								</icon-base-decorative>
								<span>{{ $t('action.archives') }}</span>
							</router-link>
						</li>
					</ul>

					<p v-if="modifyProjectForm.successMsg" class="info-success" aria-live="polite">{{ modifyProjectForm.successMsg }}</p>

				</div>

				<div v-else>
					<form @submit.prevent="modifyProject">
						<div class="form-row">
							<div class="form-column">
								<div class="form-block">
									<label class="label" for="name1">{{ $t('entity.project.name') }} * :</label>
									<input
										class="input"
										type="text"
										name="name"
										id="name1"
										v-model="modifyProjectForm.name"
										:aria-describedby="nameDescribedBy"
										required>
									<p class="info-text" id="name-constraint">{{ $t('form.indications.nameConstraint') }}</p>
									<p v-if="modifyProjectForm.nameError" class="info-error" id="name-error">
										{{ modifyProjectForm.nameError }}</p>
								</div>
							</div>

							<div class="form-column">
								<div class="form-block" v-if="!project.contract.restrictDomain">
									<label class="label" for="domain">{{ $t('entity.project.domain') }} * :</label>
									<input
										class="input"
										type="text"
										name="domain"
										id="domain"
										v-model="modifyProjectForm.domain"
										:aria-describedby="domainDescribedBy"
										required>
									<p class="info-text" id="domain-constraint">{{ $t('form.indications.urlConstraint') }}</p>
									<p v-if="modifyProjectForm.domainError" class="info-error" id="domain-error">
										{{ modifyProjectForm.domainError }}</p>
								</div>
							</div>
						</div>

						<div class="form-row">
							<div class="form-column">
								<div class="form-block">
									<button class="btn btn--default" type="submit">{{ $t('action.modify') }}</button>
									<p v-if="modifyProjectForm.error" class="info-error">{{ modifyProjectForm.error }}</p>

									<button id="cancel-button" class="btn btn--default" type="button" @click="toggleBackToInfo">{{ $t('action.cancel') }}</button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</Tab>

			<!-- USERS BY Project -->
			<Tab :name="$t('project.users')" class="tabs-wrapper">
				<div v-show="managerCondition">
					<h2 class="project__title-2">{{ $t('project.users') }}</h2>
					<form @submit.prevent="addUser" v-if='contract.allowModifyProject' class="form-users" novalidate>
						<p>{{ $t('form.indications.help') }}</p>
						<div class="form-block">
							<label class="label" for="user-select">{{ $t('entity.user.username') }} *</label>
							<div class="select">
								<select
									id="user-select"
									name="user-select"
									v-model="userAdditionForm.id"
									:aria-describedby="userAdditionDescribedby"
									required>
									<option value="" disabled>{{ $t('project.selectUser') }}</option>
									<option v-for="user in contractUsers" :value="user.user.id"
											:key="user.user.username">{{ user.user.username }}
									</option>
								</select>
							</div>
							<p v-if="userAdditionForm.error" class="info-error" id="user-error">
								{{ userAdditionForm.error }}</p>
							<p v-if="userAdditionForm.successMsg" class="info-success" id="user-success">
								{{ userAdditionForm.successMsg }}</p>
						</div>

						<button class="btn btn--default" type="submit">{{ $t('action.addUser') }}</button>
					</form>
				</div>

				<ProjectUserTable
					:users="projectUsers"
					@remove-user="removeUser"
					@promote-user="promoteUser"
					:managerCondition="managerCondition"
					:promoteSuccessMsg="promoteSuccessMsg"/>
			</Tab>
		</Tabs>

		<BackToTop/>

	</main>
</template>

<script>
import Tabs from './../../components/Tabs'
import Tab from './../../components/Tab'
import Breadcrumbs from '../../components/Breadcrumbs';
import ProjectUserTable from './ProjectUserTable';
import BackToTop from '../../components/BackToTop';
import IconBaseDecorative from '../../components/icons/IconBaseDecorative';
import IconArrowBlue from '../../components/icons/IconArrowBlue';
import IconDelete from '../../components/icons/IconDelete';
import IconLaunch from '../../components/icons/IconLaunch';
import IconVersion from '../../components/icons/IconVersion';
import DomainHelper from '../../helper/DomainHelper';

export default {
	name: 'projectDetail',
	components: {
		Tabs,
		Tab,
		Breadcrumbs,
		BackToTop,
		ProjectUserTable,
		IconBaseDecorative,
		IconArrowBlue,
		IconDelete,
		IconLaunch,
		IconVersion,
		DomainHelper
	},
	data() {
		return {
			project: [],
			projectUsers: [],
			contract: [],
			validContract: false,
			contractUsers: [],
			audits: [],
			currentUserRole: null,
			userAdditionForm: {
				id: "",
				error: "",
				successMsg: ""
			},
			promoteSuccessMsg: "",
			breadcrumbProps: [
				{
					name: this.$i18n.t('page.dashboard'),
					path: '/'
				},
			],
			selectedTab: null,
			modifyProjectForm: {
                active: false,
                name: "",
				domain: "",
                error: "",
                nameError: "",
				domainError: "",
                successMsg:""
            },
			canStartAudit: false,
			error: false
		}
	},
	metaInfo() {
		return {
			// if no subcomponents specify a metaInfo.title, this title will be used
			title: 'Tanaguru - ' + this.project.name,
			meta: [
				{
					name: 'robots', content: 'noindex'
				}
			]
		}
	},
	created() {
		this.projectService.getCurrentUserAuthorities(
			this.$route.params.id,
			(authorities) => {		
				if(authorities.includes("SHOW_PROJECT")) {
					if(authorities.includes("START_AUDIT")) this.canStartAudit = true;

					this.projectService.findById(
						this.$route.params.id,
						(project) => {
							this.project = project
							this.breadcrumbProps.push({
								name: 'Administration',
								path: '/administration'
							})
							if(this.project.contract.allowCreateProject){
								this.breadcrumbProps.push({
									name: this.project.contract.name,
									path: '/contracts/' + this.project.contract.id
								})
							}
							this.breadcrumbProps.push({
								name: this.project.name,
								path: '/projects/' + this.project.id
							})

							this.userService.findAllByProject(
								this.project.id,
								(users) => {
									this.projectUsers = users
									let currentUser = this.projectUsers.filter(user =>
										user.contractAppUser.user.id == this.$store.state.auth.user.id
									)
									this.currentUserRole = currentUser[0].projectRole
								},
								(error) => {
									'error'
								}
							)

							this.contract = this.project.contract
							this.validContract = this.$moment(this.contract.dateEnd).isBefore(new Date())

							this.userService.findAllByContract(
								this.contract.id,
								(users) => {
									this.contractUsers = users
								},
								(error) => {
									'error'
								}
							)
						},
						(error) => {
							console.log(error);
						}
					)
				} else {
					this.$router.replace('/forbidden');
				}
			},
			(error) => {
				console.log(error);
			}
		)
	},
	computed: {
		managerCondition() {
			return this.$store.state.auth.user.appRole.overrideContractRole.authorities
				.find(authority => authority.name === 'INVITE_MEMBER')

		},

		userAdditionDescribedby() {
			let description = '';
			if (this.userAdditionForm.successMsg) {
				description = 'user-success'
			} else if (this.userAdditionForm.error) {
				description = "user-error"
			}
			return description;
		},

		nameDescribedBy() {
			let description = 'name-constraint';
			if (this.modifyProjectForm.nameError) {
				description = 'name-error name-constraint'
			}
			return description;
		},

		domainDescribedBy() {
			let description = 'domain-constraint';
			if (this.modifyProjectForm.domainError) {
				description = 'domain-error domain-constraint'
			}
			return description;
		},
	},
	methods: {
		
		activeTab(value) {
			this.selectedTab = value
		},
        checkValidDomain: DomainHelper.checkValidDomain,

		toggleModifyProjectForm(){
            this.modifyProjectForm.name = this.project.name;
            this.modifyProjectForm.domain = this.project.domain;
            this.modifyProjectForm.active = !this.modifyProjectForm.active;
        },

		toggleBackToInfo(){
            this.modifyProjectForm.active = !this.modifyProjectForm.active;
		},

		modifyProject() {
			if (this.modifyProjectForm.name.length === 0) {
				this.modifyProjectForm.nameError = this.$i18n.t("form.errorMsg.emptyInput");
				this.error = true;
			} else if (this.modifyProjectForm.name.length > 50) {
				this.modifyProjectForm.nameError = this.$i18n.t("form.errorMsg.others.nameError")
				this.error = true;
			}

			if (!this.project.contract.restrictDomain) {
				if (!this.checkValidDomain(this.modifyProjectForm.domain)) {
					this.modifyProjectForm.domainError = this.$i18n.t("form.errorMsg.others.urlError")
					this.error = true;
				}
			}

			if(this.error === false) {
				this.projectService.modifyById(
					this.project.id,
					this.modifyProjectForm.name,
					this.modifyProjectForm.domain,
					this.contract.id,
					(project) => {
						this.project = project;
						this.modifyProjectForm.error = "";
						this.modifyProjectForm.nameError = "";
						this.modifyProjectForm.domainError = "";
						this.modifyProjectForm.name = "";
						this.modifyProjectForm.domain = "";

						this.modifyProjectForm.active = false;
					},
					(error) => {
						console.error(error)
					}
				);

				this.modifyProjectForm.successMsg = this.$i18n.t('form.successMsg.savedChanges')
				setTimeout(() => (
					this.modifyProjectForm.successMsg = ""
				), 3000)
			}
		},

		onProjectUpdate(project) {
			this.modifyProjectForm.success = this.$i18n.t("form.successMsg.savedChanges");
			this.project = project;
		},

		removeUser(user) {
			var index = this.projectUsers.indexOf(user);
			if (index > -1) {
				this.projectService.removeMember(
					user.contractAppUser.user.id,
					this.project.id,
					(project) => {
						this.projectUsers.splice(index, 1)
					},
					(error) => {
						if (err.response.data.error == "PROJECT_NOT_FOUND") {
							this.userRemoveError = this.$i18n.t("form.errorMsg.project.notFound")
						} else if (err.response.data.error == "USER_NOT_FOUND") {
							this.userRemoveError = this.$i18n.t("form.errorMsg.user.notFound")
						} else if (err.response.status == "403") {
							this.userRemoveError = this.$i18n.t("form.errorMsg.user.permissionDenied")
						} else {
							this.userRemoveError = this.$i18n.t("form.errorMsg.genericError");
						}
					}
				)
			}
		},

		promoteUser(user) {
			var index = this.projectUsers.indexOf(user);
			if (index > -1) {
				this.projectService.promoteMember(
					user.contractAppUser.user.id,
					user.projectRole.name,
					this.project.id,
					(project) => {
						user.projectRole.name = user.projectRole.name
					},
					(error) => {
						if (err.response.data.error == "CANNOT_PROMOTE_YOURSELF") {
							this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.user.promoteSelf")
						} else if (err.response.data.error == "PROJECT_CANNOT_PROMOTE_USER") {
							this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.user.notAllowed")
						} else if (err.response.data.error == "CANNOT_PROMOTE_CONTRACT_OWNER") {
							this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.user.promoteOwner")
						} else if (err.response.data.error == "USER_NOT_FOUND_FOR_PROJECT") {
							this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.user.userDoesntBelong")
						} else if (err.response.data.error == "USER_NOT_FOUND") {
							this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.user.notFound")
						} else if (err.response.data.error == "PROJECT_NOT_FOUND") {
							this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.project.notFound")
						} else if (err.response.status == "403") {
							this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.user.permissionDenied")
						} else {
							this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.genericError");
						}
					}
				)
			}
		},

		addUser(user) {
			if (!this.userAdditionForm.id) {
				this.userAdditionForm.error = this.$i18n.t('form.errorMsg.emptyInput')
			} else {
				this.projectService.addMember(
					this.userAdditionForm.id,
					this.project.id,
					(user) => {
						this.projectUsers.push(user)
						this.userAdditionForm.successMsg = this.$i18n.t("form.successMsg.userProjectAddition")
					},
					(err) => {
						if (err.response.data.error == "PROJECT_NOT_FOUND") {
							this.userAdditionForm.error = this.$i18n.t("form.errorMsg.project.notFound")
						} else if (err.response.data.error == "USER_NOT_FOUND") {
							this.userAdditionForm.error = this.$i18n.t("form.errorMsg.user.notFound")
						} else if (err.response.status == "403") {
							this.userAdditionForm.error = this.$i18n.t("form.errorMsg.user.permissionDenied")
						} else {
							this.userAdditionForm.error = this.$i18n.t("form.errorMsg.genericError");
						}
					}
				)
			}
			this.userAdditionForm.id = null;
		},
	}
}
</script>

<style lang="scss" scoped>
.project {
	.project__title-2 {
		margin-top: 6.2rem;
		margin-bottom: 3.1rem;
	}
}

.title-logs__status--error {
	padding: .2rem .3rem;
	border-radius: .2rem;
	color: $color-white;
	background-color: $color-alert;
}

.project-actions-list {
	margin: 3.2rem 0 0;
	padding: 0;
	list-style: none;

	@media #{$media-xs-viewport} {
		display: flex;
		align-items: center;
	}

	.project-actions-list__item {
		&:not(:last-child) {
			margin-bottom: 1.6rem;

			@media #{$media-xs-viewport} {
				margin-right: 1.6rem;
				margin-bottom: 0;
			}
		}
	}
}

#cancel-button {
	margin-left: 2rem;
}

.form-users {
	margin-bottom: 4.6rem;

	.select {
		max-width: 45rem;
	}
}

.table-users {
	margin-top: 3.2rem;

	td {
		vertical-align: top;
	}

	.select {
		margin-bottom: .8rem;
	}
}
</style>
