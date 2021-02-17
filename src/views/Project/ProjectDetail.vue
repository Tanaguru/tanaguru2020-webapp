<template>
    <main v-if="project" id="page" class="wrapper project" role="main">
		<Breadcrumbs :breadcrumbsItems='breadcrumbProps' ></Breadcrumbs>

		<header class="headline headline--top project-header">
			<h1>{{project.name}}</h1>
		</header>

		<Tabs @activeTab='activeTab'>
            <Tab :name="$t('project.infos')" class="tabs-wrapper">
				<article v-if="!modifyProjectForm.active">
					<h2 class="project__title-2">{{$t('project.infos')}}</h2>
					<ul class="infos-list">
						<li>
							<span class="infos-list__exergue">{{$t('entity.project.contract')}}</span> 
							: 
							{{ contract.name }}
							<span class="title-logs__status--error" v-show="$moment(contract.dateEnd).isBefore(new Date())">{{$t('contract.expired')}}</span>    
						</li>
						<li><span class="infos-list__exergue">{{$t('entity.project.domain')}}</span> : <a :href="project.domain"> {{ project.domain }} </a></li>
					</ul>

					<ul class="project-actions-list">
						<li class="project-actions-list__item">
							<button
								v-if="$store.state.auth.authorities['MODIFY_PROJECT']"
								class="btn btn--default"
								@click="showModifyProjectForm()">
								{{$t('action.modify')}}
							</button>
						</li>
						<li class="project-actions-list__item" v-if="!validContract">
							<router-link class="btn btn--default btn--icon" :to="'/projects/' + project.id + '/audit'">
								<icon-base-decorative width="16" height="16" viewBox="0 0 20 20"><icon-launch /></icon-base-decorative>
								<span>{{$t('action.auditNewStart')}}</span>
							</router-link>
						</li>

						<li class="project-actions-list__item">
							<router-link class="link-independent link-independent--icon" :to="'/projects/' + project.id + '/archives'" >
								<icon-base-decorative width="16" height="16" viewBox="0 0 24 24"><icon-version /></icon-base-decorative>
								<span>{{$t('action.archives')}}</span>
							</router-link>
						</li>
					</ul>
				</article>
				<article v-else>
					<form @submit.prevent="modifyProject">
						<div class="form-row">
							<div class="form-column">
								<div class="form-block">
									<label class="label" for="name1">{{$t('entity.project.name')}} * :</label>
									<input
										class="input"
										type="text"
										name="name"
										id="name1"
										v-model="modifyProjectForm.name"
										:aria-describedby="nameDescribedBy"
										required>
									<p class="info-text" id="name-constraint">{{ $t('form.indications.nameConstraint') }}</p>
									<p v-if="modifyProjectForm.nameError" class="info-error" id="name-error">{{modifyProjectForm.nameError}}</p>
								</div>
							</div>

							<div class="form-column">
								<div class="form-block">
									<label class="label" for="domain">{{$t('entity.project.domain')}} * :</label>
									<input
										class="input"
										type="text"
										name="domain"
										id="domain"
										v-model="modifyProjectForm.domain"
										:aria-describedby="domainDescribedBy"
										required>
									<p class="info-text" id="domain-constraint">{{ $t('form.indications.urlConstraint') }}</p>
									<p v-if="modifyProjectForm.domainError" class="info-error" id="domain-error">{{modifyProjectForm.domainError}}</p>
								</div>
							</div>
						</div>

						<button class="btn btn--default" type="submit">{{$t('action.modify')}}</button>
						<p v-if="modifyProjectForm.error" class="info-error">{{modifyProjectForm.error}}</p>
					</form>
				</article>
			</Tab>

			<!-- USERS BY Project -->
			<Tab :name="$t('project.users')" class="tabs-wrapper">
				<article v-show="managerCondition">
					<h2 class="project__title-2">{{$t('project.users')}}</h2>
					<p>{{$t('form.indications.help')}}</p>
					<form @submit.prevent="addUser" class="form-users" novalidate>
						<div class="form-block">
							<label class="label" for="user-select">{{$t('entity.user.username')}} *</label>
							<div class="select">
								<select
									id="user-select"
									name="user-select"
									v-model="userAdditionForm.id"
									:aria-describedby="userAdditionDescribedby"
									required>
									<option value="" disabled>{{ $t('project.selectUser') }}</option>
									<option v-for="user in contractUsers" :value="user.user.id" :key="user.user.username">{{ user.user.username }}</option>
								</select>
							</div>
							<p v-if="userAdditionForm.error" class="info-error" id="user-error">{{ userAdditionForm.error }}</p>
							<p v-if="userAdditionForm.successMsg" class="info-success" id="user-success">{{ userAdditionForm.successMsg }}</p>
						</div>

						<button class="btn btn--default" type="submit">{{$t('action.addUser')}}</button>
					</form>
				</article>

				<ProjectUserTable 
					:users="projectUsers" 
					@remove-user="removeUser" 
					@promote-user="promoteUser" 
					:managerCondition="managerCondition" 
					:promoteSuccessMsg="promoteSuccessMsg" />
			</Tab>
		</Tabs>

	    <BackToTop />

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
<<<<<<< HEAD
				modifyProjectForm: {
					active: false,
					name: "",
					domain: "",
					nameError: "",
					domainError: ""
				}
=======
>>>>>>> develop
			}
		},
		metaInfo(){
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
		created(){			
			this.projectService.findById(
				this.$route.params.id,
				(project) => {
					this.project = project
					this.breadcrumbProps.push({
						name : 'Administration',
						path : '/administration'
					})
                    this.breadcrumbProps.push({
                        name : this.project.contract.name,
                        path : '/contracts/' + this.project.contract.id
					})
					this.breadcrumbProps.push({
                        name : this.project.name,
                        path : '/projects/' + this.project.id
                    })

					this.userService.findAllByProject(
						this.project.id,
						(users) => {
							this.projectUsers = users
							let currentUser = this.projectUsers.filter(user =>
								user.contractAppUser.user.id == this.$store.state.auth.user.id
							)
							this.currentUserRole = currentUser[0].projectRole.name
						},
						(error) => { 'error' }
					)

					this.contract = this.project.contract
					this.validContract = this.$moment(this.contract.dateEnd).isBefore(new Date())

					this.userService.findAllByContract(
						this.contract.id,
						(users) => {
							this.contractUsers = users
						},
						(error) => { 'error' }
					)
				},
				(error) => { this.$router.replace('/404') }
			)
		},
		computed: {
			auditCondition(){
				let condition = false
				if(this.$store.state.auth.user.appRole.name == 'SUPER_ADMIN' || this.$store.state.auth.user.appRole.name == 'ADMIN'){
					condition = true
				}
				else if(this.currentUserRole == 'PROJECT_MANAGER' || this.currentUserRole
				 == 'PROJECT_USER'){
					condition = true
				}
				return condition;
			},

			managerCondition(){
				let condition = false
				if(this.$store.state.auth.user.appRole.name == 'SUPER_ADMIN' || this.$store.state.auth.user.appRole.name == 'ADMIN'){
					condition = true
				}
				else if(this.currentUserRole == 'PROJECT_MANAGER'){
					condition = true
				}
				return condition;
			},

			userAdditionDescribedby(){
				let description = '';
				if(this.userAdditionForm.successMsg){
					description = 'user-success'
				} else if(this.userAdditionForm.error){
					description = "user-error"
				}
				return description;
			},

			nameDescribedBy(){
				let description = 'name-constraint';
				if(this.modifyProjectForm.nameError){
					description = 'name-error name-constraint'
				}
				return description;
			},

			domainDescribedBy(){
				let description = 'domain-constraint';
				if(this.modifyProjectForm.domainError){
					description = 'domain-error domain-constraint'
				}
				return description;
			},
		},
		methods: {
			activeTab(value){
				this.selectedTab = value
			},
<<<<<<< HEAD

			showModifyProjectForm(){
				this.modifyProjectForm.name = this.project.name;
				this.modifyProjectForm.domain = this.project.domain;
            	this.modifyProjectForm.active = true;
			},
			modifyProject(){
				if(this.modifyProjectForm.name.length === 0){
					this.modifyProjectForm.nameError = this.$i18n.t("form.errorMsg.emptyInput");
				} else if(this.modifyProjectForm.name.length > 50){
					this.modifyProjectForm.nameError = this.$i18n.t("form.errorMsg.others.nameError")
				}

				if(this.contract.restrictDomain) {
					let urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

					if(!urlRegex.test(this.auditConfigurationForm.common.url)){
						this.modifyProjectForm.domainError = this.$i18n.t("form.errorMsg.others.urlError")
					}
				}

				this.projectService.modifyById(
					this.project.id,
					this.modifyProjectForm.name,
					this.modifyProjectForm.domain,
					(project) => {
						this.project = project;
                        this.modifyProjectForm.active = false;
                    },
                    (error) => {
						console.log(error)
					}
				)

				this.modifyProjectForm.error = "";
				this.modifyProjectForm.nameError = "";
				this.modifyProjectForm.domainError = "";
				this.modifyProjectForm.name = "";
				this.modifyProjectForm.domain = "";
			},

=======
>>>>>>> develop
			removeUser(user){
				var index = this.projectUsers.indexOf(user);
				if(index > -1){
					this.projectService.removeMember(
						user.contractAppUser.user.id,
						this.project.id,
						(project) => {
							this.projectUsers.splice(index, 1)
						},
						(error) => {
							if(err.response.data.error == "PROJECT_NOT_FOUND"){
								this.userRemoveError = this.$i18n.t("form.errorMsg.project.notFound")
							} else if(err.response.data.error == "USER_NOT_FOUND"){
								this.userRemoveError = this.$i18n.t("form.errorMsg.user.notFound")
							} else if(err.response.status == "403"){
								this.userRemoveError = this.$i18n.t("form.errorMsg.user.permissionDenied")
							} else {  
								this.userRemoveError = this.$i18n.t("form.errorMsg.genericError");
							}
						}
					)
				}
			},

			promoteUser(user){
				var index = this.projectUsers.indexOf(user);
				if(index > -1){
					this.projectService.promoteMember(
						user.contractAppUser.user.id,
						user.projectRole.name,
						this.project.id,
						(project) => {
							user.projectRole.name = user.projectRole.name
						},
						(error) => {
							if(err.response.data.error == "CANNOT_PROMOTE_YOURSELF"){
								this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.user.promoteSelf")
							} else if (err.response.data.error == "PROJECT_CANNOT_PROMOTE_USER"){
								this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.user.notAllowed")
							} else if (err.response.data.error == "CANNOT_PROMOTE_CONTRACT_OWNER"){
								this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.user.promoteOwner")
							} else if (err.response.data.error == "USER_NOT_FOUND_FOR_PROJECT"){
								this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.user.userDoesntBelong")
							} else if(err.response.data.error == "USER_NOT_FOUND"){
								this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.user.notFound")
							} else if(err.response.data.error == "PROJECT_NOT_FOUND"){
								this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.project.notFound")
							} else if(err.response.status == "403"){
								this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.user.permissionDenied")
							} else {  
								this.modifyProjectForm.error = this.$i18n.t("form.errorMsg.genericError");
							}
						}

					)
				}
			},

			addUser(user){
				if(!this.userAdditionForm.id){
					this.userAdditionForm.error = this.$i18n.t('form.errorMsg.emptyInput')
				} else {
					this.projectService.addMember(
						this.userAdditionForm.id,
						this.project.id,
						(user) => {
							this.projectUsers.push(user)
							this.userAdditionForm.successMsg = this.$i18n.t("form.successMsg.userProjectAddition")
						},
						(error) => {
							if(err.response.data.error == "PROJECT_NOT_FOUND"){
								this.userAdditionForm.error = this.$i18n.t("form.errorMsg.project.notFound")
							} else if(err.response.data.error == "USER_NOT_FOUND"){
								this.userAdditionForm.error = this.$i18n.t("form.errorMsg.user.notFound")
							} else if(err.response.status == "403"){
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
